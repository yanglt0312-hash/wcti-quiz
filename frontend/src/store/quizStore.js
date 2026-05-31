import { create } from 'zustand';
import dynamicQuestionsZh from '../data/questions_dynamic.json';
import dynamicQuestionsEn from '../data/questions_dynamic_en.json';
import teamsDataZh from '../data/teams.json';
import teamsDataEn from '../data/teams_en.json';

const CACHE_KEY = 'wcti_quiz_progress';

function saveCache(state) {
  try {
    const cache = {
      currentView: state.currentView,
      quizMode: state.quizMode,
      isCalibrationPhase: state.isCalibrationPhase,
      userTags: state.userTags,
      activeQuestions: state.activeQuestions,
      currentQuestionIndex: state.currentQuestionIndex,
      scores: state.scores,
      answerHistory: state.answerHistory,
      lang: state.lang,
      matchResult: state.matchResult,
      isLoading: state.isLoading
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log('[WCTI] Cache saved', { view: cache.currentView, index: cache.currentQuestionIndex, total: cache.activeQuestions?.length, completed: !!cache.matchResult });
  } catch { /* quota exceeded, ignore */ }
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) { console.log('[WCTI] No cache found'); return null; }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.activeQuestions || !Array.isArray(parsed.activeQuestions)) return null;
    console.log('[WCTI] Cache loaded', { view: parsed.currentView, index: parsed.currentQuestionIndex, total: parsed.activeQuestions.length });
    return parsed;
  } catch {
    return null;
  }
}

function clearCache() {
  try { console.log('[WCTI] Cache cleared'); console.trace('[WCTI] Clear trace'); localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

const QUESTION_BANKS = {
  zh: {
    simple: () => import('../data/questions.json'),
    dynamic: dynamicQuestionsZh
  },
  en: {
    simple: () => import('../data/questions_en.json'),
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

const TAG_HIERARCHY = {
  moba: [],
  lol: ['moba'],
  wzry: ['moba'],
  dota2: ['moba'],

  fps: [],
  traditional_shooter: ['fps'],
  cs: ['traditional_shooter', 'fps'],
  valorant: ['traditional_shooter', 'fps'],

  battle_royale: ['fps'],
  apex: ['battle_royale', 'fps'],
  pubg: ['battle_royale', 'fps'],

  console: [],
  soulslike: ['console'],
  dark_souls: ['soulslike', 'console'],
  elden_ring: ['soulslike', 'console'],
  sekiro: ['soulslike', 'console'],
  black_myth_wukong: ['soulslike', 'console'],

  traditional_single: ['console'],
  god_of_war: ['traditional_single', 'console'],
  red_dead_redemption: ['traditional_single', 'console'],

  anime_gacha: ['console'],
  genshin: ['anime_gacha', 'console'],
  honkai_star_rail: ['anime_gacha', 'console'],

  music: [],
  music_pop: ['music'],
  music_rock: ['music'],
  music_metal: ['music'],
  music_jazz: ['music'],
  music_blues: ['music'],
  music_electronic: ['music'],
  music_kpop: ['music'],
  music_rap: ['music'],
  music_classical: ['music'],
  music_instrumental: ['music'],
  music_none: [],

  sports: [],
  gym_strength: ['sports'],
  tennis: ['sports'],
  badminton: ['sports'],
  swimming: ['sports'],
  basketball: ['sports'],
  running: ['sports'],
  yoga: ['sports'],
  climbing: ['sports'],
  no_sports: [],
  no_pet: []
};

function expandTags(tags) {
  const expanded = new Set(tags);
  for (const tag of tags) {
    const parents = TAG_HIERARCHY[tag];
    if (parents) {
      parents.forEach(p => expanded.add(p));
    }
  }
  return [...expanded];
}

const DEFAULT_SCORES = {
  tradition: 50,
  proactive: 50,
  heroism: 50,
  pragmatism: 50,
  control: 50,
  resilience: 50,
  physicality: 50,
  adaptability: 50
};

const SCORE_SCALE = 5;

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

function calculateSimilarity(userScores, teamData) {
  const dims = Object.entries(DIMENSION_MAPPING);
  const n = dims.length;
  let dotProduct = 0, normA = 0, normB = 0, euclidSq = 0;

  for (const [userDim, teamDim] of dims) {
    const val1 = Number.isFinite(Number(userScores[userDim])) ? Number(userScores[userDim]) : 50;
    const val2 = Number.isFinite(Number(teamData[teamDim])) ? Number(teamData[teamDim]) : 50;
    dotProduct += val1 * val2;
    normA += val1 ** 2;
    normB += val2 ** 2;
    euclidSq += (val1 - val2) ** 2;
  }

  const cosSim = normA === 0 || normB === 0
    ? 0
    : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

  const euclidDist = Math.sqrt(euclidSq);
  const maxDist = Math.sqrt(n * 100 * 100);
  const euclidSim = 1 - (euclidDist / maxDist);

  return cosSim * 0.5 + euclidSim * 0.5;
}

function calculateNormalizedScores(answerHistory) {
  const totals = {};
  const counts = {};

  Object.keys(DIMENSION_MAPPING).forEach(dim => {
    totals[dim] = 0;
    counts[dim] = 0;
  });

  answerHistory.forEach(answer => {
    if (!answer.dimension || !Object.prototype.hasOwnProperty.call(totals, answer.dimension)) return;
    const value = Number(answer.value);
    if (!Number.isFinite(value)) return;
    totals[answer.dimension] += value;
    counts[answer.dimension] += 1;
  });

  return Object.fromEntries(
    Object.keys(DIMENSION_MAPPING).map(dim => {
      if (counts[dim] === 0) return [dim, 50];
      const average = totals[dim] / counts[dim];
      const score = 50 + average * SCORE_SCALE;
      return [dim, Math.max(0, Math.min(100, Number(score.toFixed(1))))];
    })
  );
}

function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}

export const useQuizStore = create((set, get) => ({
  currentView: 'home',
  quizMode: 'simple',
  isCalibrationPhase: false,
  userTags: [],
  activeQuestions: [],
  currentQuestionIndex: 0,
  scores: DEFAULT_SCORES,
  isLoading: false,
  matchResult: null,
  questionBank: null,
  answerHistory: [],

  syncLanguage: async (lang) => {
    const state = get();

    if (state.currentView === 'home') {
      set({ lang });
      return;
    }

    if (state.currentView === 'result') {
      const teamEnName = state.matchResult?.team?.stats?.Team;
      const teamId = teamEnName ? TEAM_NAME_TO_ID[teamEnName] || teamEnName : null;
      const teamsData = lang === 'en' ? teamsDataEn : teamsDataZh;
      const teamInfo = teamId ? teamsData.find(t => t.id === teamId) : null;

      set({
        lang,
        matchResult: state.matchResult && teamInfo
          ? {
              ...state.matchResult,
              team: {
                ...state.matchResult.team,
                name: teamInfo.name,
                description: teamInfo.description
              }
            }
          : state.matchResult
      });
      return;
    }

    const bank = QUESTION_BANKS[lang] || QUESTION_BANKS.zh;
    const questionsModule = await bank.simple();
    const questions = questionsModule.default || questionsModule;
    const dynamic = bank.dynamic;
    const sourceQuestions = state.isCalibrationPhase
      ? dynamic.calibration_nodes
      : questions;
    const questionsById = new Map(sourceQuestions.map(question => [String(question.id), question]));
    const translatedActiveQuestions = state.activeQuestions
      .map(question => questionsById.get(String(question.id)))
      .filter(Boolean);

    set({
      lang,
      activeQuestions: translatedActiveQuestions.length === state.activeQuestions.length
        ? translatedActiveQuestions
        : state.activeQuestions,
      questionBank: questions
    });
  },

  startQuiz: async (mode, lang) => {
    clearCache();
    const bank = QUESTION_BANKS[lang] || QUESTION_BANKS.zh;
    const questionsModule = await bank.simple();
    const questions = questionsModule.default || questionsModule;
    const dynamic = bank.dynamic;

    if (mode === 'simple') {
      set({
        currentView: 'quiz',
        quizMode: mode,
        lang: lang,
        isCalibrationPhase: false,
        userTags: ['universal'],
        activeQuestions: questions,
        currentQuestionIndex: 0,
        matchResult: null,
        questionBank: questions,
        scores: DEFAULT_SCORES,
        answerHistory: []
      });
      saveCache(get());
    } else {
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
        scores: DEFAULT_SCORES,
        answerHistory: []
      });
      saveCache(get());
    }
  },

  answerQuestion: (dimension_or_tag, score_or_value, isLastQuestion, selectedTags = null) => {
    const state = get();

    // ==========================================
    // 阶段 A：如果是信标题（打标签阶段）
    // ==========================================
    if (state.isCalibrationPhase) {
      const newTags = [...state.userTags];

      // 多选模式：使用传入的 selectedTags 数组
      if (selectedTags && Array.isArray(selectedTags)) {
        selectedTags.forEach(tag => {
          if (tag && !newTags.includes(tag)) {
            newTags.push(tag);
          }
        });
      } else if (dimension_or_tag && !newTags.includes(dimension_or_tag)) {
        // 单选模式兼容
        newTags.push(dimension_or_tag);
      }

      if (isLastQuestion) {
        // 信标收集完毕，开始组装最终考卷
        const dynamic = (QUESTION_BANKS[state.lang] || QUESTION_BANKS.zh).dynamic;

        // 核心配置：设定每个维度的抽题配额
        // 简单模式：8维度 × 3题 = 24题；专业模式：8维度 × 6题 = 48题
        const questionsPerDim = state.quizMode === 'simple' ? 3 : 6;
        // 标签题占比上限：每个维度最多 30% 的题来自用户标签
        const TAG_CAP_RATIO = 0.3;
        const maxTagQuestionsPerDim = Math.floor(questionsPerDim * TAG_CAP_RATIO);
        let finalExam = [];

        // 洗牌算法函数 (Fisher-Yates)
        const shuffleArray = (array) => {
          let currentIndex = array.length, randomIndex;
          while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
          }
          return array;
        };

        // 提取所有 8 个维度的名称
        const dimensions = Object.keys(DIMENSION_MAPPING);

        // 展开标签层级：cs → [cs, fps], apex → [apex, battle_royale, fps] 等
        const expandedTags = expandTags(newTags);

        // 针对每个维度，进行定额抓取
        dimensions.forEach(dim => {
          // 1. 挑出题库中属于当前维度的所有题
          const dimQuestions = dynamic.question_pool.filter(q => q.dimension === dim);

          // 2. 分离出"专属题"和"通用题"
          const tagMatched = dimQuestions.filter(q =>
            q.tags.some(tag => expandedTags.includes(tag) && tag !== 'universal')
          );
          const universalMatched = dimQuestions.filter(q => q.tags.includes('universal'));

          // 3. 标签题洗牌，限制上限后合并到通用池
          shuffleArray(tagMatched);
          const cappedTagMatched = tagMatched.slice(0, maxTagQuestionsPerDim);
          const combined = [...universalMatched, ...cappedTagMatched];
          shuffleArray(combined);

          const selectedForDim = combined.slice(0, questionsPerDim);

          // 将当前维度选好的题塞进总考卷
          finalExam = finalExam.concat(selectedForDim);
        });

        // 6. 终极洗牌：把 8 个维度的题彻底混合，防止用户看出规律
        shuffleArray(finalExam);

        set({
          isCalibrationPhase: false,
          userTags: newTags,
          activeQuestions: finalExam,
          currentQuestionIndex: 0
        });
        saveCache(get());
      } else {
        set({
          userTags: newTags,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          answerHistory: [...state.answerHistory, {
            dimension: null,
            value: 0,
            questionIndex: state.currentQuestionIndex,
            isCalibration: true,
            selectedTags: selectedTags || []
          }]
        });
        saveCache(get());
      }
      return;
    }

    // ==========================================
    // 阶段 B：如果是计分题（正式考试阶段）
    // ==========================================
    const newHistory = [...state.answerHistory, {
      dimension: dimension_or_tag,
      value: score_or_value,
      questionIndex: state.currentQuestionIndex
    }];
    const newScores = calculateNormalizedScores(newHistory);

    if (isLastQuestion) {
      set({ scores: newScores, currentView: 'result', isLoading: true, answerHistory: newHistory });
      saveCache(get());

      fetchWithTimeout('/Team_8D_Soul_Scores.csv?v=' + Date.now())
        .then(res => {
          if (!res.ok) throw new Error("CSV read failed");
          return res.text();
        })
        .then(csvText => {
          const csvTeams = parseCSV(csvText);
          setTimeout(() => {
            const teamsData = state.lang === 'en' ? teamsDataEn : teamsDataZh;
            const allMatches = csvTeams.map(team => {
              const sim = calculateSimilarity(newScores, team);
              const teamEnName = team.Team;
              const teamId = TEAM_NAME_TO_ID[teamEnName] || teamEnName;
              const teamInfo = teamsData.find(t => t.id === teamId);
              return {
                team: {
                  name: teamInfo ? teamInfo.name : teamEnName,
                  description: teamInfo ? teamInfo.description : '',
                  stats: team
                },
                match_percentage: Number((sim * 100).toFixed(1))
              };
            });
            allMatches.sort((a, b) => b.match_percentage - a.match_percentage);
            set({
              matchResult: {
                ...allMatches[0],
                allMatches
              },
              isLoading: false
            });
            saveCache(get());
          }, 1500);
        })
        .catch(err => {
          console.error("Data loading failed:", err);
          set({ isLoading: false, matchResult: null });
          saveCache(get());
        });
    } else {
      set({ scores: newScores, currentQuestionIndex: state.currentQuestionIndex + 1, answerHistory: newHistory });
      saveCache(get());
    }
  },

  prevQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex <= 0) return;

    const lastAnswer = state.answerHistory[state.answerHistory.length - 1];
    if (!lastAnswer) return;

    const newTags = [...state.userTags];
    let newHistory = state.answerHistory.slice(0, -1);

    if (lastAnswer.isCalibration) {
      if (lastAnswer.selectedTags) {
        lastAnswer.selectedTags.forEach(tag => {
          const idx = newTags.indexOf(tag);
          if (idx > -1) newTags.splice(idx, 1);
        });
      }
    }

    set({
      currentQuestionIndex: state.currentQuestionIndex - 1,
      scores: calculateNormalizedScores(newHistory),
      userTags: newTags,
      answerHistory: newHistory
    });
    saveCache(get());
  },

  resetQuiz: () => { clearCache(); set({ currentView: 'home', matchResult: null }); },

  tryRestoreProgress: () => {
    const cached = loadCache();
    if (!cached) { console.log('[WCTI] Restore: no cache to restore'); return false; }

    if (cached.currentView === 'result' && cached.matchResult) {
      console.log('[WCTI] Restore: result already seen, clearing cache');
      clearCache();
      return false;
    }

    if (cached.currentView === 'result' && !cached.matchResult) {
      console.log('[WCTI] Restore: result failed, back to last question');
      if (cached.activeQuestions && cached.activeQuestions.length > 0) {
        set({
          currentView: 'quiz',
          quizMode: cached.quizMode || 'simple',
          isCalibrationPhase: false,
          userTags: cached.userTags || ['universal'],
          activeQuestions: cached.activeQuestions,
          currentQuestionIndex: Math.max(0, cached.activeQuestions.length - 1),
          scores: cached.scores || DEFAULT_SCORES,
          answerHistory: cached.answerHistory || [],
          lang: cached.lang || 'zh',
          matchResult: null,
          isLoading: false
        });
        return true;
      }
      clearCache();
      return false;
    }

    if (cached.currentView === 'quiz' && cached.activeQuestions && cached.activeQuestions.length > 0) {
      console.log('[WCTI] Restore: quiz resumed at', cached.currentQuestionIndex, '/', cached.activeQuestions.length);
      set({
        currentView: 'quiz',
        quizMode: cached.quizMode || 'simple',
        isCalibrationPhase: !!cached.isCalibrationPhase,
        userTags: cached.userTags || ['universal'],
        activeQuestions: cached.activeQuestions,
        currentQuestionIndex: cached.currentQuestionIndex || 0,
        scores: cached.scores || DEFAULT_SCORES,
        answerHistory: cached.answerHistory || [],
        lang: cached.lang || 'zh',
        matchResult: null,
        isLoading: false
      });
      return true;
    }

    clearCache();
    return false;
  }
}));
