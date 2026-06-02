const DIM_MAP = ['tradition', 'proactive', 'heroism', 'pragmatism', 'control', 'resilience', 'physicality', 'adaptability'];

export const BUFFS = [
  {
    name: '高位空间切割',
    conditions: [
      { dim: 'proactive', op: '>', val: 75 },
      { dim: 'heroism', op: '<', val: 30 }
    ],
    desc: '压制+绝对团队，不是盲目逼抢，而是整体阵型切割'
  },
  {
    name: '极限承压反弹',
    conditions: [
      { dim: 'proactive', op: '<', val: 25 },
      { dim: 'resilience', op: '<', val: 25 }
    ],
    desc: '反击+绝地翻盘，越挨揍反击越致命'
  },
  {
    name: '立体化传跑网络',
    conditions: [
      { dim: 'heroism', op: '<', val: 25 },
      { dim: 'pragmatism', op: '<', val: 25 }
    ],
    desc: '团队+绝对理想主义，极具观赏性的无球跑动'
  },
  {
    name: '手术刀纵向直塞',
    conditions: [
      { dim: 'control', op: '<', val: 30 },
      { dim: 'physicality', op: '<', val: 25 }
    ],
    desc: '极速创造机会+技术流，不靠身体硬突，靠脚法打穿防线'
  },
  {
    name: '乱战嗅觉终结者',
    conditions: [
      { dim: 'control', op: '<', val: 25 },
      { dim: 'adaptability', op: '>', val: 75 }
    ],
    desc: '机会主义+极度灵活，最擅长抓攻防转换的混乱瞬间'
  },
  {
    name: '绞肉机中场屏障',
    conditions: [
      { dim: 'proactive', op: '>', val: 65 },
      { dim: 'physicality', op: '>', val: 80 }
    ],
    desc: '中高位压迫+极致身体对抗，硬度拉满'
  },
  {
    name: '降维打击体能池',
    conditions: [
      { dim: 'resilience', op: '>', val: 75 },
      { dim: 'physicality', op: '>', val: 80 }
    ],
    desc: '顺境扩张+身体对抗，下半场利用体能碾压对手'
  },
  {
    name: '1-0 极致现实主义',
    conditions: [
      { dim: 'pragmatism', op: '>', val: 85 },
      { dim: 'adaptability', op: '<', val: 35 }
    ],
    desc: '极度实用+一以贯之，拿下一球直接关机防守'
  },
  {
    name: '战术变色龙',
    conditions: [
      { dim: 'adaptability', op: '>', val: 85 },
      { dim: 'heroism', op: '<', val: 35 }
    ],
    desc: '极度见招拆招+团队配合，教练战术板执行力极高'
  },
  {
    name: '孤胆英雄接管',
    conditions: [
      { dim: 'heroism', op: '>', val: 85 },
      { dim: 'resilience', op: '<', val: 30 }
    ],
    desc: '绝对核心+逆境翻盘，绝境看球星'
  }
];

export const DEBUFFS = [
  {
    name: '低位攻坚乏力',
    conditions: [
      { dim: 'control', op: '>', val: 80 },
      { dim: 'heroism', op: '<', val: 25 }
    ],
    desc: '极度控球+没有超级英雄，面对铁桶阵只能在外围倒脚'
  },
  {
    name: '防线身后开阔',
    conditions: [
      { dim: 'proactive', op: '>', val: 80 },
      { dim: 'control', op: '<', val: 35 }
    ],
    desc: '高压迫+渴望直接机会，阵型极其激进，极易被打身后'
  },
  {
    name: '顺风浪逆风崩',
    conditions: [
      { dim: 'resilience', op: '>', val: 85 },
      { dim: 'tradition', op: '>', val: 70 }
    ],
    desc: '极度依赖顺境+豪门做派，一旦开局落后心态容易失衡'
  },
  {
    name: '战术板僵化',
    conditions: [
      { dim: 'adaptability', op: '<', val: 15 },
      { dim: 'pragmatism', op: '<', val: 35 }
    ],
    desc: '一以贯之+偏理想主义，头铁，死活不换战术'
  },
  {
    name: '体能透支陷阱',
    conditions: [
      { dim: 'proactive', op: '>', val: 85 },
      { dim: 'heroism', op: '<', val: 30 }
    ],
    desc: '疯狂高位逼抢+团队协作，70分钟后容易集体断电'
  },
  {
    name: '无效控球催眠',
    conditions: [
      { dim: 'control', op: '>', val: 85 },
      { dim: 'pragmatism', op: '>', val: 70 }
    ],
    desc: '极度控球+实用主义，为了控球而控球，缺乏向前穿透力'
  },
  {
    name: '高压出球恐惧',
    conditions: [
      { dim: 'physicality', op: '>', val: 80 },
      { dim: 'control', op: '>', val: 70 }
    ],
    desc: '对抗强但要求控场，后场球员糙，遇到对手高位逼抢极易失误'
  },
  {
    name: '巨星依赖症候群',
    conditions: [
      { dim: 'heroism', op: '>', val: 85 },
      { dim: 'adaptability', op: '<', val: 30 }
    ],
    desc: '极度依赖球星+战术不灵活，核心被锁死则全队瘫痪'
  },
  {
    name: '畏惧肉搏绞杀',
    conditions: [
      { dim: 'physicality', op: '<', val: 15 },
      { dim: 'pragmatism', op: '<', val: 30 }
    ],
    desc: '极度技术流+理想主义，遇到强身体对抗的犯规战术容易崩溃'
  },
  {
    name: '各自为战断层',
    conditions: [
      { dim: 'heroism', op: '>', val: 75 },
      { dim: 'proactive', op: '>', val: 75 }
    ],
    desc: '依赖球星又想高位压迫，导致前场逼抢不一致，阵型断层'
  }
];

function checkConditions(teamStats, conditions) {
  return conditions.every(c => {
    const val = teamStats[c.dim];
    if (typeof val !== 'number') return false;
    return c.op === '>' ? val > c.val : val < c.val;
  });
}

function calcExcess(teamStats, conditions) {
  return conditions.reduce((sum, c) => {
    const val = teamStats[c.dim];
    if (typeof val !== 'number') return sum;
    return sum + (c.op === '>' ? val - c.val : c.val - val);
  }, 0);
}

export function getTeamStatsAsObject(team) {
  return {
    tradition: team.stats?.Dim1_Heritage ?? 50,
    proactive: team.stats?.Dim2_Domination ?? 50,
    heroism: team.stats?.Dim3_Hero ?? 50,
    pragmatism: team.stats?.Dim4_Pragmatic ?? 50,
    control: team.stats?.Dim5_Control ?? 50,
    resilience: team.stats?.Dim6_Resilience ?? 50,
    physicality: team.stats?.Dim7_Physical ?? 50,
    adaptability: team.stats?.Dim8_Adaptive ?? 50
  };
}

export function calculateTraits(team) {
  const teamStats = getTeamStatsAsObject(team);

  const matchedBuffs = BUFFS
    .filter(b => checkConditions(teamStats, b.conditions))
    .map(b => ({ ...b, excess: calcExcess(teamStats, b.conditions) }))
    .sort((a, b) => b.excess - a.excess)
    .slice(0, 2);

  const matchedDebuffs = DEBUFFS
    .filter(d => checkConditions(teamStats, d.conditions))
    .map(d => ({ ...d, excess: calcExcess(teamStats, d.conditions) }))
    .sort((a, b) => b.excess - a.excess)
    .slice(0, 1);

  return { buffs: matchedBuffs, debuffs: matchedDebuffs };
}