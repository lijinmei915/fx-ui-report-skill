# Design Rules: FX-UI-REPORT-SKILL

> 报告页的视觉规范。每节分为**原则**（为什么）和**规格**（是什么）两层。
> CSS 实现细节参考 `starter.html` 与 `components.html`；图标脚本已内置进 `starter.html`，维护参考 `lucide-snippet.html`。

---

## 1. 设计原则

**克制、专业、信息优先。**

- 品牌橙（`--primary`）是唯一强调色，只用于关键动作和强调边；不滥用
- 颜色传递语义，不做装饰：success / warning / danger / info 各有固定含义
- 文字层级靠明度区分，不靠字重堆叠
- 卡片用轻阴影 + border 区分层次，hover 有微动效增强交互感
- Header 渐变从品牌橙自然融入页面底色，不突兀截断

---

## 2. Design Tokens

所有颜色、圆角、字体必须使用变量，不得写死十六进制值。

```css
/* 背景 */
--bg:           #F7F8FA;   /* 页面底色 */
--surface:      #FFFFFF;   /* 卡片 */
--surface-sub:  #F2F3F5;   /* 表头、弱背景 */

/* 文字（4级明度） */
--fg-1:         #181C25;   /* 主文字：标题、数值 */
--fg-2:         #545861;   /* 次级：说明、表头 */
--fg-3:         #91959E;   /* 辅助：单位、日期、meta */
--fg-4:         #C1C5CE;   /* 最弱：仅用于装饰性占位，不用于有意义内容 */

/* 边框 */
--border:       #DEE1E8;
--border-soft:  #EAEBEE;

/* 功能色 */
--primary:      #FF8000;   --primary-soft: #FFF7E6;
--success:      #22C55E;   --success-soft: #DCFCE7;   /* Tailwind Green-500 / Green-100 */
--warning:      #F59E0B;   --warning-soft: #FEF3C7;   /* Tailwind Amber-500 / Amber-100 */
--danger:       #EF4444;   --danger-soft:  #FEE2E2;   /* Tailwind Red-500   / Red-100   */
--info:         #2563EB;   --info-soft:    #DBEAFE;   /* Tailwind Blue-600  / Blue-100  */

/* BI 图表色板（多系列按序取） */
--chart-1:#FF7383; --chart-2:#FF7752; --chart-3:#FF9B29;
--chart-4:#FFDA54; --chart-5:#DDF2BB; --chart-6:#55D48C;
--chart-7:#5BCFC1; --chart-8:#40B6FF; --chart-9:#368DFF;
--chart-10:#976AEB;

/* 形状 */
--radius-full: 9999px;  /* pill：badge、meta pill */
--radius-lg:   20px;    /* 页面容器、header 上圆角 */
--radius:      16px;    /* 卡片、表格、洞察块（主卡片） */
--radius-sm:   12px;    /* 方法论折叠、小组件 */
/* icon-box 圆角跟尺寸绑定：sm→8px, md→8px, lg→10px，不用独立 token */
--font: 'PingFang SC', 'Microsoft YaHei', sans-serif;
--font-numeric: 'Barlow Condensed', 'DIN Alternate', 'Arial Narrow', sans-serif;
```

### 2.1 数字字体

**原则**：报告里的“大数字”必须和 KPI 数值保持同一种数字气质，增强扫读识别。

**规格**：
- `--font-numeric` 是大数字专用字体栈，不额外引入 Google Font 或其他外部字体
- 使用范围：KPI 数值 `.kpi-value`、头部评分数字 `.sc-num`、评分摘要数字 `.score-summary-num`、评分摘要 `/100` 数字段 `.score-summary-unit`、Gauge 分数 `.gauge-label-score`
- 不使用范围：中文标题、中文单位（如“万/天/次”）、正文、表格普通数字、小号进度百分比
- 大数字同时使用 `font-variant-numeric: tabular-nums`，保持多卡片对齐稳定

---

## 3. 间距体系

基于 4pt 网格，所有间距用 `--space-*` token，不写 magic number：

| token | 值 | 典型用途 |
|-------|----|---------|
| `--space-1` | 4px  | 图标与文字间距、badge 内边距 |
| `--space-2` | 8px  | 卡片内小元素间距、badge gap |
| `--space-3` | 12px | 洞察块 gap、列表项间距 |
| `--space-4` | 16px | 卡片列间距（grid gap）、section 内小间距 |
| `--space-5` | 20px | 图表双列 gap、表格单元格水平 padding |
| `--space-6` | 24px | 卡片内边距、section title 下间距 |
| `--space-8` | 32px | 页面左右 padding |
| `--space-10` | 40px | 页面底部 padding、Header 底部 padding、section title 上间距 |

> Section 间距固定 56px（`--space-10` + 16px），不用 token 时写 `margin-bottom: 56px`。

---

## 4. 文字层级

**规则：报告里不得出现看不清的文字。**

| 层级 | Token | 值 | 用途 |
|------|-------|----|------|
| H1 | `--fg-1` | `#181C25` | 标题类：section title、KPI label、card title |
| H2 | `--fg-2` | `#545861` | 次级说明、表头文字 |
| H3 | `--fg-3` | `#91959E` | 辅助信息、单位、日期 |
| H4 | `--fg-4` | `#C1C5CE` | 仅装饰性占位，不用于任何有意义内容 |

---

## 5. 报告头

**原则**：第一眼传达报告标题和来源，渐变融入页面背景不突兀。

**规格**：
- 背景：`linear-gradient(180deg, var(--map-primary-700) 0%, var(--map-primary-500) 35%, var(--map-primary-100) 75%, var(--bg-page) 100%)`，底部渐变到 `var(--bg-page)` 无缝衔接（深浅色均适用）
- 布局：`margin: 0 -32px 16px`，撑满页面宽度；`contain: paint; overflow: hidden; border-radius: 20px 20px 0 0`
- padding：`32px 32px 40px`
- 底部淡出遮罩 `::after`：`height: 72px`，`linear-gradient(to bottom, transparent, var(--bg-page))`，`z-index: 1`，覆盖极光 blob 底部裁切痕迹
- 内容包裹层 `.header-body`：`display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; position:relative; z-index:2`
- 结构（居中对齐）：
  - eyebrow：12px 600，`letter-spacing: .15em`，大写，`var(--hd-text-soft)`
  - 主标题 h1：**40px 700**，`var(--hd-text)`，`letter-spacing: 0.1em`，`text-shadow: 0 2px 16px rgba(0,0,0,0.12)`
  - meta pill（日期 + 制表人）：白色毛玻璃底（`rgba(255,255,255,0.35)`），深色文字（`rgba(0,0,0,0.7)`），`backdrop-filter: blur(16px)`，`border-radius: 40px`，`box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 12px rgba(0,0,0,0.08)`，图标与文字之间用 `<span class="divider"></span>` 分隔
  - **`score-card`（可选）**：meta pill 下方白色卡片插槽，详见下方
- 极光装饰层 `.header-deco`：3 个 `.hd-blob` 高斯模糊色块，颜色用 `var(--hd-blob-1/2/3)` 随主题变化；`.hd-blob` 必须加 `mix-blend-mode: soft-light`（浅色主题下与背景自然融合，避免色块硬边溢出）
- SVG 装饰（曲线 + 圆圈 + 小点）：用白色 `rgba(255,255,255,…)` 叠加；浅色主题下对比度低属预期行为，不做主题切换
- **动画规范**：
  - 入场：eyebrow → h1 → meta 依次 `fadeInUp`（translateY 14px → 0，opacity 0→1），延迟 0 / 0.15s / 0.30s，`0.6s ease both`
  - 极光持续动画：blob 各自缓动漂移（14s / 18s / 11s），SVG 小点漂浮（`dotBob`，3–4s，各自 delay），SVG 曲线渐隐渐现（`lineFade`，6s / 8s），SVG 大圆呼吸（`circlePulse`，7s / 9s）——全部 `ease-in-out infinite`
  - 不在左上角放置会被圆角裁切的大圆装饰，避免露出直角框线
  - header 有 `::before` 光晕层（`gradientFlow`，`135deg` 白色渐变 `background-size:200%`，7s）
- **不输出**：状态芯片、更新时间、右侧来源名；报告 meta 只写真实的日期和制表人

### 5.1 score-card（头部可选插槽）

**原则**：渐变橙色背景上毛玻璃对比度不足，核心指标用白卡承载，保证可读性。

**规格**：
- 白底，`border-radius: var(--radius)`，`padding: 16px 28px 18px`
- `display: flex; flex-direction: column; align-items: center; gap: 10px`
- `box-shadow: 0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)`
- 结构（上→下）：
  - `.sc-num`：40px 900 fg-1，使用 `--font-numeric`，`letter-spacing: -0.03em`
  - `.sc-label`：12px fg-3，`margin-top: -6px`
  - `.sc-tags`：`display:flex; gap:8px; flex-wrap:wrap; justify-content:center`，放 badge 组

**可配置规则**：无数据时删除整个 `.score-card`，头部结构不受任何影响。

```html
<!-- 有数据 -->
<div class="score-card">
  <div class="sc-num">42</div>
  <div class="sc-label">就绪度评分</div>
  <div class="sc-tags">
    <span class="badge badge-warning">不足</span>
    <span class="badge badge-default">谈判审核</span>
    <span class="badge badge-success">赢率 80%</span>
  </div>
</div>

<!-- 无数据：整块删除，header-body 自动收拢 -->
```

**不要用**：毛玻璃 pill（`rgba(255,255,255,0.28)`）承载评分数字——橙色背景上对比度不足。

### 5.2 score-summary-card（正文评分摘要）

**原则**：正文中的单一评分只需要“分数 + 状态解释”，不使用仪表盘。

**适用**：
- 交接准备度 / 100
- 客户健康分 / 100
- 风险分 / 100
- 单项成熟度、完整度、准备度

**规格**：
- 白底，`border-radius: var(--radius-lg)`，`border: 1px solid var(--border-subtle)`，`box-shadow: var(--shadow-2)`
- `padding: 28px 32px`，竖向居中布局，`gap: 14px`
- `.score-summary-score`：数字与 `/100` 必须同一行，`align-items: baseline`，不换行
- `.score-summary-num`：54px 900 fg-1，使用 `--font-numeric`，`letter-spacing: -0.05em`
- `.score-summary-unit`：24px 700 fg-3，使用 `--font-numeric`，紧跟分数显示 `/ 100`
- `.score-summary-label`：15px 500 fg-3
- `.score-summary-tags`：badge 组，居中换行

**不要用**：Gauge。Gauge 用于表达分数在区间中的位置；单分数 + 状态标签用 `score-summary-card`。

---

## 6. Section 标题

**原则**：快速扫读时定位内容区域。

**规格**：
- 16px 600 fg-1，`margin: 44px 0 24px`
- 左侧竖条：`6×12px`，`border-radius: 3px`，`background: var(--structure-accent)`，带光晕 `box-shadow: 0 0 0 3px var(--content-accent-soft)`，`margin-right: 12px`；浅色等于同色相适配后的 `--accent-light`，深色等于不过亮的 `--accent-dark`
- 右侧延伸线（`::after`）：`flex: 1`，`height: 1px`，`linear-gradient(90deg, var(--border-base) 0%, transparent 100%)`，`margin-left: 20px`
- **不用** `text-transform: uppercase`，不用 letter-spacing 强制间距
- 副标题（筛选条件、时间范围）：跟在主标题后用 `<span>` 包裹，11px fg-3，`margin-left: 10px`；**不加括号**，直接写文字

---

## 6.1 品牌色使用层级

**原则**：浅色主题下，选中态/主按钮使用“同色相实色”，内容承托使用“同色相浅底”；不要把所有品牌元素都降成 soft，也不要把正文浅底当作按钮选中态。

| 层级 | token | 视觉 | 用途 |
|------|-------|------|------|
| Solid 主强调 | `--brand` / `--map-primary-500` | 实色填充/实色窄线 + 白色文字或独立色条 | 选中的 tab、主按钮、当前筛选等需要一眼识别的控件状态 |
| Soft 内容强调 | `--content-accent-soft` + `--content-accent-fg` | 浅底 + 深色文字/图标 | 正文高亮、表格 hover、L2 primary 图标、浅底上的行动文字 |
| 结构强调 | `--structure-accent` | 实色窄线 | section 小标题竖线、summary 左边框；浅色=`--accent-light`，深色=`--accent-dark` |
| Action 功能强调 | `--action-callout-*` | 固定行动功能色：浅色暖底/棕橙文字，深色暗暖底/琥珀文字 | 默认“唯一行动”callout；不跟随品牌主题；语义风险类用 danger/warning/info/success |

自定义主题必须先保留用户选择为 `--seed-primary`，再分模式生成实际使用色：浅色输出 `--accent-light`（同色相、适合白底的中等明度），深色输出 `--accent-dark`（同色相、适合黑底但不过亮）。选中 tab、section 小标题竖线、summary 左边框和图表主系列必须消费对应 accent，而不是直接消费极浅/极深 seed。正文高亮使用同色相浅底和更深文字。“唯一行动”callout 是固定 action 功能色，浅色和深色各一套，不跟随品牌主题。

---

## 7. KPI 卡片

**原则**：让读者 3 秒内抓到核心数字。

**规格**：
- 白底，`1px rgba(222,225,232,0.5)` 边框，`border-radius: 16px`，`padding: 24px`
- 阴影：`0 4px 20px -2px rgba(0,0,0,0.04), 0 2px 6px -1px rgba(0,0,0,0.02)`
- hover：`translateY(-2px)` + 阴影加深，过渡 0.2s
- 4 张卡样式完全一致，不区分"主卡"和"次卡"
- label 图标：`34×34px`，`border-radius: 10px`，渐变底 `linear-gradient(135deg, var(--map-primary-500), var(--brand-gradient-end))`，`box-shadow: 0 4px 12px var(--brand-shadow)`，图标白色 16×16px，绝对定位右上角（`top: 20px; right: 20px`）
- **图标渐变原则：相近色渐变**，起点用色族的基础色（`--map-primary-500`），终点用同色族的浅色（`--brand-gradient-end`），形成由深到浅的单色调渐变。禁止用跨色相的对比色做图标背景渐变（如蓝→橙、绿→紫）。语义色图标（danger/warning/success/info）同理，终点固定为对应语义色的 100 级浅色（`#FCA5A5`、`#FCD34D`、`#86EFAC`、`#93C5FD`）。
- label 文字：13px 500 fg-2
- 数值：32px 700 `var(--text-1)`，使用 `--font-numeric`，`font-variant-numeric: tabular-nums`，`margin-top: 12px`
- 单位 small：15px 600 `var(--text-3)`，使用 `--font` 中文系统字体，`margin-left: 4px`
- 补充说明：12px fg-3，`margin-top: 8px`
- 环比变化：有对比数据时，紧跟在数值右侧内联显示 `↑ 12%`（success 绿）/ `↓ 3%`（danger 红）；无对比数据时不输出，不补占位；不用 absolute 定位

### 7.1 内部卡片 inner-grid

**原则**：内部卡片只承载短 key-value 信息，不独立浮在页面上。

**规格**：
- 必须使用 `.inner-grid-shell` 作为外层白底承托，再放 `.inner-grid`
- `.inner-grid-shell`：白底，`border-radius: var(--radius)`，`padding: 20px`，不加描边，不加投影
- `.inner-card`：默认 `var(--bg-inset)` 浅灰底，`border-radius: var(--radius-sm)`，`padding: 14px 16px`，不加描边，不加投影
- 语义变体：`.danger` / `.warning` / `.success` / `.info` 使用对应功能色浅底，只改变背景色
- 不使用左侧 4px 彩边，不用 border 表达状态

---

## 8. 图表

**原则**：数据可视化辅助判断，不替代数据表。

**规格**：
- 使用 Chart.js 4（`https://cdn.jsdelivr.net/npm/chart.js@4`）
- 图表卡片 `.chart-card`：仅作为 Chart.js / canvas 图表的标准外壳；白底，`border-radius: 16px`，`padding: 24px`，`gap: 20px`
- 卡片标题：16px 600 fg-1；副标题：13px fg-3，`margin-bottom: 24px`
- canvas 外层必须有显式高度父容器：`<div style="position:relative;height:220px">`，否则触发 ResizeObserver 死循环
- 柱图：优先用 `--chart-brand`，不要直接用 `--brand` 或 `--seed-primary`；折线：`--chart-9`；多系列按 `--chart-1` → `--chart-10` 顺序取色
- 圆环图：cutout 62%，段间边框使用 `--chart-slice-border` 2px，不写死白色
- 网格线：`--chart-grid`；轴标签：`--chart-axis`；Tooltip：`--chart-tooltip-bg` + `--chart-grid` + padding 10px
- 图表主系列跟随模式适配：浅色用 `--accent-light`，深色用 `--accent-dark`。任何图表色与 `--bg-card` 对比度不足时，必须替换为 `--chart-neutral` 或对应模式 accent。不要把极浅色、`#000`、`#111`、黑色 `--brand` 直接用于柱、线、圆环扇区。
- `preview/charts.html` 是 Chart.js 图表库示例源头；复制图表配置时必须保留 `.chart-card` + 显式高度 canvas 父容器
- Progress / Gauge 属于正文可视化组件，默认可独立使用；只有需要进入图表网格、展示标题/副标题时，才组合进 `.chart-card`

### 8.1 图表类型库

| 类型 | 实现 | 使用场景 |
|------|------|---------|
| Bar / Horizontal Bar | Chart.js | 类目对比、排行 |
| Line / Area | Chart.js | 时间趋势、预测走势 |
| Donut | Chart.js | 占比构成 |
| Stacked Bar | Chart.js | 分组构成随时间变化 |
| Combo | Chart.js | 数量 + 比率双轴 |
| Radar | Chart.js | 多维能力 / 风险评分画像 |
| Progress | HTML/CSS | 0-100 完成率、预算消耗、阶段进度 |
| Gauge | SVG | 0-100 综合评分、风险仪表盘、健康度 |

### 8.2 Progress

- 使用 `.progress-list` / `.progress-item` / `.progress-fill`，不使用 Chart.js
- 默认输出裸 `.progress-list`，不要在组件片段中强制包 `.chart-card`
- 如果作为仪表区/图表区的一张卡展示，可外层组合 `.chart-card` + `.chart-card-title` + `.chart-card-sub`
- `progress-fill` 的 `style="width:NN%"` 必须来自真实百分比，范围 clamp 到 0-100
- 颜色按语义选择：success=达成良好，warning=待关注，danger=风险，info=信息分析；默认橙色用于中性业务进度

### 8.3 Gauge

- 使用纯 SVG，不依赖运行时 JS
- `.gauge-card` 自带卡片外壳，默认独立使用；不要再嵌套进 `.chart-card`
- 只用于 0-100 分值；半圆进度使用 `pathLength="100"` + `stroke-dasharray="score 100"`
- 不使用箭头、指针或三角标记，避免和中心文案抢层次
- 中心文案只放核心评分与短标签；风险维度说明放 `.gauge-meta`
- `.gauge-meta-item` 默认浅灰底；语义状态使用 `danger` / `warning` / `success` / `info` 功能色浅底，无描边
- 仪表盘表达评分，不替代明细；必须在旁边或下方保留维度说明

---

## 9. 数据表

**原则**：明细数据的主要容器，密度适中，行间留呼吸感。

**规格**：
- 白底，`border-radius: 16px`，overflow hidden，`border: 1px solid var(--border-subtle)`（无 box-shadow）
- 表头：`#FAFBFC` 底，13px 600 fg-2，`border-bottom: 2px solid var(--border-soft)`
- 单元格内边距：`padding: 16px 20px`
- 行间隔：`1px dashed var(--border-soft)`；hover：`--primary-soft`，过渡 0.15s
- 数值列：font-weight 600，`font-variant-numeric: tabular-nums`

**一致性规则（重要）**：
- 同列所有单元格样式必须统一，不对个别行特殊处理（除非该列本身有着色逻辑）
- 右对齐列：CSS 里必须写 `.table-card th.text-right { text-align:right }` 显式覆盖默认的 `text-align:left`

**超长文字处理**：
- 文字列（名称、描述类）：最多显示 3 行，超出截断：
  ```css
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
  ```
- 日期、数字、金额列：必须加 `white-space: nowrap`，禁止换行截断

**列内文字颜色与标签规则**：

- 所有文字列统一 fg-1，不区分主次名称
- 数字 / 金额列：fg-1 + `font-weight: 600` + `font-variant-numeric: tabular-nums` + `white-space: nowrap`
- 日期列：fg-1 + `white-space: nowrap`
- 百分比 / 赢率：badge（按阈值色）
- 阶段 / 状态：badge（按阶段色）
- 停用人员：名字 fg-3 + badge-default"已停用"

> 颜色只给 badge，不直接染文字或数字。

### Badge 着色规则

| 条件 | variant |
|------|---------|
| 赢率 ≥70% 或"谈判审核" | success |
| 赢率 40–69% 或"方案/报价" | info |
| 赢率 20–39% 或"需求确定" | warning |
| 赢率 <20% 或"验证客户" | danger |

Badge 形状：`border-radius: 20px`，`padding: 2px 10px`，11.5px 600，彩色浅底 + 功能色文字。Badge 内只用纯文字或 Lucide 图标，不用 Unicode 符号（如 ⚠）。

### 人员状态列规则

- 在职人员：名字无颜色 class，默认 fg-1
- 已停用人员：名字用 `fg3`，后跟 `badge-default` 标签"已停用"；不用 badge-danger（停用是状态，不是风险）
- 健康度列：
  - 进度条类：`flex-direction: column`，进度条在上，说明文字（fg-2）在下
  - 需操作标签：`badge-warning` + `alert-triangle` 图标，同类标签颜色必须统一
  - 纯描述标注：`badge-default`，不加图标；默认标签使用固定中性 token，浅色 `--badge-default-bg: #F3F4F6` / `--badge-default-fg: #8B909A`，深色 `--badge-default-bg: #24262B` / `--badge-default-fg: #A3A8B2`，不跟随品牌主题、不直接使用 `--bg-subtle` / `--text-3`

---

## 10. 洞察块

**原则**：提炼数据背后的判断，引导读者关注重点。

**规格**：
- 布局遵循 §18 图标+文字行规则：`display:flex; align-items:flex-start; gap:16px`；图标 `flex-shrink:0`；正文 `flex:1; min-width:0`
- `padding: 20px 24px`，`border-radius: 16px`，`border: 1px solid var(--border-subtle)`（无 box-shadow）
- 无顶部色条，level 语义由图标颜色单独承载
- hover：`background: #FAFBFC`，`transform: translateX(2px)`，过渡 0.2s
- 图标：`40×40px`，`radius: 10px`，**渐变实底 + 反白图标**（不是浅底彩色图标），带彩色 box-shadow
- 正文区（`.insight-body`）内部纵向排列：
  - 小标题（`.insight-title`）：14px **700** fg-1，`margin-bottom: 4px`，单独一行，**不加冒号**；与 `.person-name` 字重一致
  - 正文（`.insight-text`）：14px fg-2，行高 1.65，`margin: 0`
  - 整体 `padding-top: 6px` 做视觉对齐

```html
<div class="insight-item warning">
  <div class="insight-icon" style="background:linear-gradient(135deg,#FF7C19,#FFAB5C)">
    <i data-lucide="alert-triangle"></i>
  </div>
  <div class="insight-body">
    <div class="insight-title">集中度过高</div>
    <p class="insight-text">TOP3 客户占营收 <strong>73%</strong>，单一流失风险极大。</p>
  </div>
</div>
```

**level 判断（4种各用一次，不重复）**：

| level | 颜色 | 色值 | 适用语义 |
|-------|------|------|---------|
| `danger` | 红 | `--danger` #FF522A | 人员交接缺失、数据丢失等高风险 |
| `warning` | 橙 | `--warning` #FF7C19 | 集中度偏高、需关注的隐患 |
| `info` | 蓝 | `--info` #0C6CFF | 客观数据分析、结构性说明 |
| chart-6 | 绿 | `--chart-6` #55D48C | **需要操作的行动建议** |

> `primary`（#FF8000）与 `warning`（#FF7C19）视觉上过于接近，行动建议改用 `--chart-6` 绿色以保证4色可区分。
> 洞察条数跟着数据走，不合并、不删减。超过4条时，第5条起按 `--chart-1` → `--chart-10` 顺序循环取色，保证相邻条目颜色可区分。

用法：`<div class="insight-icon" style="background:#55D48C;color:#fff">`

---

## 11. 方法论折叠

**原则**：技术细节不干扰主要阅读流，按需展开。

**规格**：
- `<details>` + `<summary>`，summary 带 `›` 箭头（18px），展开时旋转 90°，过渡 0.2s
- 背景：`#FAFBFC`，`border-radius: 12px`，`1px rgba(222,225,232,0.5)` 边框
- 与上一条内容间距：`margin-top: 12px`
- summary：14px 600 fg-2，`padding: 16px 20px`
- 正文：13px fg-3，行高 1.7，`border-top: 1px dashed var(--border-soft)`，`padding: 16px 20px`

---

## 12. 正文加粗

识别以下两类内容用 `<strong>` 标注，其他不加粗：

1. **负面结果 / 零值事实**：直接说明失败、缺失、逾期的关键词组
2. **问题定性句**：段落末尾的核心问题总结（如"最大问题是……"）

---

## 13. 正文彩色高亮

对关键短语用 `<mark class="hl-*">` 做底色高亮，每段不超过 3 处。

**颜色决策规则**（先判情绪，再判是否确认；行动建议永远品牌橙）：

| class | 颜色 | 触发信号 | 心智模型 |
|-------|------|---------|---------|
| `hl-danger` | 红 | **已确认**的负面事实：失败、缺失、归零、逾期、数据丢失 | "已经坏了" |
| `hl-warning` | 黄 | **存在但未爆发**的风险：隐患、集中度偏高、态度中立/不明、待跟进 | "可能会坏" |
| `hl-info` | 蓝 | 明确的**行动建议**：核心 next step、需要做的事 | "该做这个" |
| `hl-success` | 绿 | **已确认**的正面事实：达标、超预期、支持我方、已解决 | "这个好了" |
| `hl-default` | 灰 | **中性强调**：关键数字、时间节点、金额、专有名词 | "注意看这" |
| `hl-primary` | 品牌色 | 品牌级强调（慎用）：标题关键词、报告核心主题 | — |

> 金额数字优先用 `<strong>` 加粗（不加底色）；若同时需要语义强调（如"亏损 680 万"），再叠加 `hl-danger`。

```css
.hl-danger  { background: var(--danger-soft);  color: var(--danger);  border-radius: 3px; padding: 1px 4px; font-weight: 600; }
.hl-warning { background: var(--warning-soft); color: var(--warning); border-radius: 3px; padding: 1px 4px; font-weight: 600; }
.hl-primary { background: var(--content-accent-soft); color: var(--content-accent-fg); border-radius: 3px; padding: 1px 4px; font-weight: 600; }
.hl-success { background: var(--success-soft); color: var(--success); border-radius: 3px; padding: 1px 4px; font-weight: 600; }
.hl-default { background: var(--surface-sub);  color: var(--fg-2);   border-radius: 3px; padding: 1px 4px; font-weight: 600; }
```

`<strong>` 和 `<mark>` 不对同一短语叠加使用（金额亏损除外，见上）。

---

## 14. 图标系统

使用 **Lucide** 图标库，以内联 JS 嵌入，不依赖任何 CDN（离线可用）。

完整脚本模板见 `lucide-snippet.html`，复制进 `<head>` 末尾，按需增删图标路径，`</body>` 前调用 `lucide.createIcons()`。

使用方式：`<i data-lucide="trending-up" style="width:14px;height:14px"></i>`

### 图标强调层级

| 级别 | 视觉 | 使用场景 |
|------|------|---------|
| L1 | 渐变实底 + 白色图标 + 阴影 | KPI、单一高优先级主强调 |
| L2 | soft 浅底 + 语义色图标，无阴影 | 重复洞察列表、清单标题、次要说明等常规业务内容 |
| L3 | 无底色，仅图标颜色 | meta、正文内联、按钮 / 标签辅助图标 |

- 同一内容区出现 3 个及以上图标时，默认使用 L2，避免多个 L1 争夺注意力。
- L1 每个 section 原则上不超过 1 个；KPI 卡片组按整体视为一个主强调区，可统一使用 L1。
- 图标层级表达信息优先级，不用于随机装饰；颜色仍按业务语义选择。
- 人员卡头像统一使用 L2，不因角色或关键程度升级为 L1；关键程度通过内容顺序、角色文字和 badge 表达。姓名未知时头像使用文本 `?`，不用通用 user 图标。unknown 头像和“姓名未知”文案使用固定中性 token：浅色 `--person-unknown-bg: #F3F4F6` / `--person-unknown-fg: #8B909A`，深色 `--person-unknown-bg: #24262B` / `--person-unknown-fg: #8B909A`，不跟随品牌主题、不直接使用 `--bg-inset` / `--text-3`。
- 连续步骤的数字序号统一使用 L2；即使某一步是 P0，也由 badge 表达优先级，不把单个编号升级为 L1。
- 正文中的品牌色 L2 组件使用 `--content-accent-soft` 背景和 `--content-accent-fg` 前景，不得直接使用头部色阶或 `--brand`。浅色模式下按用户所选色相生成浅色友好的浅底和可读前景；深色模式下才映射到深色友好的 `--brand-content-soft` / `--brand-content-fg`。
- “唯一行动”callout 内的左侧图标统一使用 L2 soft 色底，不使用渐变实底和阴影；默认用 `--action-callout-*` 这组固定 action 功能 token。浅色固定为暖行动色，深色固定为暗暖底 + 琥珀文字，不跟随品牌主题。danger / warning / info / success 变体用对应 `*-soft` / 语义前景色，保证同组 callout 图标层级一致。

### 图标尺寸适配规则

| 使用场景 | 容器尺寸 | 图标尺寸 |
|---------|---------|---------|
| KPI 卡片图标 | 34×34px | 16×16px |
| 洞察块图标 | 40×40px | 16×16px |
| 人员头像 | 40×40px | — |
| 行动列表序号 | 28×28px | — |
| 正文 / meta 行内图标 | — | 14×14px |
| Badge 内图标 | — | 12×12px |

### KPI 卡片图标参考

| 类型 | 图标 |
|------|------|
| 商机数 / 进行中 | `activity` / `briefcase` |
| 金额 / 收入 | `credit-card` |
| 赢率 / 转化率 | `trending-up` / `percent` |
| 时间 / 截止日 | `clock` / `calendar` |
| 人员 / 客户 | `users` / `user` |
| 完成 / 达标 | `clipboard-check` |
| 预测 / 目标 | `target` |

### 洞察块图标（固定语义）

| level | 图标 |
|-------|------|
| danger | `alert-circle` |
| warning | `alert-triangle` |
| info | `bar-chart-2` / `file-text` |
| primary | `target` / `activity` / `trash-2` |

---

## 15. 无障碍（Accessibility）

最低要求，符合 WCAG 2.1 AA：

- **文字对比度**：正文（fg-1 on bg）对比度 ≥ 4.5:1 ✓（实测约 12:1）；辅助文字（fg-3 on bg）≥ 3:1 ✓
- **不以颜色为唯一信息载体**：Badge 同时用颜色 + 文字传递状态
- **语义化 HTML**：表格用 `<table><thead><tbody>`，标题用 `<h1>`，折叠用 `<details>`
- **不做动画**：报告页面无需考虑 `prefers-reduced-motion`

---

## 16. 摘要块

**原则**：报告顶部的一句话/短段摘要，让读者 10 秒内抓到核心判断。

**规格**：
- `background: var(--bg-card)`，`border-left: 4px solid var(--structure-accent)`，`border-radius: 16px`，`padding: 20px 24px`。`--structure-accent` 浅色等于 `--accent-light`；深色等于 `--accent-dark`，必须和 section 小标题竖线一致
- 字号 15px，字重 500，fg-1，行高 1.7
- 关键短语按 §12 加粗规则 + §13 高亮规则处理（每段不超过 3 处高亮）
- **金额必须加粗**：报告中出现的所有金额数字（含单位）用 `<strong>` 包裹

```html
<div class="summary-block">
  项目总规模 <strong>680 万</strong>，<mark class="hl-warning">决策人态度中立</mark>，
  竞品已接触，<mark class="hl-primary">需领导以专家身份介入破局</mark>。
</div>
```

---

## 17. 多列布局

输入有明确双列/多列意图时，保留列数，**列宽默认均分**：

```css
/* 双列 */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
/* 三列（KPI 等） */
.three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
```

- 不做不对称比例（如 1.1fr / 0.9fr），除非入参有明确主次区分
- 右侧 sticky 侧栏：`position: sticky; top: 24px`，响应式 ≤860px 时取消 sticky 改单列

---

## 18. 图标 + 文字行布局（通用模式）

**任何"左图标、右文字"的组件**（洞察块、行动列表、时间轴、人员卡等）必须遵循以下对齐规则：

```
┌─────────────────────────────────────┐
│ [icon]  标题加粗：正文文字从这里开始 │
│         续行自动对齐文字左边缘，     │
│         不缩进到图标下方             │
└─────────────────────────────────────┘
```

**关键 CSS（缺一不可）**：

```css
.icon-text-row {
  display: flex;
  align-items: flex-start;  /* 图标顶对齐，不要 center（多行文字时图标上飘） */
  gap: 16px;
}
.icon-text-row .icon {
  flex-shrink: 0;           /* 图标固定不压缩 */
  width: 40px;
  height: 40px;
}
.icon-text-row .body {
  flex: 1;
  min-width: 0;             /* 触发 flex 子项正确截断，防文字溢出 */
}
```

> `flex-shrink: 0` + `flex: 1; min-width: 0` 是该模式的核心。少任何一条，多行文字会推挤图标或溢出容器。

**视觉对齐微调**：若图标有明显内边距/圆角，正文 `padding-top: 6–8px` 做光学居中，具体值视图标尺寸调整。

---

---

## 19. 未知语义块的兜底处理

当入参包含 8 个标准模块之外的内容时：

> **视觉层永远是 fx-ui 的，内容结构可以是对方的。**

用通用容器承接，保持 token / 间距 / 圆角 / 字色一致：

```css
.generic-block { background: var(--bg-card); border-radius: var(--radius); border: 1px solid var(--border-subtle); padding: 20px 24px; }
.generic-content { margin-top: 12px; font-size: 13px; color: var(--text-1); line-height: 1.65; }
```

若某类块反复出现（3 次以上），升级为正式模块并同步 `components.html`。

---

## 20. 页面布局系统

**核心原则**：组件只管自身内部间距（padding/gap），组件之间的间距由外层容器负责。两层分开，不相互干扰。

---

### 页面骨架

```
body（灰色底 #F0F2F5，padding: 40px 24px）
└── .page（白底 var(--bg-page)，border-radius: 20px，padding: 0 32px 60px）
    ├── .report-header（贴顶，margin: 0 -32px，负 margin 破出容器）
    ├── section × N（margin-bottom: 56px）
    │   ├── .section-title
    │   └── 内容区（卡片 / 表格 / 洞察块 等）
    └── .report-footer
```

---

### 栅格规则

| 场景 | 列数 | gap | CSS |
|------|------|-----|-----|
| KPI 卡片 | 4 列 | 16px | `grid-template-columns: repeat(4,1fr); gap: 16px` |
| 图表双列 | 2 列 | 20px | `grid-template-columns: 1fr 1fr; gap: 20px` |
| 洞察 / 时间轴 | 1 列 | 12px | `display:flex; flex-direction:column; gap:12px` |
| 数据表 | 全宽 | — | `width: 100%` |

响应式断点（写在 `<style>` 末尾）：

```css
@media (max-width: 860px) {
  .kpi-grid   { grid-template-columns: repeat(2, 1fr); }
  .chart-row  { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .kpi-grid   { grid-template-columns: 1fr; }
}
```

---

### 固定间距值（不用 token 时直接写）

| 位置 | 值 |
|------|-----|
| section 之间 | `margin-bottom: 56px` |
| 方法论与上一条内容 | `margin-top: 12px` |
| footer 与上方内容 | `margin-top: 28px` |
| 卡片内 padding | `24px` |
| 卡片列 gap | `16px` |
| 表格单元格 | `padding: 16px 20px` |
| section-title 上间距 | `margin-top: 44px` |
| section-title 下间距 | `margin-bottom: 24px` |

---

### 宽度控制

- `.page` 最大宽度：`max-width: 1160px`（宽报告）或 `960px`（单栏组件库）；`margin: 0 auto` 居中；`border-radius: var(--radius-lg)`
- 组件不写固定 `width`，由外层 Col / grid 决定宽度
- 唯一例外：头部装饰 SVG 用 `width: 100%`，充满容器

---

## 21. 动效 Token

所有 transition 必须用 motion token，不写 magic number：

| token | 值 | 用途 |
|-------|----|------|
| `--motion-fast` | 100ms | hover 色变、tab 切换、badge 闪烁 |
| `--motion-mid`  | 200ms | 卡片 hover 位移、面板展开 |
| `--motion-slow` | 300ms | 页面级进场、大块展开 |
| `--motion-easing`    | `cubic-bezier(0.215,0.61,0.355,1)` | 大部分场景（ease-out，收尾快） |
| `--motion-easing-in` | `cubic-bezier(0.55,0.055,0.675,0.19)` | 退出动画（ease-in，起步快） |

```css
/* 正确 */
transition: transform var(--motion-mid) var(--motion-easing);
/* 错误 */
transition: transform 0.2s ease;
```

---

## 22. 阴影分级

三级阴影 token，token 定义保留备用，但**独立卡片一律不加 box-shadow**，层次靠 border + 背景色区分。

**规则：没有明确要求，不加任何 box-shadow。**

| token | 值 | 保留用途（仅以下场景） |
|-------|----|------|
| `--shadow-1` | `0 2px 12px rgba(0,0,0,0.03)` | 浮层、tooltip、下拉菜单 |
| `--shadow-2` | `0 4px 20px -2px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)` | 模态弹窗 at-rest |
| `--shadow-3` | `0 8px 28px -4px rgba(0,0,0,0.10)` | 模态弹窗 hover、强调弹出 |

深色主题（blackgold）自动覆盖为更重的版本（`rgba(0,0,0,0.20/0.35/0.50)`），确保暗色背景上也有层次感。

---

## 23. 色阶自动推导

**原则**：给一个 seed 颜色，用 HSL 算法自动推出完整色阶，不用手填每一档。

### 推导逻辑

| 档位 | 算法 |
|------|------|
| `--map-primary-50`  | 色相不变，饱和度 ×0.12，明度 → 98% |
| `--map-primary-100` | 色相不变，饱和度 ×0.22，明度 → 95% |
| `--map-primary-500` | seed 本身 |
| `--map-primary-700` | 色相不变，饱和度 ×1.05，明度 ×0.72 |
| `--bg-page`         | 色相不变，饱和度 ×0.08，明度 → 99%（极淡底色） |
| `--brand-shadow`    | seed 的 RGB + 25% 透明度 |

深色自定义主题的 `--map-primary-500` / `--brand` 必须保留用户选择的 seed 原色；即使 seed 是黑色、深棕、深灰，也不自动提亮、不替换成金色或灰白。报告头背景继续使用 `--map-primary-700 → --map-primary-500 → --map-primary-100 → --bg-page`，只允许文字 token `--hd-text` / `--hd-text-soft` 按对比度自动切换。

深色自定义主题的正文色、辅助文案、边框和深色 surface 也必须从 seed 色相推导：`--text-2/3/4`、`--border-base/subtle`、`--bg-page/card/subtle/inset` 不得固定沿用 blackgold 的金棕色。用户选粉色时这些 token 应偏粉灰，选黑色时应为中性灰，选棕金时才偏棕金。

正文组件不得直接消费用户选择的 `--seed-primary`。主题源头必须先分流：浅色模式输出 `--accent-light`，深色模式输出 `--accent-dark`，再映射给 `--structure-accent`、`--summary-accent`、`--chart-brand`。`--action-callout-*` 是固定功能色，浅色/深色各一套，不参与品牌色相映射。深色下如果 seed 和背景对比不足，只提高同色相明度到约 54%-62% 区间；极浅 seed 在深色下固定压到约 58% 明度并降低饱和，不替换色相；黑色/灰色 seed 因无色相，可提升为可见中性灰。

### 用法

```js
// 拖动颜色选择器时自动触发
setCustomTheme('#C0392B');  // 任意颜色 → 完整主题
```

在 `components.html` 和 `example.html` 的主题切换器里，颜色选择器（🎨）直接调用 `generatePalette(hex)` 生成并应用全部 token。

### 预设 vs 自定义

| 方式 | 适用场景 | 精度 |
|------|----------|------|
| 预设主题（5套） | 需要精确品牌色，手工调校过 | 高 |
| 自定义颜色推导 | 快速原型、客户定制色 | 中（自动生成，视觉上合理） |

---

## 反模式（Avoid）

- 在 `:root` 之外写死十六进制颜色
- 用 `fg-4` 显示任何有意义文字
- 给卡片加过重阴影（用轻阴影 + border 区分层次，不用 box-shadow 堆叠超过 2 层）
- 4 个洞察 level 里出现颜色重复
- Badge 内用 Unicode 符号（⚠ 等）
- canvas 上直接写 height 属性
- 补造数据（报告里只出现入参有的内容）
