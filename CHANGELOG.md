# 更新说明

这里记录 `fx-ui-report-skill` 最近 10 个公开版本的主要变化。

## v1.0.15 - 2026-06-12

- 拆分报告头主题色和正文适配色：报告头新增 `--header-primary-*`，`--header-primary-500` 保留用户真实选择色。
- 修复深色主题下报告头被正文 `--accent-dark` 改写的问题。
- 明确正文结构、summary、图表主色继续使用 `--accent-light/dark`，不反向影响报告头。

## v1.0.14 - 2026-06-12

- 调整自定义主题色策略：用户选择保留为 `--seed-primary`，浅色模式生成 `--accent-light`，深色模式生成 `--accent-dark`。
- 修复浅色主题选择极浅色时，图表主色和 section 竖线直接继承浅色导致不协调的问题。
- 修复深色主题选择浅色时，强调色过亮的问题；深色图表、section 竖线和 summary 竖线统一使用压亮后的 `--accent-dark`。

## v1.0.13 - 2026-06-12

- 增加图表专用颜色 token，拆分 `--chart-brand`、`--chart-neutral`、`--chart-grid`、`--chart-axis`、`--chart-slice-border` 和 `--chart-tooltip-bg`。
- 修复深色模式下黑色/深灰图表扇区在深色卡片上不可读的问题。
- 更新 Chart.js 示例和生成规则，要求深色图表使用可读中性色，不直接继承黑色主题色。

## v1.0.12 - 2026-06-12

- 修复分发样式中组件库预览页 `body` 规则残留导致的报告贴边风险。
- 将正式报告页 `body/.page` 布局规则提前到 CSS 前段，避免 Agent 截断读取时漏掉外层画布。
- 增加外层版式硬约束：浅灰 `body` 外画布、居中 `.page` 容器、`.report-header` 必须位于 `.page` 内。

## v1.0.11 - 2026-06-12

- 新增轻量组装入口 `assets/templates/starter-lite.html`，避免 Agent 默认读取大段内联 CSS。
- 新增外置样式文件 `assets/styles/fx-ui-report.css`，与 `starter.html` 内置 CSS 同源。
- 默认读取策略调整为 `components.manifest.json` + `starter-lite.html`；`starter.html` 仅用于必须交付单文件 HTML 时复制使用。

## v1.0.10 - 2026-06-12

- 加强防跑偏规则：`starter.html` 是 CSS 与页面骨架唯一真源，manifest 只用于组件片段和用途说明。
- 明确生成报告时只填内容、组合组件、调整 token，不重写组件 CSS，不按记忆自造 class。

## v1.0.9 - 2026-06-12

- 优化公司 Agent 的读取策略：优先读取 `components.manifest.json`，避免反复续读 `starter.html` / `components.html` 的大段 CSS。
- 明确 `starter.html` 用作完整底稿复制，`components.html` 仅在 manifest 不足时按组件局部读取。

## v1.0.8 - 2026-06-12

- 明确 `CHANGELOG.md` 只保留最近 10 个公开版本，避免分发包文档过长。
- 在维护规则中同步“超过 10 个版本时删除最旧版本段落”。

## v1.0.7 - 2026-06-12

- 将 `CHANGELOG.md` 内容改为中文，便于中文使用者直接阅读。
- 保留必要英文技术名，例如 `SKILL.md`、`CHANGELOG.md`、`download_url`。

## v1.0.6 - 2026-06-12

- 从对外分发包中移除 `USAGE.md`。
- `USAGE.md` 仅作为源码仓库里的维护手册保留。
- 分发包现在只保留用户需要看到的 `SKILL.md`、`CHANGELOG.md`，以及 skill 运行所需资源目录。
