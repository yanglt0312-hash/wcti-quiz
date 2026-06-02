import { kv } from '@vercel/kv';
import crypto from 'crypto';

// 指数退避 + Jitter 请求函数
async function fetchWithBackoff(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // 429 限流时指数退避重试
      if (response.status === 429) {
        if (attempt === maxRetries) {
          throw new Error('尝试多次依然被限流，请稍后再试');
        }
        const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.log(`[Rate Limit] 等待 ${waitTime.toFixed(0)}ms 后第 ${attempt + 1} 次重试...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      // 网络错误也退避
      const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { archetype_name, buff_1_name, buff_2_name, debuff_name } = req.body;

    if (!archetype_name || !buff_1_name || !buff_2_name || !debuff_name) {
      return res.status(400).json({ error: '缺少必要战术标签参数' });
    }

    // 生成哈希缓存键
    const rawString = `${archetype_name}_${buff_1_name}_${buff_2_name}_${debuff_name}`;
    const hashKey = crypto.createHash('md5').update(rawString).digest('hex');
    const cacheKey = `wcti_report_${hashKey}`;

    // 1. 查 KV 缓存
    const cached = await kv.get(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] ${cacheKey}`);
      return res.status(200).json({
        code: 200,
        data: cached,
        message: 'success (from cache)'
      });
    }

    // 2. 缓存未命中，带指数退避调智谱 AI
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

    const aiRes = await fetchWithBackoff(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
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
      3 // 最多重试 3 次
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`智谱 API 错误: ${aiRes.status} - ${errText}`);
    }

    const aiJson = await aiRes.json();
    const content = aiJson.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 返回内容为空');

    const reportData = JSON.parse(content);

    // 3. 写入 KV 缓存，30 天过期
    await kv.set(cacheKey, reportData, { ex: 30 * 24 * 60 * 60 });
    console.log(`[Cache Set] ${cacheKey}`);

    return res.status(200).json({
      code: 200,
      data: reportData,
      message: 'success'
    });

  } catch (err) {
    console.error('generate-report error:', err);
    return res.status(500).json({
      error: '服务器内部错误',
      details: err.message
    });
  }
}