import { useState } from 'react';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';
import { ChevronDown } from 'lucide-react';

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
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (key) => {
    setExpanded(prev => prev === key ? null : key);
  };

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
        const analysis = t.dimensionAnalysis?.[dim.key];
        const isOpen = expanded === dim.key;

        return (
          <div key={dim.key}>
            <button
              onClick={() => toggleExpand(dim.key)}
              className="w-full text-left cursor-pointer group focus:outline-none"
            >
              <div className="flex justify-between text-xs font-bold text-zinc-400 mb-1.5 tracking-widest font-mono">
                <span>{labels.left}</span>
                <span className="flex items-center gap-1">
                  {labels.right}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
              <div className="relative w-full h-3 overflow-hidden flex border border-zinc-800 group-hover:border-zinc-600 transition-colors">
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
            </button>
            {analysis && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <div className="bg-zinc-900 border border-zinc-800 p-3 md:p-4 text-sm text-zinc-400 leading-relaxed">
                  {analysis}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}