// 数据集注册表：前端展示的唯一事实源。
// 新数据集上线 = 在此加一条，主页卡片 / 子页面 / sitemap 自动跟上(与后端"加能力=注册一行"对称)。
// 纪律：不写具体数据量(条数随采集更新，写死必过时);覆盖范围只写定性事实。

export type Endpoint = {
  method: "GET" | "POST";
  path: string;
  desc: string;
};

export type Dataset = {
  slug: string;
  name: string;
  tagline: string;
  coverage: string[];
  scope: string;
  endpoints: Endpoint[];
  exampleCurl: string;
  // 英文 SEO 面:目标买家(海外 China watcher / agent 开发者)用英文 Google 搜索。
  // enTitle 直接打搜索词;enOverview 是页面英文正文段落。
  enTitle: string;
  enTagline: string;
  enOverview: string[];
  // schema.org/Dataset 的时间覆盖(JSON-LD 用),形如 "2016-02/.."
  temporalCoverage: string;
  // 核心字段速览(字段名是 API 原名,描述双语从简)
  fields: { name: string; desc: string }[];
};

export const DATASETS: Dataset[] = [
  {
    slug: "news",
    name: "CCTV《新闻联播》",
    tagline: "中国官方时政新闻的每日全文，支持全文检索与时间维度聚合。",
    coverage: ["2016 年至今，每日更新", "逐条全文，中文全文检索", "按日 / 月 / 年聚合趋势"],
    scope: "news:read",
    endpoints: [
      { method: "GET", path: "/v1/news", desc: "简单查询：关键词、日期范围、分页、排序、字段投影，参数可直接贴链接" },
      { method: "POST", path: "/v1/news/search", desc: "结构化查询：多词 AND / OR、精确短语、聚合趋势、片段高亮" },
      { method: "GET", path: "/v1/news/stats/daily", desc: "某天的新闻条数" },
      { method: "GET", path: "/v1/news/{id}", desc: "按 ID 取单条全文" },
    ],
    exampleCurl: `curl -H "X-API-Key: <your key>" \\\n  "https://api.lumina-core.cn/v1/news?q=新能源&limit=10"`,
    enTitle: "CCTV Xinwen Lianbo Full-Text Search API",
    enTagline: "Full transcripts of China's flagship CCTV evening news (新闻联播) since 2016 — full-text search, date filters, and yearly/monthly trend aggregation via a single REST API.",
    enOverview: [
      "Xinwen Lianbo is CCTV's 7pm flagship news program and the most closely watched signal of official Chinese policy priorities. This dataset contains the full transcript of every broadcast item since 2016, updated daily within hours of broadcast.",
      "Search any Chinese phrase across a decade of broadcasts, filter by date range, or aggregate mention counts by year, month, or day to chart how official attention to a topic rises and falls. Responses return highlighted snippets by default to keep agent context small.",
    ],
    temporalCoverage: "2016-02/..",
    fields: [
      { name: "news_date", desc: "播出日期 / broadcast date" },
      { name: "title", desc: "条目标题 / item title" },
      { name: "content", desc: "正文全文 / full transcript text" },
      { name: "url", desc: "央视网原文链接 / source URL" },
    ],
  },
  {
    slug: "yc",
    name: "Y Combinator 公司目录",
    tagline: "YC 全部批次的公司与创始人结构化档案，支持筛选、检索与交叉聚合。",
    coverage: ["覆盖 2005 年首批至最新批次，定期更新", "公司与创始人两级实体，英文全文检索", "批次 × 状态等二维交叉聚合"],
    scope: "yc:read",
    endpoints: [
      { method: "GET", path: "/v1/yc/companies", desc: "简单查询：按批次、状态、行业、地区过滤，参数可直接贴链接" },
      { method: "POST", path: "/v1/yc/companies/search", desc: "结构化查询：复杂筛选、全文检索、二维聚合" },
      { method: "GET", path: "/v1/yc/companies/{slug}", desc: "单个公司全字段，内嵌创始人档案" },
      { method: "GET", path: "/v1/yc/founders", desc: "创始人检索：bio 全文 + 公司条件过滤" },
    ],
    exampleCurl: `curl -H "X-API-Key: <your key>" \\\n  "https://api.lumina-core.cn/v1/yc/companies?batch=W25&status=Active"`,
    enTitle: "Y Combinator Companies & Founders Dataset API",
    enTagline: "Every launched YC company and founder since 2005 — filter by batch, status, industry or tag, search bios, and run batch-year × status cross aggregations via REST.",
    enOverview: [
      "A structured snapshot of the public Y Combinator company directory: all launched companies across every batch since 2005, with founder profiles, status (Active / Acquired / Public / Inactive), industry, tags, regions and team size.",
      "One query answers questions that take hours to compile by hand: survival rates per batch, AI-tagged companies by year, hiring companies by industry, or founders whose bios mention a given background.",
    ],
    temporalCoverage: "2005/..",
    fields: [
      { name: "slug / name", desc: "公司标识与名称 / company id & name" },
      { name: "batch / batch_year / status", desc: "批次与现状 / batch & outcome" },
      { name: "industry / tags / regions", desc: "行业与标签 / classification" },
      { name: "founders[]", desc: "创始人档案(姓名/头衔/bio) / founder profiles" },
    ],
  },
  {
    slug: "policy",
    name: "国务院政策文件库",
    tagline: "国发、国办发等中央政策文件原文，支持全文检索与文种、机关、时间维度聚合。",
    coverage: [
      "1996 年至今的国务院文件（国发 / 国办发 / 国函 / 国办函），每日更新",
      "逐件正文全文，中文全文检索，发文字号 / 主题分类结构化",
      "年份 × 文种等二维交叉聚合；官方下架文件标记保留，引用可溯",
    ],
    scope: "policy:read",
    endpoints: [
      { method: "GET", path: "/v1/policy", desc: "简单查询：关键词、文种、发文机关、日期范围、聚合，参数可直接贴链接" },
      { method: "POST", path: "/v1/policy/search", desc: "结构化查询：多词 AND / OR、精确短语、复杂筛选与交叉聚合" },
      { method: "GET", path: "/v1/policy/{id}", desc: "按 ID 取单件全文" },
    ],
    exampleCurl: `curl -H "X-API-Key: <your key>" \\\n  "https://api.lumina-core.cn/v1/policy?q=人工智能&limit=10"`,
    enTitle: "China State Council Policy Documents Database API",
    enTagline: "Full text of China's State Council policy documents (国发 / 国办发) since 1996 — full-text search, document-type and issuing-organ filters, and year × type aggregations via REST.",
    enOverview: [
      "The State Council policy document library (政策文件库) is the canonical source for China's central-government policy directives. This dataset mirrors the State Council series — 国发, 国办发, 国函, 国办函 — with full document text, document numbers, issuing organs, themes and both written and published dates, updated daily.",
      "Search policy full text in Chinese, look up a document by its official number (e.g. 国发〔2026〕15号), or chart how policy attention to a theme evolved across three decades. Documents withdrawn by the source are flagged, never silently deleted, so citations stay traceable.",
    ],
    temporalCoverage: "1996/..",
    fields: [
      { name: "pcode / doc_type", desc: "发文字号与文种 / document number & type" },
      { name: "title / content", desc: "标题与正文全文 / title & full text" },
      { name: "puborg / theme", desc: "发文机关与主题 / issuing organ & theme" },
      { name: "pub_date / write_date", desc: "发布与成文日期 / published & written dates" },
      { name: "withdrawn", desc: "官方下架标记 / withdrawal flag" },
    ],
  },
];

export const getDataset = (slug: string) => DATASETS.find((d) => d.slug === slug);
