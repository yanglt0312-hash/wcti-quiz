// 本地开发用的 mock API 服务器
// 启动: node api/dev-server.js
// 这个服务模拟 Vercel Serverless Function 的行为，但用本地内存代替 KV

import http from 'http';
import crypto from 'crypto';

const PORT = 3001;
const CACHE = new Map(); // 本地内存缓存
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 天

// 指数退避请求函数
async function fetchWithBackoff(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        if (attempt === maxRetries) throw new Error('尝试多次依然被限流');
        const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.log(`[Rate Limit] 等待 ${waitTime.toFixed(0)}ms 后重试...`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      return response;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      await new Promise(r => setTimeout(r, waitTime));
    }
  }
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/generate-report') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  // 读取 body
  let body = '';
  for await (const chunk of req) body += chunk;

  try {
    const { archetype_name, buff_1_name, buff_2_name, debuff_name } = JSON.parse(body);

    if (!archetype_name || !buff_1_name || !buff_2_name || !debuff_name) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '缺少必要战术标签参数' }));
      return;
    }

    const rawString = `${archetype_name}_${buff_1_name}_${buff_2_name}_${debuff_name}`;
    const hashKey = crypto.createHash('md5').update(rawString).digest('hex');
    const cacheKey = `wcti_report_${hashKey}`;

    // 查本地缓存
    const cached = CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[Cache Hit] ${cacheKey}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: 200, data: cached.data, message: 'success (from cache)' }));
      return;
    }

    console.log(`[Cache Miss] ${cacheKey}`);

    const prompt = `你是一个供职于欧洲顶级豪门的首席数据与战术分析师。你的任务是根据系统提供给你的【球队战术标签】，扩写成一份高度专业、严肃、充满足球战术洞察的最终《战术球探报告》。

输入数据:
- 主战术原型：${archetype_name}
- 战术优势标签：${buff_1_name}, ${buff_2_name}
- 潜在隐患标签：${debuff_name}

请严格输出为 JSON 格式，不包含任何 Markdown 代码块包裹，结构如下：
{
  "tactical_profile": {
    "archetype": "原型名称",
    "philosophy": "15-20字的高度凝练的战术哲学",
    "overview": "60-80字，详尽且专业地描述这种体系在球场上的运转方式，阵型特点及核心驱动力"
  },
  "strengths": [
    {
      "trait_name": "${buff_1_name}",
      "analysis": "40-50字，结合专业的足球术语，解释该优势如何在比赛中转化为压倒性的战术红利"
    },
    {
      "trait_name": "${buff_2_name}",
      "analysis": "40-50字，解释该优势如何在比赛中发挥作用"
    }
  ],
  "vulnerabilities": {
    "trait_name": "${debuff_name}",
    "analysis": "40-50字，客观、一针见血地指出该隐患在何种局势或面对何种对手时，会成为阿喀琉斯之踵"
  },
  "match_chemistry": {
    "best_opponent_style": "推测一种与当前原型风格完全冲突/互补的球队打法类型名称",
    "match_prediction": "40-50字，预测这两支球队交锋时，在战术层面会呈现出怎样的博弈状态"
  }
}

注意：绝对禁止使用中二、搞笑或网络流行梗。使用纯正的现代足球战术术语。`;

    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      throw new Error('未配置 ZHIPU_API_KEY 环境变量');
    }

    const aiRes = await fetchWithBackoff(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: '你是一个专业的足球战术分析师，必须严格按照要求的 JSON 格式输出结果。' },
            { role: 'user', content: prompt }
          ]
        })
      },
      3
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`智谱 API 错误: ${aiRes.status} - ${errText}`);
    }

    const aiJson = await aiRes.json();
    const content = aiJson.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 返回内容为空');

    const reportData = JSON.parse(content);

    // 写入本地缓存
    CACHE.set(cacheKey, { data: reportData, timestamp: Date.now() });
    console.log(`[Cache Set] ${cacheKey}`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: 200, data: reportData, message: 'success' }));

  } catch (err) {
    console.error('generate-report error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '服务器内部错误', details: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`[Dev Server] Mock API running at http://localhost:${PORT}/api/generate-report`);
  console.log(`[Dev Server] 使用前请先设置环境变量: $env:ZHIPU_API_KEY="你的密钥"`);
});