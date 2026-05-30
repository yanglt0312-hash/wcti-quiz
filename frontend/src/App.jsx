import { useState, useEffect, useRef } from 'react';
import { useQuizStore } from './store/quizStore';
import { useLangStore } from './store/langStore';
import { translations } from './i18n/translations';
import LanguageSwitch from './components/LanguageSwitch';
import DimensionBars from './components/DimensionBars';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Trophy, ChevronRight, RefreshCw, Zap, Check, ArrowLeft } from 'lucide-react';

export default function App() {
  const { currentView, resetQuiz, syncLanguage, tryRestoreProgress } = useQuizStore();
  const lang = useLangStore((state) => state.lang);
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      console.log('[WCTI] App init: trying restore');
      const restored = tryRestoreProgress();
      if (!restored) {
        console.log('[WCTI] App init: no cache, starting fresh');
        syncLanguage(lang);
        resetQuiz();
      }
      return;
    }
    syncLanguage(lang);
    if (useQuizStore.getState().currentView === 'home') {
      resetQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500 selection:text-black">
      <LanguageSwitch />
      <main className="w-full max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 flex flex-col justify-center min-h-screen">
        {currentView === 'home' && <HomeView />}
        {currentView === 'quiz' && <QuizView />}
        {currentView === 'result' && <ResultView />}
      </main>
    </div>
  );
}

function HomeView() {
  const startQuiz = useQuizStore((state) => state.startQuiz);
  const lang = useLangStore((state) => state.lang);
  const t = translations[lang].home;

  return (
    <div className="flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 text-center">
      <div className="space-y-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/40 text-green-500 text-xs font-bold tracking-widest font-mono">
          <Trophy className="w-3.5 h-3.5" />
          {t.badge}
        </div>

        <h1 className="space-y-2">
          <span className="block text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-green-500 italic">
            {t.title}
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-zinc-100">
            {t.headline}
          </span>
        </h1>

        <p className="text-zinc-400 text-sm tracking-widest font-mono font-bold">
          {t.subtitle}
        </p>

        <p className="text-zinc-500 text-base leading-relaxed max-w-lg mx-auto">
          {t.description}
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <button
          onClick={() => startQuiz('simple', lang)}
          className="group w-full py-5 px-6 bg-green-500 hover:bg-green-400 text-black flex flex-col items-center transition-all active:scale-[0.98]"
        >
          <span className="text-lg font-black flex items-center gap-2">
            {t.quickStart} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-black/60 text-xs tracking-widest font-mono font-bold mt-1">{t.quickStartSub}</span>
        </button>

        <button
          onClick={() => startQuiz('pro', lang)}
          className="group w-full py-5 px-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 flex flex-col items-center transition-all active:scale-[0.98] border border-zinc-800"
        >
          <span className="text-lg font-black flex items-center gap-2">
            {t.proStart} <Zap className="w-4 h-4 text-green-500 fill-green-500" />
          </span>
          <span className="text-zinc-500 text-xs tracking-widest font-mono font-bold mt-1">{t.proStartSub}</span>
        </button>
      </div>
    </div>
  );
}

function QuizView() {
  const { currentQuestionIndex, answerQuestion, prevQuestion, activeQuestions, isCalibrationPhase } = useQuizStore();
  const lang = useLangStore((state) => state.lang);
  const t = translations[lang].quiz;
  const navText = {
    prev: lang === 'en' ? 'Previous' : '上一题',
    multiSelect: lang === 'en' ? 'Multiple selections allowed' : '可多选',
    next: lang === 'en' ? 'Next' : '下一题',
    finish: lang === 'en' ? 'Finish' : '完成'
  };
  const [selectedOptions, setSelectedOptions] = useState([]);

  if (!activeQuestions || activeQuestions.length === 0) return null;

  const question = activeQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === activeQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;

  const toggleOption = (idx) => {
    const option = question.options[idx];
    const isMutuallyExclusive = option.assign_tag?.startsWith('no_') || option.assign_tag === 'no_pet';

    setSelectedOptions(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      }

      if (isMutuallyExclusive) {
        return [idx];
      }

      const hasMutuallyExclusive = prev.some(i => {
        const tag = question.options[i].assign_tag;
        return tag?.startsWith('no_') || tag === 'no_pet';
      });
      if (hasMutuallyExclusive) {
        return [idx];
      }

      return [...prev, idx];
    });
  };

  const handleCalibrationSubmit = () => {
    const selectedTags = selectedOptions.map(idx => question.options[idx].assign_tag);
    setSelectedOptions([]);
    answerQuestion(null, 0, isLastQuestion, selectedTags);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in zoom-in-95 duration-500 w-full max-w-4xl mx-auto">
      {currentQuestionIndex > 0 && (
        <button
          onClick={prevQuestion}
          className="self-start flex items-center gap-1 px-3 py-2 md:px-4 md:py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold border border-zinc-800 transition-all active:scale-[0.97] text-xs md:text-sm font-mono tracking-widest"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          {navText.prev}
        </button>
      )}

      <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
        {!isCalibrationPhase && (
          <div className="w-full max-w-md bg-zinc-900 h-2.5 md:h-3 overflow-hidden border border-zinc-800">
            <div
              className="bg-green-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="text-green-500 font-mono font-bold tracking-widest text-xs md:text-sm">
          {isCalibrationPhase ? t.calibration.toUpperCase() : t.decoding.replace('{current}', currentQuestionIndex + 1).replace('{total}', activeQuestions.length)}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-zinc-100">
          {question.text}
        </h2>
        {isCalibrationPhase && (
          <p className="text-zinc-500 text-sm md:text-base font-mono tracking-widest">{navText.multiSelect}</p>
        )}
      </div>

      {isCalibrationPhase ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOptions.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleOption(idx)}
                className={`relative p-4 md:p-5 border text-left transition-all active:scale-[0.97] ${
                  isSelected
                    ? 'bg-green-500/10 border-green-500 text-green-400'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-300'
                }`}
              >
                <span className="font-bold text-sm md:text-base">{opt.text}</span>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:gap-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                answerQuestion(question.dimension, opt.value ?? opt.weight ?? 0, isLastQuestion);
              }}
              className="w-full p-4 md:p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:border-l-4 hover:border-l-green-400 text-left transition-all active:scale-[0.97] text-zinc-300"
            >
              <span className="font-bold text-sm md:text-base">{opt.text}</span>
            </button>
          ))}
        </div>
      )}

      {isCalibrationPhase && (
        <div className="flex justify-center">
          <button
            onClick={handleCalibrationSubmit}
            disabled={selectedOptions.length === 0}
            className={`px-8 py-3 md:px-10 md:py-4 font-bold tracking-widest font-mono transition-all active:scale-[0.97] text-sm md:text-base ${
              selectedOptions.length > 0
                ? 'bg-green-500 hover:bg-green-400 text-black'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
            }`}
          >
            {isLastQuestion ? navText.finish : navText.next}
          </button>
        </div>
      )}

    </div>
  );
}

function ResultView() {
  const { scores, resetQuiz, isLoading, matchResult, quizMode } = useQuizStore();
  const lang = useLangStore((state) => state.lang);
  const t = translations[lang].result;
  const et = translations[lang].error;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 py-16 md:py-24">
        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-zinc-800 border-t-green-500 animate-spin"></div>
        <div className="text-center">
          <p className="text-green-500 font-mono text-lg md:text-xl font-bold animate-pulse tracking-[0.2em]">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!matchResult) {
    return (
      <div className="flex flex-col items-center justify-center space-y-5 md:space-y-6 py-16 md:py-24 animate-in fade-in zoom-in-95 w-full px-4">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-3xl md:text-4xl">⚠️</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-red-400 tracking-widest text-center">{et.dataFailed}</h2>
        <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 max-w-lg text-center text-zinc-400 space-y-2">
          <p className="text-sm md:text-base">{et.dataFailedDesc}</p>
        </div>
        <div className="flex gap-3 md:gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 md:px-8 md:py-4 bg-green-500 hover:bg-green-400 text-black font-bold transition-all active:scale-[0.98] text-sm md:text-base tracking-widest font-mono"
          >
            {et.retry}
          </button>
          <button
            onClick={resetQuiz}
            className="px-6 py-3 md:px-8 md:py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-800 transition-all active:scale-[0.98] text-sm md:text-base tracking-widest font-mono"
          >
            {et.backHome}
          </button>
        </div>
      </div>
    );
  }

  const { team, match_percentage } = matchResult;

  const chartData = [
    { subject: t.dimensions.tradition.right, User: scores.tradition || 0, Team: team.stats?.Dim1_Heritage || 0 },
    { subject: t.dimensions.proactive.right, User: scores.proactive || 0, Team: team.stats?.Dim2_Domination || 0 },
    { subject: t.dimensions.heroism.right, User: scores.heroism || 0, Team: team.stats?.Dim3_Hero || 0 },
    { subject: t.dimensions.pragmatism.right, User: scores.pragmatism || 0, Team: team.stats?.Dim4_Pragmatic || 0 },
    { subject: t.dimensions.control.right, User: scores.control || 0, Team: team.stats?.Dim5_Control || 0 },
    { subject: t.dimensions.resilience.right, User: scores.resilience || 0, Team: team.stats?.Dim6_Resilience || 0 },
    { subject: t.dimensions.physicality.right, User: scores.physicality || 0, Team: team.stats?.Dim7_Physical || 0 },
    { subject: t.dimensions.adaptability.right, User: scores.adaptability || 0, Team: team.stats?.Dim8_Adaptive || 0 },
  ];

  return (
    <div className="flex flex-col gap-10 md:gap-12 lg:gap-16 animate-in fade-in slide-in-from-right-12 duration-1000 w-full">

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
        <div className="w-full md:w-1/2 flex flex-col text-center md:text-left order-2 md:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 mb-4 md:mb-6 mx-auto md:mx-0">
            <span className="w-2 h-2 bg-green-500"></span>
            <span className="text-xs font-bold text-green-500 tracking-widest font-mono">{t.matchSuccess}</span>
          </div>

          <h2 className="text-base md:text-lg font-bold text-zinc-500 mb-1 md:mb-2 tracking-widest font-mono">{t.yourTeam}</h2>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-zinc-100 mb-4 md:mb-6 tracking-tighter leading-none">
            {team.name}
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="px-5 py-2.5 md:px-6 md:py-3 bg-white text-black text-lg md:text-xl font-mono font-bold tracking-widest">
              {t.matchRate.replace('{percentage}', match_percentage)}
            </div>
          </div>

          <p className="text-zinc-400 mb-8 md:mb-10 text-base md:text-xl leading-relaxed font-medium">
            {team.description}
          </p>

          <button
            onClick={resetQuiz}
            className="py-4 md:py-5 bg-green-500 hover:bg-green-400 text-black font-bold tracking-widest font-mono flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm md:text-base"
          >
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" /> {t.retry}
          </button>
        </div>

        <div className="w-full md:w-1/2 aspect-square max-w-[400px] md:max-w-[500px] bg-zinc-900 border border-zinc-800 p-3 md:p-4 order-1 md:order-2 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={team.name}
                dataKey="Team"
                stroke="#52525b"
                strokeWidth={1}
                fill="#52525b"
                fillOpacity={0.1}
              />
              <Radar
                name={lang === 'zh' ? '你的倾向' : 'Your Tendency'}
                dataKey="User"
                stroke="#22c55e"
                strokeWidth={3}
                fill="#22c55e"
                fillOpacity={0.25}
                animationDuration={1500}
              />
              <Legend iconType="circle" />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <DimensionBars scores={scores} quizMode={quizMode} />
      </div>

    </div>
  );
}