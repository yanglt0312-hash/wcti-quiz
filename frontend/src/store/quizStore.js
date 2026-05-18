import { create } from 'zustand';
import dynamicQuestionsZh from '../data/questions_dynamic.json';
import dynamicQuestionsEn from '../data/questions_dynamic_en.json';
import teamsDataZh from '../data/teams.json';
import teamsDataEn from '../data/teams_en.json';

const QUESTION_BANKS = {
  zh: {
    simple: () => import('../data/questions.json'),
    pro: () => import('../data/questions_pro.json'),
    dynamic: dynamicQuestionsZh
  },
  en: {
    simple: () => import('../data/questions_en.json'),
    pro: () => import('../data/questions_pro_en.json'),
    dynamic: dynamicQuestionsEn
  }
};

const DIMENSION_MAPPING = {
  tradition: "Dim1_Heritage",
  proactive: "Dim2_Domination",
  heroism: "Dim3_Hero",
  pragmatism: "Dim4_Pragmatic",
  control: "Dim5_Control",
  resilience: "Dim6_Resilience",
  physicality: "Dim7_Physical",
  adaptability: "Dim8_Adaptive"
};

const TEAM_NAME_TO_ID = {
  "Mexico": "MEX",
  "South Korea": "KOR",
  "South Africa": "RSA",
  "Czech Republic": "CZE",
  "Canada": "CAN",
  "Switzerland": "SUI",
  "Qatar": "QAT",
  "Bosnia and Herzegovina": "BIH",
  "Brazil": "BRA",
  "Morocco": "MAR",
  "Scotland": "SCO",
  "Haiti": "HAI",
  "United States": "USA",
  "Australia": "AUS",
  "Paraguay": "PAR",
  "Turkey": "TUR",
  "Germany": "GER",
  "Ecuador": "ECU",
  "Ivory Coast": "CIV",
  "Curaçao": "CUW",
  "Netherlands": "NED",
  "Japan": "JPN",
  "Tunisia": "TUN",
  "Sweden": "SWE",
  "Belgium": "BEL",
  "Iran": "IRN",
  "Egypt": "EGY",
  "New Zealand": "NZL",
  "Spain": "ESP",
  "Uruguay": "URU",
  "Saudi Arabia": "KSA",
  "Cape Verde": "CPV",
  "France": "FRA",
  "Senegal": "SEN",
  "Norway": "NOR",
  "Iraq": "IRQ",
  "Argentina": "ARG",
  "Austria": "AUT",
  "Algeria": "ALG",
  "Jordan": "JOR",
  "Portugal": "POR",
  "Colombia": "COL",
  "Uzbekistan": "UZB",
  "Congo DR": "COD",
  "England": "ENG",
  "Croatia": "CRO",
  "Panama": "PAN",
  "Ghana": "GHA"
};

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const currentLine = lines[i].split(',');
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = currentLine[j] ? currentLine[j].trim() : '';
      obj[headers[j]] = isNaN(Number(val)) ? val : Number(val);
    }
    result.push(obj);
  }
  return result;
}

function calculateCosineSimilarity(userScores, teamData) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (const [userDim, teamDim] of Object.entries(DIMENSION_MAPPING)) {
    const val1 = userScores[userDim] ?? 50;
    const val2 = teamData[teamDim] ?? 50;
    dotProduct += val1 * val2;
    normA += val1 ** 2;
    normB += val2 ** 2;
  }
  return normA === 0 || normB === 0 ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const useQuizStore = create((set, get) => ({
  currentView: 'home',
  quizMode: 'simple',
  isCalibrationPhase: false,
  userTags: [],
  activeQuestions: [],
  currentQuestionIndex: 0,
  scores: { tradition: 50, proactive: 50, heroism: 50, pragmatism: 50, control: 50, resilience: 50, physicality: 50, adaptability: 50 },
  isLoading: false,
  matchResult: null,
  questionBank: null,

  startQuiz: async (mode, lang) => {
    const bank = QUESTION_BANKS[lang] || QUESTION_BANKS.zh;
    const questionsModule = await bank[mode]();
    const questions = questionsModule.default || questionsModule;
    const dynamic = bank.dynamic;

    set({
      currentView: 'quiz',
      quizMode: mode,
      lang: lang,
      isCalibrationPhase: true,
      userTags: ['universal'],
      activeQuestions: dynamic.calibration_nodes,
      currentQuestionIndex: 0,
      matchResult: null,
      questionBank: questions,
      scores: { tradition: 50, proactive: 50, heroism: 50, pragmatism: 50, control: 50, resilience: 50, physicality: 50, adaptability: 50 }
    });
  },

  answerQuestion: (dimension_or_tag, score_or_value, isLastQuestion) => {
    const state = get();

    if (state.isCalibrationPhase) {
      const newTags = [...state.userTags];
      if (dimension_or_tag && !newTags.includes(dimension_or_tag)) {
        newTags.push(dimension_or_tag);
      }

      if (isLastQuestion) {
        const dynamic = (QUESTION_BANKS[state.lang] || QUESTION_BANKS.zh).dynamic;
        let pool = dynamic.question_pool.filter(q =>
          q.tags.some(tag => newTags.includes(tag))
        );
        pool = pool.sort(() => Math.random() - 0.5);
        const targetLength = state.quizMode === 'simple' ? 20 : pool.length;
        const finalExam = pool.slice(0, targetLength);

        set({
          isCalibrationPhase: false,
          userTags: newTags,
          activeQuestions: finalExam,
          currentQuestionIndex: 0
        });
      } else {
        set({ userTags: newTags, currentQuestionIndex: state.currentQuestionIndex + 1 });
      }
      return;
    }

    const newScores = { ...state.scores };
    newScores[dimension_or_tag] = Math.max(0, Math.min(100, newScores[dimension_or_tag] + score_or_value));

    if (isLastQuestion) {
      set({ scores: newScores, currentView: 'result', isLoading: true });

      fetch('/Team_8D_Soul_Scores.csv')
        .then(res => {
          if (!res.ok) throw new Error("CSV read failed");
          return res.text();
        })
        .then(csvText => {
          const csvTeams = parseCSV(csvText);
          setTimeout(() => {
            let bestMatch = null;
            let highestSim = -1;
            for (const team of csvTeams) {
              const sim = calculateCosineSimilarity(newScores, team);
              if (sim > highestSim) {
                highestSim = sim;
                const teamEnName = team.Team;
                const teamId = TEAM_NAME_TO_ID[teamEnName] || teamEnName;
                const teamsData = state.lang === 'en' ? teamsDataEn : teamsDataZh;
                const teamInfo = teamsData.find(t => t.id === teamId);
                console.log(`[DEBUG] Matching team: enName=${teamEnName}, teamId=${teamId}, lang=${state.lang}, foundTeam=${teamInfo?.name || 'NOT FOUND'}`);
                bestMatch = {
                  team: {
                    name: teamInfo ? teamInfo.name : teamEnName,
                    description: teamInfo ? teamInfo.description : '',
                    stats: team
                  },
                  match_percentage: (sim * 100).toFixed(1)
                };
              }
            }
            set({ matchResult: bestMatch, isLoading: false });
          }, 1500);
        })
        .catch(err => {
          console.error("Data loading failed:", err);
          set({ isLoading: false, matchResult: null });
        });
    } else {
      set({ scores: newScores, currentQuestionIndex: state.currentQuestionIndex + 1 });
    }
  },

  resetQuiz: () => set({ currentView: 'home', matchResult: null })
}));
