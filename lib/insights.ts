// Insights 注册表:数据驱动的发现页(英文,programmatic SEO 内容线)。
// 新发现上线 = 数据 JSON 放 lib/insights-data/ + 此处加一条 + app/(site)/insights/<slug>/page.tsx。
// 编辑纪律(主编把关线,见 data-hub 仓库 docs/content-playbook.md):
//   1. 每个数字必须能用公开 API 一条查询复现(页面 Methodology 给出查询)
//   2. 只做描述性陈述,不做政治评价;敏感话题不选题
//   3. 数据快照标注 as_of;条数随采集漂移,正文/标题/描述不写"总量为 N"式的会过时断言
//      (裁决 2026-06-11:历史 changelog 条目是发布时点快照,豁免此纪律)

export type Insight = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // YYYY-MM-DD
  dataAsOf: string;
};

export const INSIGHTS: Insight[] = [
  {
    slug: "vocabulary-birth-certificates",
    title: "Birth certificates: when new vocabulary first hit the broadcast",
    description:
      "碳中和 entered via Nordic news in 2019, 双循环 via a Politburo meeting, 新质生产力 via a Xi inspection trip — exact first-broadcast dates for 11 terms, each with the original CCTV link.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "xinwen-lianbo-calendar",
    title: "The Xinwen Lianbo calendar: China's official year, month by month",
    description:
      "Two Sessions coverage peaks in March (64%), flood control owns July, harvest owns September. Eight recurring topics folded into twelve months, from a decade of broadcasts.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "yc-geography",
    title: "YC went global, then came home",
    description:
      "Non-US companies were 6% of the 2012 intake, 40% at the 2022 peak, and back to ~9% by 2025. Two decades of YC company geography in one aggregation.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "yc-industry-drift",
    title: "YC's consumer era is over: two decades of industry drift",
    description:
      "In 2008 half the batch was consumer startups; by 2026 consumer is ~5% while B2B exceeds 60%. Industry composition of every YC batch year, in one aggregation.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "policy-themes",
    title: "What the State Council writes about",
    description:
      "Trade-customs-tourism is the largest theme across the full archive; land-and-energy is the clearest recent riser (3 docs in 2019 → 41 in 2024); health spiked through the pandemic then faded.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "state-council-paperwork",
    title: "From directives to approvals: the changing shape of State Council paperwork",
    description:
      "In 2013: 86 major directives vs 50 approvals. In 2024: 10 vs 51 — and 2025 saw just 3 directives all year. Plus the 2020 urgent-telegram spike, measured from the full document library.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "diplomatic-switches",
    title: "Eight diplomatic switches, as seen from China's flagship newscast",
    description:
      "From Panama (2017) to Nauru (2024): what establishing relations with Beijing looks like in Xinwen Lianbo coverage — with the original announcement broadcast linked for every country.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "new-quality-productive-forces",
    title: "“New Quality Productive Forces”: a slogan's cold start, measured",
    description:
      "新质生产力 went from zero to 269 Xinwen Lianbo items within one year of first appearing — with State Council policy documents following exactly one year later.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
  {
    slug: "policy-vocabulary-handoff",
    title: "The vocabulary handoff: 精准扶贫 → 乡村振兴",
    description:
      "Targeted poverty alleviation peaked in 2017 and hit zero broadcast mentions by 2023; rural revitalization appeared the same year it peaked. Plus four more phrases that faded from the broadcast.",
    publishedAt: "2026-06-11",
    dataAsOf: "2026-06-11",
  },
];

export const getInsight = (slug: string) => INSIGHTS.find((i) => i.slug === slug);
