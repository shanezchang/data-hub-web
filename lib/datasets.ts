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

const REGISTERED_DATASETS: Dataset[] = [
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
  {
    slug: "opinion",
    name: "人民日报评论语料",
    tagline: "人民时评、人民论坛、评论员观察等栏目的结构化索引，面向申论素材检索：提要金句 + 摘要 + 出处链接。",
    coverage: [
      "2023 年至今的人民日报评论栏目（人民时评 / 人民论坛 / 评论员观察 / 今日谈 / 钟声 / 和音 等），每日更新",
      "官方提要（金句）结构化抽取，栏目 / 作者 / 版面 / 日期维度齐全",
      "全文检索定位 + 命中片段；正文不对外输出，提供电子版原文出处链接",
    ],
    scope: "opinion:read",
    endpoints: [
      { method: "GET", path: "/v1/opinion", desc: "简单查询：关键词、栏目、作者、日期范围、聚合，参数可直接贴链接" },
      { method: "POST", path: "/v1/opinion/search", desc: "结构化查询：多词 AND / OR、精确短语、复杂筛选与交叉聚合" },
      { method: "GET", path: "/v1/opinion/topics", desc: "申论主题目录：受控词表、主题命中数与最新见报日" },
      { method: "GET", path: "/v1/opinion/{id}", desc: "按 ID 取单条（元数据 + 提要 + 摘要 + 原文链接）" },
    ],
    exampleCurl: `curl -H "X-API-Key: <your key>" \\\n  "https://api.lumina-core.cn/v1/opinion?q=基层治理&fields=title,digest,excerpt,url"`,
    enTitle: "People's Daily Commentary Index API",
    enTagline: "A structured index of People's Daily signed commentary columns (人民时评, 人民论坛, 钟声 …) since 2023 — search, column/author filters, official pull-quotes and source links via REST.",
    enOverview: [
      "People's Daily commentary columns are the most-quoted source material for Chinese civil-service exam essay writing (申论) and a key signal of official discourse. This dataset indexes every column-tagged commentary from the paper's e-edition since 2023, updated daily.",
      "Each record carries the column, author, page, date, the official pull-quote paragraphs (提要) and an opening excerpt, plus a link to the official e-paper source. Full article text powers search and snippets internally but is not redistributed — the API returns metadata, quotes and citations.",
    ],
    temporalCoverage: "2023-01/..",
    fields: [
      { name: "column / column_raw", desc: "栏目（基名 / 括号原文）/ column" },
      { name: "title / author", desc: "标题与作者 / title & author" },
      { name: "digest", desc: "官方提要金句 / official pull-quotes" },
      { name: "excerpt", desc: "首段摘要 / opening excerpt" },
      { name: "pub_date / page_no / page_name", desc: "见报日期与版面 / date & page" },
      { name: "url", desc: "电子版原文链接 / source URL" },
    ],
  },
  {
    slug: "macro",
    name: "国家统计局宏观时间序列",
    tagline: "国家统计局指标的结构化时间序列，统一指标、地区、频率与时期维度。",
    coverage: [
      "全国与分省指标，覆盖范围以指标目录实时返回为准",
      "月度、季度、年度按指标自然频率保存",
      "支持指标 × 地区等二维覆盖聚合",
    ],
    scope: "macro:read",
    endpoints: [
      { method: "GET", path: "/v1/macro", desc: "简单查询：指标、地区、频率、时间区间、字段投影与聚合" },
      { method: "POST", path: "/v1/macro/search", desc: "结构化查询：多指标、多地区、区间与二维聚合" },
      { method: "GET", path: "/v1/macro/indicators", desc: "指标目录及各指标的数据覆盖" },
      { method: "GET", path: "/v1/macro/{id}", desc: "按 ID 获取单个官方序列点" },
    ],
    exampleCurl: `curl -H "X-API-Key: <your key>" \\\n  "https://api.lumina-core.cn/v1/macro?indicator=居民消费价格&region=全国&freq=monthly"`,
    enTitle: "China National Bureau of Statistics Macro Data API",
    enTagline: "Structured Chinese macroeconomic time series from the National Bureau of Statistics, queryable by indicator, region, frequency and period.",
    enOverview: [
      "This dataset normalizes public National Bureau of Statistics series into one model: indicator, region, natural frequency, period, value and unit. National and provincial observations can be queried through the same endpoints.",
      "Use the live indicator catalog to discover available series and their actual coverage, then retrieve only the indicators, regions and date range needed for analysis or an agent workflow.",
    ],
    temporalCoverage: "varies by indicator",
    fields: [
      { name: "indicator_code / indicator_name", desc: "国家统计局指标码与名称 / indicator identity" },
      { name: "region_code / region", desc: "地区码与名称 / geography" },
      { name: "freq / period / period_date", desc: "频率与规范时期 / frequency & period" },
      { name: "value / unit", desc: "官方原值与单位 / official value & unit" },
    ],
  },
  {
    slug: "metals",
    name: "中国黄金与白银价格",
    tagline: "上海金交所现货与上期所期货主连的黄金、白银日行情，支持跨品种对比。",
    coverage: [
      "上期所期货主连覆盖黄金 2008 年、白银 2012 年起；上海金交所现货 2016 年起",
      "黄金与白银日 OHLC，保留交易场所、来源与计价单位",
      "按品种、金属、交易场所、来源与日期过滤或聚合",
    ],
    scope: "metals:read",
    endpoints: [
      { method: "GET", path: "/v1/metals", desc: "简单查询：品种、金属、交易场所、来源与交易日区间" },
      { method: "POST", path: "/v1/metals/search", desc: "结构化查询：多品种、区间与二维聚合" },
      { method: "GET", path: "/v1/metals/symbols", desc: "品种目录及最早、最新交易日覆盖" },
      { method: "GET", path: "/v1/metals/{id}", desc: "按 ID 获取单个日行情点" },
    ],
    exampleCurl: `curl -H "X-API-Key: <your key>" \\\n  "https://api.lumina-core.cn/v1/metals?metal=gold&start_date=2024-01-01&order_dir=asc"`,
    enTitle: "China Gold and Silver Price History API",
    enTagline: "Daily gold and silver prices from the Shanghai Gold Exchange and continuous futures series from the Shanghai Futures Exchange, available through one REST API.",
    enOverview: [
      "The dataset combines Shanghai Gold Exchange spot products with continuous gold and silver futures series from the Shanghai Futures Exchange. Each observation keeps its symbol, venue, source, trading date, OHLC values and native unit.",
      "Query one symbol for a chart, compare gold and silver over the same interval, or aggregate coverage by metal, venue, source, year or month without downloading full history.",
    ],
    temporalCoverage: "2008/..",
    fields: [
      { name: "metal / symbol / symbol_name", desc: "金属大类与品种 / metal & instrument" },
      { name: "venue / source", desc: "交易场所与数据来源 / venue & source" },
      { name: "trade_date", desc: "交易日 / trading date" },
      { name: "open / high / low / close", desc: "日行情 / daily OHLC" },
      { name: "unit", desc: "原始计价单位 / native quote unit" },
    ],
  },
  {
    slug: "housing",
    name: "70 城住宅销售价格指数",
    tagline: "国家统计局月度房价指数，覆盖新建商品住宅、二手住宅及不同面积段。",
    coverage: [
      "2011 年 1 月至今，按国家统计局正式发布节奏月度更新",
      "70 个大中城市，新建商品住宅与二手住宅两类市场",
      "官方环比、同比、定基或累计平均原值；长期链接指数明确标注为派生值",
    ],
    scope: "housing:read",
    endpoints: [
      { method: "GET", path: "/v1/housing/prices", desc: "简单查询：城市、城市层级、市场、面积段、月份区间与聚合" },
      { method: "POST", path: "/v1/housing/prices/search", desc: "结构化查询：多城市、多市场、多面积段、区间与二维聚合" },
      { method: "GET", path: "/v1/housing/cities", desc: "70 城稳定码、城市层级与实际数据覆盖目录" },
      { method: "GET", path: "/v1/housing/prices/{row_id}", desc: "按 ID 获取单个指数点及其官方来源" },
    ],
    exampleCurl: `curl -H "X-API-Key: <your key>" \\\n  "https://api.lumina-core.cn/v1/housing/prices?city=北京&market=resale&area_band=all&start_date=2011-01-01&order_dir=asc&limit=500"`,
    enTitle: "China 70-City Home Price Index API",
    enTagline: "Official monthly home-price indices for 70 major Chinese cities, covering new commodity housing, resale housing and floor-area bands since January 2011.",
    enOverview: [
      "The National Bureau of Statistics publishes monthly price indices for new commodity and resale housing in 70 major cities. This dataset normalizes changing historical table formats while preserving the official month-on-month, year-on-year, fixed-base or year-to-date values and the source page for every observation.",
      "A stable city code bridges historical renames, and a separately labelled linked_index provides a comparable long-run series across official base-year changes. Missing official values remain null rather than being filled with neutral values.",
    ],
    temporalCoverage: "2011-01/..",
    fields: [
      { name: "period / city_code / city / tier", desc: "月份与稳定城市标识 / period & city identity" },
      { name: "market / area_band", desc: "住宅市场与面积段 / market & floor-area band" },
      { name: "mom_index / yoy_index", desc: "官方环比、同比指数 / official monthly & yearly indices" },
      { name: "fixed_base_index / ytd_avg_index", desc: "官方定基或累计平均指数 / official comparison series" },
      { name: "linked_index / linked_method", desc: "明示派生的长期链接指数及算法版本 / derived series" },
      { name: "source_url", desc: "国家统计局正式发布页 / official source" },
    ],
  },
];

// macro API 契约已存在，但生产指标目录仍为空；在真实官方序列入库前不把空壳
// 暴露为可用数据集。保留元数据，灌数验收后只需移除此过滤条件。
export const DATASETS = REGISTERED_DATASETS.filter((dataset) => dataset.slug !== "macro");

export const getDataset = (slug: string) => DATASETS.find((d) => d.slug === slug);
