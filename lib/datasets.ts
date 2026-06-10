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
  },
];

export const getDataset = (slug: string) => DATASETS.find((d) => d.slug === slug);
