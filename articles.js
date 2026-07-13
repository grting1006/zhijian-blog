const reportContent = [
  "7 月 6 日晚间，A 股迎来一批 2026 年半年度业绩预告。这不是已审计半年报，但它把上半年最清晰的两条利润线索提前摆在了桌面上：周期品价格回升，以及新产能进入收获期。",
  "",
  "> 先看绝对利润，再看同比增速；高增长如果来自低基数或一次性收益，质量与持续性会完全不同。",
  "",
  "## 一眼看懂",
  "",
  "- **增速最高：**雅化集团预计归母净利润 11 亿至 13 亿元，同比增长 710.17%至857.48%。",
  "- **利润体量最大：**视源股份预计归母净利润 14.5 亿至 16.5 亿元，同比增长 264.62%至314.91%。",
  "- **共同主线：**锂盐、黄金等价格上行，以及新材料装置放量，同时推动多家公司改善。",
  "",
  "{{chart|代表公司预计归母净利润上限（亿元）|雅化集团,视源股份,金城医药,宝地矿业,浙江东方,联泓新科|13,16.5,1.4,1.91,8.72,4.3}}",
  "",
  "## 雅化集团：锂价与销量同时抬升",
  "",
  "雅化集团是当晚最醒目的预增公司。公司预计上半年归母净利润 11 亿至 13 亿元，上年同期为 1.36 亿元；扣非净利润预计 11.25 亿至 13.15 亿元，增幅 1392.73%至1644.84%。",
  "",
  "- 锂盐市场价格持续上行，产品销量与销售均价同步增长。",
  "- 公司强调矿、产、销平衡和生产效率，成本管控为利润弹性放大了空间。",
  "- 高增速也受上年同期低基数影响，后续更应关注锂价和销量的实际变化。",
  "",
  "![雅化集团2026年半年度业绩预告原文截图](assets/earnings-2026-07-06/yahua-guidance.png)",
  "",
  "## 视源股份：主业改善，一次性收益也不小",
  "",
  "视源股份预计上半年归母净利润 14.5 亿至 16.5 亿元，同比增长 264.62%至314.91%。主业端来自产品迭代、AI 技术融合和全球化市场拓展，但利润里还包含参投企业上市产生的 5.22 亿元公允价值变动收益。",
  "",
  "> 这 5.22 亿元计入非经常性损益，后续会随被投企业股权公允价值波动。看似最大的利润体量，需要拆分主业和投资收益。",
  "",
  "## 其他重点公司",
  "",
  "- **金城医药：**预计归母净利润 1.1 亿至 1.4 亿元，同比增长 153.55%至222.71%。中间体板块销量和产能利用率上升，同时权益转让增加非经常性损益。",
  "- **宝地矿业：**预计归母净利润 1.78 亿至 1.91 亿元，同比增长 189%至210%。国际金价走强、新增金多金属矿粉销售与并表共同贡献增量。",
  "- **浙江东方：**预计归母净利润 8.72 亿元，同比增长约 114.25%。金融、类金融业务改善，交易性金融资产浮盈大幅增加。",
  "- **联泓新科：**预计归母净利润 4 亿至 4.3 亿元，同比增长 148.96%至167.63%。新能源材料、生物可降解材料项目以及 EVA 二期等新装置释放产能。",
  "",
  "![宝地矿业2026年半年度业绩预告原文截图](assets/earnings-2026-07-06/baodi-guidance.png)",
  "",
  "## 我的观察",
  "",
  "这批预告不只是“数字很好看”。雅化集团和宝地矿业反映了资源价格对利润的放大效应；联泓新科更像产能周期进入业绩兑现期；视源股份则提醒我，看净利润时必须拆出非经常性损益。",
  "",
  "- 资源品公司要继续跟踪价格、出货量和单位成本。",
  "- 新产能公司要看产能利用率、良率和现金流，不只看收入。",
  "- 含投资收益的公司要同时对比扣非净利润。",
  "",
  "## 跨时区备注",
  "",
  "三星电子官方在韩国时间 7 月 7 日发布二季度业绩指引：预计销售额约 171 万亿韩元，营业利润约 89.4 万亿韩元。它属于北京时间 7 月 7 日的披露，本文不将其计入 7 月 6 日数据，只作为次日全球科技财报线索。",
  "",
  "## 资料来源",
  "",
  "- [证券时报：多家A股公司发布半年度业绩预告](https://www.stcn.com/article/detail/4000876.html)",
  "- [上海证券报：7月6日晚间重要公告集锦](https://www.cnstock.com/commonDetail/739485)",
  "- [Samsung Global Newsroom：2026年二季度业绩指引](https://news.samsung.com/global/samsung-electronics-announces-earnings-guidance-for-second-quarter-2026)",
  "",
  "> 本文是对公开业绩预告的个人整理，不构成投资建议。"
].join("\n");

const defaultArticles = [
  {
    id: "paper",
    title: "给生活留一张白纸",
    date: "2026-07-08",
    category: "随笔",
    excerpt: "不是所有空白都需要立刻填满。",
    content: "有一阵子，我把日程排得很满。每一个小时都要有名字，每一次停顿都像一种浪费。\n\n直到某个傍晚，我在窗边坐了很久。没有读书，也没有打开任何一份文件。街上的光一点点暗下来，我才发现，原来留白不是无所事事，而是给感受留下入口。\n\n## 练习留白\n\n现在我会在周末留出一个下午，不安排目的地。走到哪儿算哪儿，看到一家没有去过的店就进去。那些没有被计划捕捉的时刻，常常比完成清单更让我记得。\n\n> 生活不是一份等待勾选的任务列表。\n\n也许我们需要的不是更高效，而是偶尔允许自己，像一张还没落笔的白纸。"
  },
  {
    id: "earnings-2026-07-06",
    title: "2026年7月6日财报",
    date: "2026-07-06",
    category: "财报",
    excerpt: "锂盐价格上行和新产能释放，成为当日半年度业绩预告的两条主线。",
    content: reportContent
  },
  {
    id: "rain",
    title: "雨后去了一趟旧书店",
    date: "2026-06-21",
    category: "城市",
    excerpt: "潮湿的纸页与一杯很慢的咖啡。",
    content: "雨停的时候，巷子里的砖地还泛着亮。我绕路去了那家开在二楼的旧书店。\n\n老板正在给书页除湿，空气里有纸张和木头混在一起的味道。我带走了一本诗集，扉页上留着前一位读者铅笔写下的日期：1998 年的秋天。\n\n一本书被交到陌生人手里，也许就是一种安静的相遇。"
  },
  {
    id: "work",
    title: "把注意力还给一件事",
    date: "2026-05-30",
    category: "工作",
    excerpt: "少一些切换，事情反而开始向前走。",
    content: "屏幕上的标签页总会越开越多，直到我意识到：分心不总是因为事情太多，而是因为我们习惯了随时响应。\n\n最近我尝试把上午的前九十分钟留给最重要的一件事。关掉提醒，不回复消息，只做一件需要思考的工作。\n\n结果并不神奇，但很踏实。**专注不是逼自己更快，而是让时间重新有了形状。**"
  }
];

window.defaultArticles = defaultArticles;
const sourceData = window.__BLOG_CONTENT__ || {};
const parseStored = key => {
  try { return JSON.parse(localStorage.getItem(key) || "null"); }
  catch { return null; }
};
const mergeRecords = (stored, source) => {
  const byId = new Map();
  (stored || []).forEach(item => byId.set(item.id, item));
  (source || []).forEach(item => byId.set(item.id, item));
  return [...byId.values()];
};
window.loadBlogCollection = (key, fallback = []) => {
  const stored = parseStored(key);
  const sourceKey = { "zhijian-favorites":"favorites", "zhijian-favorite-folders":"folders", "zhijian-reader-notes":"notes" }[key];
  const source = sourceData[sourceKey] || [];
  let merged;
  if (Array.isArray(sourceData[sourceKey])) merged = [...source];
  else if (key === "zhijian-favorite-folders") merged = [...new Set([...(stored || []), ...source])];
  else merged = mergeRecords(stored, source);
  if (!merged.length && fallback.length) merged = [...fallback];
  localStorage.setItem(key, JSON.stringify(merged));
  return merged;
};
window.loadArticles = storageKey => {
  const stored = parseStored(storageKey);
  const repositoryArticles = sourceData.articles || [];
  const merged = Array.isArray(sourceData.articles) && repositoryArticles.length
    ? [...repositoryArticles]
    : mergeRecords([...defaultArticles, ...(stored || [])], repositoryArticles);
  localStorage.setItem(storageKey, JSON.stringify(merged));
  return merged
    .sort((left, right) => right.date.localeCompare(left.date));
};
