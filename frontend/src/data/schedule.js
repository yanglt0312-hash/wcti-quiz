export const SCHEDULE = {
  "墨西哥": {
    group: "A",
    matches: [
      { date: "6月12日", time: "03:00", opponent: "南非" },
      { date: "6月19日", time: "09:00", opponent: "韩国" },
      { date: "6月25日", time: "09:00", opponent: "捷克" },
    ]
  },
  "南非": {
    group: "A",
    matches: [
      { date: "6月12日", time: "03:00", opponent: "墨西哥" },
      { date: "6月19日", time: "00:00", opponent: "捷克" },
      { date: "6月25日", time: "09:00", opponent: "韩国" },
    ]
  },
  "韩国": {
    group: "A",
    matches: [
      { date: "6月12日", time: "10:00", opponent: "捷克" },
      { date: "6月19日", time: "09:00", opponent: "墨西哥" },
      { date: "6月25日", time: "09:00", opponent: "南非" },
    ]
  },
  "捷克": {
    group: "A",
    matches: [
      { date: "6月12日", time: "10:00", opponent: "韩国" },
      { date: "6月19日", time: "00:00", opponent: "南非" },
      { date: "6月25日", time: "09:00", opponent: "墨西哥" },
    ]
  },
  "加拿大": {
    group: "B",
    matches: [
      { date: "6月13日", time: "03:00", opponent: "波黑" },
      { date: "6月19日", time: "06:00", opponent: "卡塔尔" },
      { date: "6月25日", time: "03:00", opponent: "瑞士" },
    ]
  },
  "波黑": {
    group: "B",
    matches: [
      { date: "6月13日", time: "03:00", opponent: "加拿大" },
      { date: "6月19日", time: "03:00", opponent: "瑞士" },
      { date: "6月25日", time: "03:00", opponent: "卡塔尔" },
    ]
  },
  "卡塔尔": {
    group: "B",
    matches: [
      { date: "6月14日", time: "03:00", opponent: "瑞士" },
      { date: "6月19日", time: "06:00", opponent: "加拿大" },
      { date: "6月25日", time: "03:00", opponent: "波黑" },
    ]
  },
  "瑞士": {
    group: "B",
    matches: [
      { date: "6月14日", time: "03:00", opponent: "卡塔尔" },
      { date: "6月19日", time: "03:00", opponent: "波黑" },
      { date: "6月25日", time: "03:00", opponent: "加拿大" },
    ]
  },
  "巴西": {
    group: "C",
    matches: [
      { date: "6月14日", time: "06:00", opponent: "摩洛哥" },
      { date: "6月20日", time: "09:00", opponent: "海地" },
      { date: "6月25日", time: "06:00", opponent: "苏格兰" },
    ]
  },
  "摩洛哥": {
    group: "C",
    matches: [
      { date: "6月14日", time: "06:00", opponent: "巴西" },
      { date: "6月20日", time: "06:00", opponent: "苏格兰" },
      { date: "6月25日", time: "06:00", opponent: "海地" },
    ]
  },
  "海地": {
    group: "C",
    matches: [
      { date: "6月14日", time: "09:00", opponent: "苏格兰" },
      { date: "6月20日", time: "09:00", opponent: "巴西" },
      { date: "6月25日", time: "06:00", opponent: "摩洛哥" },
    ]
  },
  "苏格兰": {
    group: "C",
    matches: [
      { date: "6月14日", time: "09:00", opponent: "海地" },
      { date: "6月20日", time: "06:00", opponent: "摩洛哥" },
      { date: "6月25日", time: "06:00", opponent: "巴西" },
    ]
  },
  "美国": {
    group: "D",
    matches: [
      { date: "6月13日", time: "09:00", opponent: "巴拉圭" },
      { date: "6月20日", time: "03:00", opponent: "澳大利亚" },
      { date: "6月26日", time: "10:00", opponent: "土耳其" },
    ]
  },
  "巴拉圭": {
    group: "D",
    matches: [
      { date: "6月13日", time: "09:00", opponent: "美国" },
      { date: "6月20日", time: "12:00", opponent: "土耳其" },
      { date: "6月26日", time: "10:00", opponent: "澳大利亚" },
    ]
  },
  "澳大利亚": {
    group: "D",
    matches: [
      { date: "6月14日", time: "12:00", opponent: "土耳其" },
      { date: "6月20日", time: "03:00", opponent: "美国" },
      { date: "6月26日", time: "10:00", opponent: "巴拉圭" },
    ]
  },
  "土耳其": {
    group: "D",
    matches: [
      { date: "6月14日", time: "12:00", opponent: "澳大利亚" },
      { date: "6月20日", time: "12:00", opponent: "巴拉圭" },
      { date: "6月26日", time: "10:00", opponent: "美国" },
    ]
  },
  "德国": {
    group: "E",
    matches: [
      { date: "6月15日", time: "01:00", opponent: "库拉索" },
      { date: "6月21日", time: "04:00", opponent: "科特迪瓦" },
      { date: "6月26日", time: "04:00", opponent: "厄瓜多尔" },
    ]
  },
  "库拉索": {
    group: "E",
    matches: [
      { date: "6月15日", time: "01:00", opponent: "德国" },
      { date: "6月21日", time: "08:00", opponent: "厄瓜多尔" },
      { date: "6月26日", time: "04:00", opponent: "科特迪瓦" },
    ]
  },
  "科特迪瓦": {
    group: "E",
    matches: [
      { date: "6月15日", time: "07:00", opponent: "厄瓜多尔" },
      { date: "6月21日", time: "04:00", opponent: "德国" },
      { date: "6月26日", time: "04:00", opponent: "库拉索" },
    ]
  },
  "厄瓜多尔": {
    group: "E",
    matches: [
      { date: "6月15日", time: "07:00", opponent: "科特迪瓦" },
      { date: "6月21日", time: "08:00", opponent: "库拉索" },
      { date: "6月26日", time: "04:00", opponent: "德国" },
    ]
  },
  "荷兰": {
    group: "F",
    matches: [
      { date: "6月15日", time: "04:00", opponent: "日本" },
      { date: "6月21日", time: "01:00", opponent: "瑞典" },
      { date: "6月26日", time: "07:00", opponent: "突尼斯" },
    ]
  },
  "日本": {
    group: "F",
    matches: [
      { date: "6月15日", time: "04:00", opponent: "荷兰" },
      { date: "6月21日", time: "12:00", opponent: "突尼斯" },
      { date: "6月26日", time: "07:00", opponent: "瑞典" },
    ]
  },
  "瑞典": {
    group: "F",
    matches: [
      { date: "6月15日", time: "10:00", opponent: "突尼斯" },
      { date: "6月21日", time: "01:00", opponent: "荷兰" },
      { date: "6月26日", time: "07:00", opponent: "日本" },
    ]
  },
  "突尼斯": {
    group: "F",
    matches: [
      { date: "6月15日", time: "10:00", opponent: "瑞典" },
      { date: "6月21日", time: "12:00", opponent: "日本" },
      { date: "6月26日", time: "07:00", opponent: "荷兰" },
    ]
  },
  "比利时": {
    group: "G",
    matches: [
      { date: "6月16日", time: "03:00", opponent: "埃及" },
      { date: "6月22日", time: "03:00", opponent: "伊朗" },
      { date: "6月27日", time: "11:00", opponent: "新西兰" },
    ]
  },
  "埃及": {
    group: "G",
    matches: [
      { date: "6月16日", time: "03:00", opponent: "比利时" },
      { date: "6月22日", time: "09:00", opponent: "新西兰" },
      { date: "6月27日", time: "11:00", opponent: "伊朗" },
    ]
  },
  "伊朗": {
    group: "G",
    matches: [
      { date: "6月16日", time: "09:00", opponent: "新西兰" },
      { date: "6月22日", time: "03:00", opponent: "比利时" },
      { date: "6月27日", time: "11:00", opponent: "埃及" },
    ]
  },
  "新西兰": {
    group: "G",
    matches: [
      { date: "6月16日", time: "09:00", opponent: "伊朗" },
      { date: "6月22日", time: "09:00", opponent: "埃及" },
      { date: "6月27日", time: "11:00", opponent: "比利时" },
    ]
  },
  "西班牙": {
    group: "H",
    matches: [
      { date: "6月16日", time: "00:00", opponent: "佛得角" },
      { date: "6月22日", time: "00:00", opponent: "沙特阿拉伯" },
      { date: "6月27日", time: "08:00", opponent: "乌拉圭" },
    ]
  },
  "佛得角": {
    group: "H",
    matches: [
      { date: "6月16日", time: "00:00", opponent: "西班牙" },
      { date: "6月22日", time: "06:00", opponent: "乌拉圭" },
      { date: "6月27日", time: "08:00", opponent: "沙特阿拉伯" },
    ]
  },
  "沙特阿拉伯": {
    group: "H",
    matches: [
      { date: "6月16日", time: "06:00", opponent: "乌拉圭" },
      { date: "6月22日", time: "00:00", opponent: "西班牙" },
      { date: "6月27日", time: "08:00", opponent: "佛得角" },
    ]
  },
  "乌拉圭": {
    group: "H",
    matches: [
      { date: "6月16日", time: "06:00", opponent: "沙特阿拉伯" },
      { date: "6月22日", time: "06:00", opponent: "佛得角" },
      { date: "6月27日", time: "08:00", opponent: "西班牙" },
    ]
  },
  "法国": {
    group: "I",
    matches: [
      { date: "6月17日", time: "03:00", opponent: "塞内加尔" },
      { date: "6月23日", time: "05:00", opponent: "伊拉克" },
      { date: "6月27日", time: "03:00", opponent: "挪威" },
    ]
  },
  "塞内加尔": {
    group: "I",
    matches: [
      { date: "6月17日", time: "03:00", opponent: "法国" },
      { date: "6月23日", time: "08:00", opponent: "挪威" },
      { date: "6月27日", time: "03:00", opponent: "伊拉克" },
    ]
  },
  "伊拉克": {
    group: "I",
    matches: [
      { date: "6月17日", time: "06:00", opponent: "挪威" },
      { date: "6月23日", time: "05:00", opponent: "法国" },
      { date: "6月27日", time: "03:00", opponent: "塞内加尔" },
    ]
  },
  "挪威": {
    group: "I",
    matches: [
      { date: "6月17日", time: "06:00", opponent: "伊拉克" },
      { date: "6月23日", time: "08:00", opponent: "塞内加尔" },
      { date: "6月27日", time: "03:00", opponent: "法国" },
    ]
  },
  "阿根廷": {
    group: "J",
    matches: [
      { date: "6月17日", time: "09:00", opponent: "阿尔及利亚" },
      { date: "6月23日", time: "01:00", opponent: "奥地利" },
      { date: "6月28日", time: "10:00", opponent: "约旦" },
    ]
  },
  "阿尔及利亚": {
    group: "J",
    matches: [
      { date: "6月17日", time: "09:00", opponent: "阿根廷" },
      { date: "6月23日", time: "11:00", opponent: "约旦" },
      { date: "6月28日", time: "10:00", opponent: "奥地利" },
    ]
  },
  "奥地利": {
    group: "J",
    matches: [
      { date: "6月17日", time: "12:00", opponent: "约旦" },
      { date: "6月23日", time: "01:00", opponent: "阿根廷" },
      { date: "6月28日", time: "10:00", opponent: "阿尔及利亚" },
    ]
  },
  "约旦": {
    group: "J",
    matches: [
      { date: "6月17日", time: "12:00", opponent: "奥地利" },
      { date: "6月23日", time: "11:00", opponent: "阿尔及利亚" },
      { date: "6月28日", time: "10:00", opponent: "阿根廷" },
    ]
  },
  "葡萄牙": {
    group: "K",
    matches: [
      { date: "6月18日", time: "01:00", opponent: "刚果民主共和国" },
      { date: "6月24日", time: "01:00", opponent: "乌兹别克斯坦" },
      { date: "6月28日", time: "07:30", opponent: "哥伦比亚" },
    ]
  },
  "刚果民主共和国": {
    group: "K",
    matches: [
      { date: "6月18日", time: "01:00", opponent: "葡萄牙" },
      { date: "6月24日", time: "10:00", opponent: "哥伦比亚" },
      { date: "6月28日", time: "07:30", opponent: "乌兹别克斯坦" },
    ]
  },
  "乌兹别克斯坦": {
    group: "K",
    matches: [
      { date: "6月18日", time: "10:00", opponent: "哥伦比亚" },
      { date: "6月24日", time: "01:00", opponent: "葡萄牙" },
      { date: "6月28日", time: "07:30", opponent: "刚果民主共和国" },
    ]
  },
  "哥伦比亚": {
    group: "K",
    matches: [
      { date: "6月18日", time: "10:00", opponent: "乌兹别克斯坦" },
      { date: "6月24日", time: "10:00", opponent: "刚果民主共和国" },
      { date: "6月28日", time: "07:30", opponent: "葡萄牙" },
    ]
  },
  "英格兰": {
    group: "L",
    matches: [
      { date: "6月18日", time: "04:00", opponent: "克罗地亚" },
      { date: "6月24日", time: "04:00", opponent: "加纳" },
      { date: "6月29日", time: "04:00", opponent: "巴拿马" },
    ]
  },
  "克罗地亚": {
    group: "L",
    matches: [
      { date: "6月18日", time: "04:00", opponent: "英格兰" },
      { date: "6月24日", time: "07:00", opponent: "巴拿马" },
      { date: "6月29日", time: "04:00", opponent: "加纳" },
    ]
  },
  "加纳": {
    group: "L",
    matches: [
      { date: "6月18日", time: "07:00", opponent: "巴拿马" },
      { date: "6月24日", time: "04:00", opponent: "英格兰" },
      { date: "6月29日", time: "04:00", opponent: "克罗地亚" },
    ]
  },
  "巴拿马": {
    group: "L",
    matches: [
      { date: "6月18日", time: "07:00", opponent: "加纳" },
      { date: "6月24日", time: "07:00", opponent: "克罗地亚" },
      { date: "6月29日", time: "04:00", opponent: "英格兰" },
    ]
  },
};