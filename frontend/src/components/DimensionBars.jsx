import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';

const ALL_DIMENSIONS = [
  { key: 'tradition' },
  { key: 'proactive' },
  { key: 'heroism' },
  { key: 'pragmatism' },
  { key: 'control' },
  { key: 'resilience' },
  { key: 'physicality' },
  { key: 'adaptability' },
];

const SIMPLE_DIMENSIONS = [
  { key: 'tradition' },
  { key: 'proactive' },
  { key: 'heroism' },
  { key: 'pragmatism' },
];

export default function DimensionBars({ scores, quizMode }) {
  const lang = useLangStore((state) => state.lang);
  const t = translations[lang].result;
  const dims = quizMode === 'simple' ? SIMPLE_DIMENSIONS : ALL_DIMENSIONS;

  return (
    <div className="w-full space-y-4 mt-8">
      <h3 className="text-lg font-bold text-zinc-400 font-mono tracking-widest text-center md:text-left mb-4">
        {t.dimensionTitle}
      </h3>
      {dims.map((dim) => {
        const value = scores[dim.key] ?? 50;
        const leftPercent = Math.max(5, Math.min(95, 100 - value));
        const rightPercent = 100 - leftPercent;
        const labels = t.dimensions[dim.key];

        return (
          <div key={dim.key} className="w-full">
            <div className="flex justify-between text-xs font-bold text-zinc-400 mb-1.5 tracking-widest font-mono">
              <span>{labels.left}</span>
              <span>{labels.right}</span>
            </div>
            <div className="relative w-full h-3 overflow-hidden flex border border-zinc-800">
              <div
                className="h-full transition-all duration-1000 ease-out bg-zinc-600"
                style={{ width: `${leftPercent}%` }}
              />
              <div
                className="h-full transition-all duration-1000 ease-out bg-green-500/60"
                style={{ width: `${rightPercent}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-1 bg-green-500 transition-all duration-1000 ease-out"
                style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5 font-mono">
              <span>{leftPercent.toFixed(0)}%</span>
              <span>{rightPercent.toFixed(0)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}