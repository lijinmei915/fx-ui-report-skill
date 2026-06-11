# R10 - HTML 自适应报告输出

## 目标

当用户要求“HTML 版、网页查看、手机查看、自适应页面、生成 html、导出 html”时，将已生成的个人日报、个人周报或个人月报转换成可在手机端和 Web 端阅读的单页 HTML。

HTML 是展示形态，不改变个人报表的分析逻辑、数据来源优先级和 CRM 日志保存确认规则。

## 触发条件

用户出现以下任一表达时触发：

- 生成 HTML
- 导出 HTML
- 网页版
- 手机查看
- 自适应页面
- H5
- 用浏览器打开
- 做成页面

如果用户只说“个人周报”，不默认生成 HTML；按 Markdown/文本报表输出。

## 执行顺序

1. 先按 `R01_period_router.md` 识别周期、销售人员和时间范围。
2. 按对应日报、周报或月报规则生成标准个人报表正文。
3. 读取 `references/html_responsive_design_reference.md`。
4. 优先使用 `assets/personal_report_template.html` 作为 HTML 模板。
5. 将个人报表正文映射到模板占位符。
6. 输出完整单文件 HTML。
7. 最后仍按 `R09_journal_storage_confirmation.md` 询问是否保存到 CRM 日志。

不要为了生成 HTML 跳过 CRM 查询、承诺对账、风险识别、行动建议或数据说明。

## 内容映射

| 报表模块 | HTML 区域 |
|----------|-----------|
| 标题、人员/部门、时间范围 | 页面头部 |
| 摘要 | 摘要卡片 |
| 关键指标 | 指标卡片或指标表 |
| 关键成果 | 关键结果列表 |
| 客户与商机进展 | 业务进展列表 |
| 复盘与调整 | 周报默认展示本周复盘；日报可省略；月报可展示月度复盘 |
| 承诺与风险 | 承诺/风险列表 |
| 下一步行动 | P0/P1/P2 行动块 |
| 数据说明 | 页面底部说明 |
| CRM 日志保存确认 | HTML 之后的对话确认，不写入 HTML 主体也可以 |

## HTML 输出要求

- 输出必须是完整 HTML 文档，包含 `<!doctype html>`、`html`、`head`、`body`。
- 必须包含 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`。
- CSS 优先内联在 `<style>` 中，避免依赖外部 CSS、字体或 CDN。
- 页面默认 mobile-first，桌面端通过 media query 增强布局。
- 不使用固定大宽度容器；主体容器使用 `max-width` 和响应式 padding。
- 指标区域使用 responsive grid。
- 表格必须包在横向滚动容器中；非关键指标模块优先用短段落或列表。
- 颜色克制，适合专业销售个人日志；不要做营销页或大幅 hero。
- 支持浏览器打印，至少提供 `@media print` 基础样式。

## 用户可见数据限制

- 不展示 `JournalObj`、`ActiveRecordObj` 等对象 ApiName。
- 不展示 `_id`、记录 ID、数据 ID 或长串主键。
- 不展示 `work_summary`、`journal_time` 等字段 ApiName。
- CRM 数据说明使用中文对象名，例如“日志、销售记录、日程、商机、订单、回款”。
- 系统字段、锁定状态、生命周期字段不进入 HTML。

## 文件交付

如果运行环境允许写文件，HTML 文件名建议使用：

`personal-report-[period]-[date-or-range].html`

例如：

`personal-report-weekly-<YYYY-WXX>.html`

如果不能写文件，直接输出完整 HTML 内容，并说明这是可保存为 `.html` 的单页文件。

## 禁止行为

- 不把 HTML 输出当成已保存 CRM。
- 不在用户未确认前写入 CRM 日志。
- 不为了美观删减关键风险、承诺对账、下一步行动或数据说明。
- 不输出依赖外网才能正常显示的 HTML。
- 不在 HTML 中暴露系统字段、对象 ApiName 或记录 ID。
