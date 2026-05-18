
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';

const ALL_DIMENSIONS = [
  { key: 'tradition', colorLeft: '#f59e0b', colorRight: '#8b5cf6' },
  { key: 'proactive', colorLeft: '#3b82f6', colorRight: '#ef4444' },
  { key: 'heroism', colorLeft: '#10b981', colorRight: '#f97316' },
  { key: 'pragmatism', colorLeft: '#ec4899', colorRight: '#6366f1' },
  { key: 'control', colorLeft: '#14b8a6', colorRight: '#a855f7' },
  { key: 'resilience', colorLeft: '#84cc16', colorRight: '#dc2626' },
  { key: 'physicality', colorLeft: '#06b6d4', colorRight: '#f43f5e' },
  { key: 'adaptability', colorLeft: '#eab308', colorRight: '#7c3aed' },
];

const SIMPLE_DIMENSIONS = [
  { key: 'tradition', colorLeft: '#f59e0b', colorRight: '#8b5cf6' },
  { key: 'proactive', colorLeft: '#3b82f6', colorRight: '#ef4444' },
  { key: 'heroism', colorLeft: '#10b981', colorRight: '#f97316' },
  { key: 'pragmatism', colorLeft: '#ec4899', colorRight: '#6366f1' },
];

export default function DimensionBars({ scores, quizMode }) {
  const lang = useLangStore((state) => state.lang);
  const t = translations[lang].result;
  const dims = quizMode === 'simple' ? SIMPLE_DIMENSIONS : ALL_DIMENSIONS;

  return (
    <div className="w-full space-y-4 mt-8">
      <h3 className="text-lg font-bold text-slate-300 text-center md:text-left mb-4">
        {t.dimensionTitle}
      </h3>
      {dims.map((dim) => {
        const value = scores[dim.key] ?? 50;
        const leftPercent = Math.max(5, Math.min(95, 100 - value));
        const rightPercent = 100 - leftPercent;
        const labels = t.dimensions[dim.key];

        return (
          <div key={dim.key} className="w-full">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              <span style={{ color: dim.colorLeft }}>{labels.left}</span>
              <span style={{ color: dim.colorRight }}>{labels.right}</span>
            </div>
            <div className="relative w-full h-3 rounded-full overflow-hidden flex">
              <div
                className="h-full transition-all duration-1000 ease-out"
                style={{ width: `${leftPercent}%`, backgroundColor: dim.colorLeft }}
              />
              <div
                className="h-full transition-all duration-1000 ease-out"
                style={{ width: `${rightPercent}%`, backgroundColor: dim.colorRight }}
              />
              <div
                className="absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out"
                style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
              <span>{leftPercent.toFixed(0)}%</span>
              <span>{rightPercent.toFixed(0)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
