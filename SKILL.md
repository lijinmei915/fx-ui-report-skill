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

1. 先按“通用生成协议”把输入拆成信息桶，再识别报告头、KPI、图表、进度/评分、数据表、洞察、方法论等语义块；没有的块跳过。
2. 先读 `assets/data/components.manifest.json` 获取组件清单和 HTML 片段，不要先读完整 `components.html`。
3. 默认读取 `assets/templates/starter-lite.html` 作为轻量组装底稿；它引用外置 CSS，不包含大段样式。
4. 按 manifest 中的组件 HTML 片段填入真实数据；只有 manifest 不足以判断结构时，才读取 `components.html` 的对应组件区段。
5. 若最终必须交付单文件 HTML，优先在文件系统层面复制 `assets/templates/starter.html`，不要用 `read_file` 分段读取它的 CSS。
6. 有 Chart.js 图表时，参考 `references/charts.html` 的图表配置和显式 canvas 高度写法。
7. 输出前按本文件“收尾自检”核对；修改组件时运行 `python3 scripts/check-sync.py`。

## 读取策略

优先轻量读取，避免反复续读大文件 CSS。

| 文件 | 默认动作 |
|------|----------|
| `assets/data/components.manifest.json` | 优先读取。只用于了解组件目录、使用场景和 HTML 片段，不作为 CSS 真源 |
| `assets/templates/starter-lite.html` | 默认读取。轻量 HTML 底稿，用于快速组装报告，不含大段 CSS |
| `assets/styles/fx-ui-report.css` | CSS 真源之一。外置样式文件；如使用 lite 模板，保持 link 引用即可，不要通读全文 |
| `assets/templates/starter.html` | 单文件交付模板。仅在必须输出完全独立 HTML 时复制使用，不作为默认读取文件 |
| `references/design.md` | 仅在需要确认视觉规则、主题、间距、排版时读取相关章节 |
| `references/charts.html` | 仅在需要 Chart.js 配置时读取 |
| `assets/templates/components.html` | 默认不读；仅当 manifest 片段不足、需要核对某个组件真实结构或 CSS selector 时，按关键词定位后读取相关区段 |
| `assets/templates/example.html` | 默认不读；仅在需要理解完整报告节奏和信息密度时读取 |

如果运行环境支持文件复制，且用户要求单文件 HTML，应直接复制 `starter.html` 作为输出文件，再替换内容区。不要连续多次读取 `starter.html` / `components.html` 的 CSS 区段；这会浪费上下文，并增加生成偏差。

防跑偏规则：`starter.html` 内置 CSS 与 `assets/styles/fx-ui-report.css` 同源，二者是最终样式基准；manifest 只提供组件 HTML 片段和用途说明。生成报告时只填真实内容、组合组件、调整 token，不重写组件 CSS，不按记忆自造 class。

外层版式硬约束：`body` 必须是浅灰外画布 `#F0F2F5`，`.page` 必须是居中报告容器（`max-width:1160px; margin:0 auto; padding:0 32px 40px; background:var(--bg-page); border-radius:var(--radius-lg)`）。`.report-header` 必须放在 `.page` 内，并使用 `.page .report-header { margin: 0 -32px 16px; }` 破出容器内边距。不要把深色背景直接铺到 `body`，不要删除 `.page` 包裹层。

## 通用生成协议

暂不预设销售、拜访、复盘、经营等固定报告类型。任何输入先归入信息桶，再由信息桶选择组件和版面。

### 信息桶

- `header`：标题、对象、周期、日期、负责人、报告场景。
- `summary`：总判断、核心结论、需要先看的话。
- `metrics`：KPI、金额、数量、百分比、评分、进度。
- `insights`：发现、风险、机会、异常、解释。
- `actions`：下一步、唯一行动、建议、待办、负责人。
- `people`：人名、角色、态度、影响力、关系、状态。
- `tables`：明细、排名、清单、阶段列表、客户/商机列表。
- `charts`：趋势、占比、对比、分布、漏斗、雷达等可视化。
- `notes`：口径、数据来源、方法论、限制说明。

### 信息优先级

默认按这个顺序组织页面：`summary` → `metrics` → `insights` → `actions` → `charts/tables` → `people` → `notes`。

如果输入本身有强章节顺序，可以保留原顺序，但仍要保证结论先行：最重要的 `summary` 或关键风险必须出现在首屏或首个正文区。

### 组件映射

- 有核心结论：用 `.summary-block`。
- 有 1-4 个关键指标：用 `.kpi-card`；超过 4 个分组展示。
- 有 0-100 综合评分：用 `.gauge-card`；单分数状态用 `.score-summary-card`。
- 有风险/机会/行动语句：用 `.icon-row-*`，按语义选择 danger / warning / info / success。
- 有唯一行动或当天必须做的事：用 action callout 样式，不跟随品牌主题。
- 有人员/角色/关系状态：用 `.person-card`。
- 有明细和可比较字段：用 `.table-card` / `.data-table`。
- 有趋势/占比/对比：用 `.chart-card` + Chart.js。
- 有口径和来源：用 `<details>` + `.methodology-body`。
- 现有组件无法表达但内容必须保留：用 `generic-block` 兜底。

### 显示、隐藏与压缩

- 空信息桶不输出，不保留空标题、空卡片或占位文案。
- 不补造输入里没有的数字、姓名、日期、环比、洞察和方法论。
- 洞察/行动默认各保留 3-6 条，超出时按业务影响和紧急度排序。
- KPI 默认 4 个一组；超过 8 个时优先把次要指标放入表格。
- 表格只展示决策相关字段；宽表可隐藏低价值列，不能改动事实。
- 方法论和长口径默认折叠。

## 何时读什么

| 文件 | 何时读取 |
|------|----------|
| `assets/data/components.manifest.json` / `assets/data/design-tokens.json` | 生成前优先读取；这是机器可读组件/Token 清单 |
| `assets/templates/starter-lite.html` | 默认读取的轻量起点骨架 |
| `assets/templates/starter.html` | 仅在需要完整单文件 HTML 时复制使用；不需要反复读取 CSS 全文 |
| `references/design.md` | 需要确认视觉规则、深浅色主题、组件取舍、间距、排版时读取 |
| `assets/templates/components.html` | manifest 不足时，按组件关键词读取局部区段 |
| `references/charts.html` | 需要 bar / line / donut / stacked / combo / radar 等 Chart.js 图表时读取 |
| `assets/templates/example.html` | 只在需要理解完整报告节奏和信息密度时读取 |

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
