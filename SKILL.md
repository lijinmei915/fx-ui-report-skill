---
name: fx-ui-report-skill
en_name: "FX-UI-REPORT-SKILL"
description: "把任意格式的报告数据（HTML/JSON/Markdown/纯文字）转成符合 fx-ui 设计规范的独立 HTML 报告页。"
en_description: "Turn any report data (HTML / JSON / Markdown / plain text) into a polished standalone HTML report using the fx-ui design system."
aspect_hint: "桌面长页面"
tags: ["report", "data", "fx-ui", "crm", "dashboard", "美化", "报告"]
example_name: "assets/templates/example.html"
example_format: html
mode: prototype
example_prompt: "用「fx-ui 报告美化」技能把我的报告数据做成一份完整的独立 HTML 报告。保持 fx-ui 的视觉签名，使用真实内容和数据，不要 lorem ipsum 或占位数据。"
---

# fx-ui 报告美化

把任意报告数据转换成一份完整、独立、符合 fx-ui 设计系统的 HTML 报告。只改变呈现方式，不修改数据事实，不补造数据。

## 快速工作流

1. 识别输入里的报告头、KPI、图表、进度/评分、数据表、洞察、方法论等语义块；没有的块跳过。
2. 复制 `assets/templates/starter.html` 作为输出底稿，只替换报告头文字和 `<!-- 内容区 -->` 后的内容。
3. 从 `assets/templates/components.html` 按需复制组件结构，填入真实数据；不要重写整段 CSS。
4. 有 Chart.js 图表时，参考 `references/charts.html` 的图表配置和显式 canvas 高度写法。
5. 输出前按本文件“收尾自检”核对；修改组件时运行 `python3 scripts/check-sync.py`。

## 何时读什么

| 文件 | 何时读取 |
|------|----------|
| `assets/templates/starter.html` | 每次生成报告前读取；这是 HTML/CSS/内联图标的起点骨架 |
| `references/design.md` | 需要确认视觉规则、深浅色主题、组件取舍、间距、排版时读取 |
| `assets/templates/components.html` | 需要复制组件 HTML 结构或确认 class 名时读取 |
| `references/charts.html` | 需要 bar / line / donut / stacked / combo / radar 等 Chart.js 图表时读取 |
| `assets/templates/example.html` | 只在需要理解完整报告节奏和信息密度时读取 |
| `assets/data/components.manifest.json` / `assets/data/design-tokens.json` | 需要机器可读组件/Token 清单时读取 |

规范优先级：`starter.html` > `references/design.md` > `components.html` > `example.html`。

## 主题策略

- 未指定主题：默认浅色橙色。
- 指定主色 hex：按 `references/design.md` 的主题推导规则生成 token。
- 指定深色：必须同时翻转 surface、text、border 等 alias token；不要只改主色。
- 深色自定义主题要保留用户 seed 作为 `--brand` / `--map-primary-500`；正文品牌强调使用 `--brand-content-soft` / `--brand-content-fg`。

## 组件取舍

- KPI：`.kpi-card`
- 图表：`.chart-card` + Chart.js
- 0-100 进度：`.progress-list`
- 0-100 综合评分：`.gauge-card`
- 单分数状态：`.score-summary-card`
- 明细表：`.table-card` / `.data-table`
- 洞察/行动：`.icon-row-*`
- 一句话摘要：`.summary-block`
- 人员：`.person-card`
- 方法论：`<details>` + `.methodology-body`

现有组件能组合出来时不要新建组件。只在同类结构会复用 3 次以上时沉淀新组件。

## 收尾自检

- 所有展示内容来自输入，不造 KPI、环比、洞察或方法论。
- 颜色使用 token；除模板内既有示例和图表路径外，不新增硬编码色值。
- 表格：文字列 fg-1；数字/金额列 600 + tabular-nums + 右对齐；日期 nowrap；颜色只给 badge。
- Badge 不放 Unicode 符号；用纯文字或 Lucide 图标。
- Section 副标题不用括号。
- 每段高亮不超过 3 处；金额优先 `<strong>`，需要语义再叠加 `.hl-*`。
- 图标层级一致：重复列表、人员头像、callout 左图标用 L2 soft；KPI 等主强调才用 L1。
- 深色模式下不得出现固定浅底组件；unknown 头像、callout、summary、section title 竖条等使用深色友好的 token。
- 输出为完整独立 HTML；不要附解释文字。

## 维护规则

新增或修改组件时：

1. 改 `assets/templates/components.html` 的 CSS 和示例结构。
2. 同步 `assets/templates/starter.html` 和 `assets/data/components.manifest.json`。
3. 运行 `python3 scripts/check-sync.py`，必须通过。
4. 若变更视觉原则，同步更新 `references/design.md`。
