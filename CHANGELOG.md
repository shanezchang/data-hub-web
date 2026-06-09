# 更新日志

本项目所有重要变更都记录在此。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

data·hub 采用**统一平台版本**:前端(data-hub-web)与后端(data-hub)同步打同名
tag,本日志按平台聚合(用户视角的一条时间线)。

## [0.2.0] - 2026-06-09

### 新增
- 账号自助管理:修改昵称、修改密码、忘记密码找回(邮箱验证码,防枚举)
- 新闻检索 API 升级:`group_by` 聚合趋势、`snippet` 高亮片段、`POST /v1/news/search`
  结构化查询(全部词 / 任意词 / 精确短语)、字段投影
- 站点 SEO 与社交分享:Open Graph / Twitter 卡片、favicon、PWA manifest
- 关于页、更新日志页、全站页脚

### 优化
- 全站统一为等宽字体(JetBrains Mono + 系统中文回退),对齐更舒适;
  字体定义收敛到单一 CSS 变量,移除多余字体加载

## [0.1.0] - 2026-06-08

### 新增
- CCTV《新闻联播》全文检索 API(SQLite FTS5,5 万+ 条,2017–2026)
- 账号体系:注册 / 邮箱验证 / 登录 / 自助生成与吊销 API key,按 key 限流

[0.2.0]: https://github.com/shanezchang/data-hub-web/releases/tag/v0.2.0
[0.1.0]: https://github.com/shanezchang/data-hub-web/releases/tag/v0.1.0
