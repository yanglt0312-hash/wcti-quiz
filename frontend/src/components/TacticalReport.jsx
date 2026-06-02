import { useEffect, useRef, useState } from 'react';

export default function TacticalReport({ archetype, buffs, debuffs }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!archetype || fired.current) return;
    fired.current = true;

    const buff1Name = buffs?.[0]?.name || '无明显战术优势';
    const buff2Name = buffs?.[1]?.name || '无明显战术优势';
    const debuffName = debuffs?.[0]?.name || '无明显战术隐患';

    setLoading(true);

    fetch('/api/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        archetype_name: archetype.name,
        buff_1_name: buff1Name,
        buff_2_name: buff2Name,
        debuff_name: debuffName
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || err.details || `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (json.message?.includes('cache')) {
          setFromCache(true);
        }
        setReport(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[TacticalReport] fetch failed:', err);
        setError(err.message || '未知错误');
        setLoading(false);
      });
  }, [archetype, buffs, debuffs]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="border-t border-zinc-800 pt-8 md:pt-10">
        <h3 className="text-base md:text-lg font-black text-zinc-300 mb-6 md:mb-8 tracking-widest font-mono text-center">
          战术报告
        </h3>

        {loading ? (
          <div className="bg-zinc-900 border border-zinc-800 p-5 md:p-6 text-center">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-purple-500 animate-spin mx-auto mb-3"></div>
            <p className="text-zinc-500 text-xs font-mono tracking-widest">
              AI 正在生成战术报告...
            </p>
          </div>
        ) : report ? (
          <div className="bg-zinc-900 border border-zinc-800 p-5 md:p-6 space-y-5">
            {fromCache && (
              <div className="text-right">
                <span className="text-[10px] text-zinc-600 font-mono tracking-wider">
                  来自缓存
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono tracking-wider">
                  {report.tactical_profile?.archetype}
                </span>
              </div>
              <p className="text-zinc-300 text-sm font-bold leading-relaxed mb-1">
                {report.tactical_profile?.philosophy}
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {report.tactical_profile?.overview}
              </p>
            </div>

            {report.strengths?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-green-400 font-mono tracking-widest mb-3">
                  战术优势
                </h4>
                <div className="space-y-3">
                  {report.strengths.map((s, i) => (
                    <div key={i} className="bg-green-500/5 border border-green-500/10 p-3">
                      <div className="text-xs font-bold text-green-400 font-mono tracking-wider mb-1">
                        {s.trait_name}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {s.analysis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.vulnerabilities && (
              <div>
                <h4 className="text-xs font-bold text-red-400 font-mono tracking-widest mb-3">
                  潜在隐患
                </h4>
                <div className="bg-red-500/5 border border-red-500/10 p-3">
                  <div className="text-xs font-bold text-red-400 font-mono tracking-wider mb-1">
                    {report.vulnerabilities.trait_name}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {report.vulnerabilities.analysis}
                  </p>
                </div>
              </div>
            )}

            {report.match_chemistry && (
              <div>
                <h4 className="text-xs font-bold text-zinc-400 font-mono tracking-widest mb-3">
                  战术博弈推演
                </h4>
                <div className="bg-zinc-800/50 border border-zinc-700 p-3">
                  <div className="text-xs font-bold text-zinc-300 font-mono tracking-wider mb-1">
                    {report.match_chemistry.best_opponent_style}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {report.match_chemistry.match_prediction}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 p-5 md:p-6 text-center">
            <p className="text-zinc-500 text-xs font-mono tracking-widest">
              {error ? `AI 战术报告生成失败：${error}` : 'AI 战术报告生成失败，请重试'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}