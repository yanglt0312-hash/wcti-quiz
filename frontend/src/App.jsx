import { useEffect } from 'react';
import { useQuizStore } from './store/quizStore';
import { useLangStore } from './store/langStore';
import { translations } from './i18n/translations';
import LanguageSwitch from './components/LanguageSwitch';
import DimensionBars from './components/DimensionBars';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Trophy, ChevronRight, RefreshCw, Download, Target, Zap } from 'lucide-react';

export default function App() {
  const { currentView, resetQuiz } = useQuizStore();
  const lang = useLangStore((state) => state.lang);

  useEffect(() => {
    if (currentView === 'home') {
      resetQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
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
    <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-3 md:mb-4 leading-tight whitespace-pre-line">
            {t.title}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-md leading-relaxed">
            {t.description}
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
        <button
          onClick={() => startQuiz('simple', lang)}
          className="group w-full py-6 md:py-8 px-6 md:px-8 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[24px] md:rounded-[32px] transition-all active:scale-[0.98] flex flex-col items-start shadow-2xl shadow-emerald-500/20"
        >
          <span className="text-xl md:text-2xl font-black flex items-center gap-2 mb-1">
            {t.quickStart} <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-emerald-100 text-xs md:text-sm opacity-80 uppercase tracking-widest font-bold">{t.quickStartSub}</span>
        </button>

        <button
          onClick={() => startQuiz('pro', lang)}
          className="group w-full py-6 md:py-8 px-6 md:px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] md:rounded-[32px] transition-all active:scale-[0.98] flex flex-col items-start border border-slate-800 shadow-xl"
        >
          <span className="text-xl md:text-2xl font-black flex items-center gap-2 mb-1">
            {t.proStart} <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-500 fill-amber-500" />
          </span>
          <span className="text-slate-500 text-xs md:text-sm uppercase tracking-widest font-bold">{t.proStartSub}</span>
        </button>
      </div>
    </div>
  );
}

function QuizView() {
  const { currentQuestionIndex, answerQuestion, activeQuestions, isCalibrationPhase } = useQuizStore();
  const lang = useLangStore((state) => state.lang);
  const t = translations[lang].quiz;

  if (!activeQuestions || activeQuestions.length === 0) return null;

  const question = activeQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === activeQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20 animate-in fade-in zoom-in-95 duration-500 w-full">
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        {!isCalibrationPhase && (
          <div className="w-full bg-slate-900 h-2.5 md:h-3 rounded-full mb-8 md:mb-10 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="text-emerald-500 font-mono font-black tracking-widest text-xs md:text-sm mb-3 md:mb-4">
          {isCalibrationPhase ? t.calibration.toUpperCase() : t.decoding.replace('{current}', currentQuestionIndex + 1).replace('{total}', activeQuestions.length)}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white">
          {question.text}
        </h2>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3 md:space-y-4">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isCalibrationPhase) {
                answerQuestion(opt.assign_tag, 0, isLastQuestion);
              } else {
                answerQuestion(question.dimension, opt.weight, isLastQuestion);
              }
            }}
            className="w-full p-4 md:p-6 lg:p-8 bg-slate-900 hover:bg-emerald-500 hover:text-white border border-slate-800 hover:border-emerald-400 text-left rounded-[20px] md:rounded-[24px] transition-all active:scale-[0.97] group relative overflow-hidden"
          >
            <span className="relative z-10 font-bold text-base md:text-lg">{opt.text}</span>
            <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
              <Target className="w-8 h-8 md:w-12 md:h-12" />
            </div>
          </button>
        ))}
      </div>
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
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <RefreshCw className="absolute inset-0 m-auto w-6 h-6 md:w-8 md:h-8 text-emerald-500 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-emerald-500 font-mono text-lg md:text-xl font-black animate-pulse uppercase tracking-[0.2em]">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!matchResult) {
    return (
      <div className="flex flex-col items-center justify-center space-y-5 md:space-y-6 py-16 md:py-24 animate-in fade-in zoom-in-95 w-full px-4">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <span className="text-3xl md:text-4xl">⚠️</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-red-400 tracking-widest text-center">{et.dataFailed}</h2>
        <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl max-w-lg text-center text-slate-400 space-y-2 shadow-2xl">
          <p className="text-sm md:text-base">{et.dataFailedDesc}</p>
        </div>
        <button
          onClick={resetQuiz}
          className="mt-6 md:mt-8 px-6 py-3 md:px-8 md:py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-800 transition-all active:scale-[0.98] text-sm md:text-base"
        >
          {et.backHome}
        </button>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit mb-4 md:mb-6 mx-auto md:mx-0">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">{t.matchSuccess}</span>
          </div>

          <h2 className="text-base md:text-lg font-bold text-slate-500 mb-1 md:mb-2 uppercase tracking-widest">{t.yourTeam}</h2>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none">
            {team.name}
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="px-5 py-2.5 md:px-6 md:py-3 bg-white text-slate-950 rounded-2xl text-lg md:text-xl font-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
              {t.matchRate.replace('{percentage}', match_percentage)}
            </div>
          </div>

          <p className="text-slate-400 mb-8 md:mb-10 text-base md:text-xl leading-relaxed font-medium">
            {team.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <button className="py-4 md:py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-[20px] md:rounded-[24px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] text-sm md:text-base">
              <Download className="w-4 h-4 md:w-5 md:h-5" /> {t.exportReport}
            </button>
            <button
              onClick={resetQuiz}
              className="py-4 md:py-5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-black rounded-[20px] md:rounded-[24px] border border-slate-800 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm md:text-base"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5" /> {t.retry}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 aspect-square max-w-[400px] md:max-w-[500px] bg-slate-900/50 rounded-[32px] md:rounded-[48px] p-3 md:p-4 border border-slate-800 order-1 md:order-2 flex items-center justify-center relative shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50"></div>

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name={team.name}
                dataKey="Team"
                stroke="#64748b"
                strokeWidth={1}
                fill="#64748b"
                fillOpacity={0.15}
              />
              <Radar
                name={lang === 'zh' ? '你的倾向' : 'Your Tendency'}
                dataKey="User"
                stroke="#10b981"
                strokeWidth={3}
                fill="#10b981"
                fillOpacity={0.35}
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
