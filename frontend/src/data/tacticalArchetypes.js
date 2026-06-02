export const ARCHETYPES = [
  {
    id: 'possession',
    name: '阵地战传控体系',
    nameEn: 'Juego de Posición',
    vector: [50, 80, -60, -80, 90, 40, -70, -30],
    philosophy: '通过持续的空间压迫与位置轮转摧毁对手的防守结构',
    overview: '以高控球率为基础，通过中后场耐心的横向传导拉扯对手阵型，在局部制造人数优势后突然提速渗透。核心是 positional play 的纪律性——每个球员必须坚守自己的区域，等待最佳时机完成致命一传。'
  },
  {
    id: 'gegenpressing',
    name: '高位压迫转换体系',
    nameEn: 'Gegenpressing',
    vector: [20, 90, -40, 20, -50, -20, 60, -20],
    philosophy: '失球后瞬间的集体反抢是最致命的进攻武器',
    overview: '阵型整体压至高位，一旦丢失球权，全队立刻进入"五秒规则"反抢模式——在对手尚未完成由守转攻的过渡阶段就地夺回球权。这种体系对体能和战术纪律要求极高，但成功后能直接在对手禁区前沿制造杀机。'
  },
  {
    id: 'catenaccio',
    name: '低位密集防守体系',
    nameEn: 'Deep Low Block / Catenaccio',
    vector: [-30, -90, -30, 90, -60, -70, 50, -60],
    philosophy: '极致压缩空间，以最经济的消耗换取最致命的瞬间反击',
    overview: '全队退守至禁区前沿 30 米区域，形成两道紧密的防守链条。放弃控球权，专注于封堵传球线路和射门角度。一旦断球，立刻通过 2-3 脚精准长传找到前场支点，完成从防守到射门的极限转换。'
  },
  {
    id: 'fluid_counter',
    name: '极速攻守转换体系',
    nameEn: 'Fluid Counter-Attack',
    vector: [-10, -70, 30, 40, -80, -20, -50, 50],
    philosophy: '在对手攻防转换的瞬间完成致命一击',
    overview: '不追求控球率，而是精心设计由守转攻的路线。中后场断球后，前场 3-4 人立刻启动多线跑位，利用对手阵型前压留下的身后空间。这种体系对前场球员的爆发力和决策速度要求极高，但一旦成功，极具观赏性。'
  },
  {
    id: 'direct_play',
    name: '垂直纵向打击体系',
    nameEn: 'Vertical Direct Play',
    vector: [0, 40, -10, 60, -70, 10, 70, -30],
    philosophy: '以最快速度将球送到对手禁区，减少中场无效传递',
    overview: '放弃中场控球的繁琐环节，通过长传、斜传和快速边路推进直接将战火烧到对手腹地。依赖强力中锋的支点作用和二点球的争抢能力。战术简单直接但极其高效，尤其克制高位防守的对手。'
  },
  {
    id: 'star_centric',
    name: '核心主导自由人体系',
    nameEn: 'Star-Centric Play',
    vector: [40, 10, 90, 10, 20, 30, -30, 60],
    philosophy: '将绝对核心的创造力最大化，围绕一人构建整个进攻体系',
    overview: '全队战术围绕一名超级球星展开，赋予其极大的场上自由度。其他球员的任务是为核心创造接球空间、提供出球选项和防守掩护。这种体系的天花板取决于核心球员的临场状态，但一旦核心爆发，可以单枪匹马改变比赛。'
  },
  {
    id: 'mid_block_trap',
    name: '中场绞杀陷阱体系',
    nameEn: 'Mid-Block Press Trap',
    vector: [-20, 20, -60, 70, -40, -30, 80, -40],
    philosophy: '在中场区域设置绞杀陷阱，诱敌深入后一击致命',
    overview: '阵型收缩至中场区域，故意留出边路空间引诱对手推进。一旦球进入预设的陷阱区域，立刻启动多人围抢，利用身体对抗优势就地夺回球权。这种体系要求全队有极强的战术纪律和同步性。'
  },
  {
    id: 'asymmetrical_overload',
    name: '非对称强侧过载体系',
    nameEn: 'Asymmetrical Overload',
    vector: [10, 60, -40, -30, 50, 10, -50, 80],
    philosophy: '在球场一侧制造人数过载，利用对手阵型偏移创造另一侧空间',
    overview: '刻意将大量球员集中在球场一侧，迫使对手防守阵型严重倾斜。当对手过度偏转时，通过快速的大范围转移将球送到弱侧的空档。这种体系极其依赖球员的战术理解和跑位默契。'
  },
  {
    id: 'pragmatic_possession',
    name: '防守型控球体系',
    nameEn: 'Pragmatic Possession',
    vector: [60, 10, -30, 70, 80, 50, 40, -40],
    philosophy: '控球是最好的防守，用球权消耗对手的体能和意志',
    overview: '不求华丽的进攻配合，而是通过大量安全的中后场传导让对手疲于奔命。控球的目的不是得分，而是剥夺对手的进攻机会。这种体系极其务实，面对实力不如自己的对手时尤为有效。'
  },
  {
    id: 'total_football',
    name: '动态空间流转体系',
    nameEn: 'Total Football',
    vector: [40, 80, -80, -90, 30, 20, -60, 50],
    philosophy: '位置只是起点，空间才是归宿——每个人都能踢任何位置',
    overview: '球员之间频繁换位，打破传统阵型概念的束缚。当一名球员离开自己的位置，队友立刻填补其留下的空间。这种体系的极致是让对手的盯人防守完全失效，但要求全队拥有极高的战术素养。'
  },
  {
    id: 'target_man',
    name: '支点强攻拉扯体系',
    nameEn: 'Target-Man System',
    vector: [-10, 30, 60, 50, -30, -10, 90, -50],
    philosophy: '以强力中锋为战术支点，吸引防守后为后排插上创造空间',
    overview: '进攻围绕一名身体强壮、背身能力出色的中锋展开。球送至支点脚下，中锋抗住防守球员后将球分给高速插上的队友。这种体系简单粗暴但极其有效，对付防线组织松散的对手效果显著。'
  },
  {
    id: 'reactive_pragmatism',
    name: '灵活应变实用体系',
    nameEn: 'Reactive Pragmatism',
    vector: [70, -30, 40, 80, -10, -40, 20, 90],
    philosophy: '根据对手和比赛形势灵活切换战术，以赢球为唯一目的',
    overview: '没有固定的战术标签，赛前会根据对手特点制定针对性方案。领先时能稳妥控场，落后时能果断变阵。这种体系要求教练组有极强的临场阅读能力和球员的高度战术适应性。'
  },
  {
    id: 'false_nine',
    name: '伪九号无锋体系',
    nameEn: 'False 9 / Fluid Attack',
    vector: [30, 60, -70, -50, 70, 30, -80, 40],
    philosophy: '中锋回撤制造混乱，让对手的中卫无目标可盯',
    overview: '中锋频繁回撤至中场区域接球，引诱对方中卫跟出，从而在防线中制造出巨大的空档。边锋和攻击型中场相继插入这个空间完成射门。这种体系对中锋的脚下技术和足球智商要求极高。'
  },
  {
    id: 'wing_play',
    name: '两翼齐飞传中体系',
    nameEn: 'Wing Play / Crossing',
    vector: [0, 40, -20, 40, 10, 10, 50, -80],
    philosophy: '边路是进攻的生命线，用高质量的传中轰炸对手禁区',
    overview: '坚持通过边路推进，依赖边锋的突破能力和边后卫的套上传中。禁区内的中锋和后排插上的中场球员争抢传中落点。这种传统英式打法的变体在现代足球中依然有效，尤其克制中卫防空能力不足的对手。'
  },
  {
    id: 'underdog_miracle',
    name: '防反铁血韧性体系',
    nameEn: 'Underdog Miracle Block',
    vector: [-90, -80, 20, 80, -50, -90, 60, -10],
    philosophy: '以不可思议的防守韧性和精神力量对抗一切强敌',
    overview: '全队以近乎宗教般的信念执行防守任务，每个人都不惜体力地封堵射门、补位协防。进攻端依赖零星的反击和定位球机会。这种体系是弱队对抗强队的终极武器，但需要极强的精神力支撑。'
  },
  {
    id: 'heritage_dominance',
    name: '底蕴霸权强压体系',
    nameEn: 'Heritage Dominance',
    vector: [90, 70, 50, -10, 60, 90, 30, -20],
    philosophy: '用实力和底蕴碾压对手，不给任何冷门留机会',
    overview: '以压倒性的实力优势从比赛第一分钟开始就掌控局面。进攻端持续施压，防守端从容不迫。这种体系建立在强大的整体实力和丰富的比赛经验之上，是豪门球队面对实力不如自己的对手时的标准打法。'
  }
];

export function transformToTacticalVector(scores) {
  return [
    (scores.tradition - 50) * 2,
    (scores.proactive - 50) * 2,
    (scores.heroism - 50) * 2,
    (scores.pragmatism - 50) * 2,
    (scores.control - 50) * 2,
    (scores.resilience - 50) * 2,
    (scores.physicality - 50) * 2,
    (scores.adaptability - 50) * 2
  ];
}

export function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export function findBestArchetype(scores) {
  const userVector = transformToTacticalVector(scores);
  let best = null;
  let bestSim = -Infinity;
  for (const archetype of ARCHETYPES) {
    const sim = cosineSimilarity(userVector, archetype.vector);
    if (sim > bestSim) {
      bestSim = sim;
      best = archetype;
    }
  }
  return { archetype: best, similarity: bestSim };
}