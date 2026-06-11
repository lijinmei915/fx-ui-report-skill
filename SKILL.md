---
name: fx-ui-design-re
zh_name: "fx-ui 报告美化"
en_name: "fx-ui Report Beautifier"
zh_description: "把任意格式的报告数据（HTML/JSON/Markdown/纯文字）转成符合 fx-ui 设计规范的独立 HTML 报告页。"
en_description: "Turn any report data (HTML / JSON / Markdown / plain text) into a polished standalone HTML report using the fx-ui design system."
aspect_hint: "桌面长页面"
tags: ["report", "data", "fx-ui", "crm", "dashboard", "美化", "报告"]
example_name: "example.html"
example_format: html
mode: prototype
example_prompt: "用「fx-ui 报告美化」技能把我的报告数据做成一份完整的独立 HTML 报告。保持 fx-ui 的视觉签名，使用真实内容和数据，不要 lorem ipsum 或占位数据。"
---

【技能：fx-ui 报告美化】

接受任意格式的报告数据，输出一份完整的、视觉规范严格对齐 fx-ui 设计系统的独立 HTML 文件。

**你的职责**：只管"怎么好看"，不修改数据事实。入参随意，出参严格。

**开始前必读（按顺序）：**

| 文件 | 用途 | 读法 |
|------|------|------|
| `starter.html` | **起点骨架**：已内置全套 token、组件 CSS、头部动画、内联 Lucide。复制它当底，只填内容 | 全读 |
| `components.html` | 组件库：查 class 名与组件 HTML 结构，把需要的组件块复制进 starter 内容区 | 按需查结构 |
| `DESIGN.md` | 设计规范：组件选择规则、排版、间距、颜色使用原则 | 全读 |
| `example.html` | 案例 HTML：人工校对过的完整报告，视觉与结构参考 | 按需查阅 |
| `tokens.css` / `lucide-snippet.html` | Token 定义 / 图标脚本——**已内置进 starter，无需单独读或复制** | 不读 |
| `preview/charts.html` | 图表色板：Chart.js 10 色 BI 色板展示，配色参考 | 按需查阅 |
| `design-tokens.json` / `components.manifest.json` | Token / 组件清单（机器可读） | 按需查阅 |

---

## 第一步：识别内容结构

不管入参是什么格式，先识别以下语义块：

| 语义块 | 识别信号 |
|--------|---------|
| **报告头** | 标题、日期、数据来源、制表人 |
| **KPI** | 核心数字指标，通常 2–6 个 |
| **图表** | 有数字序列、分类对比、趋势的数据集 |
| **数据表** | 多列多行明细 |
| **洞察** | 结论性文字，常带风险 / 警告 / 建议语气 |
| **方法论** | 计算规则、数据口径说明 |

**识别原则**：有什么块输出什么块，没有的跳过，不补造数据，不套固定模板。

---

## 第二步：基于 starter 组装

1. 复制 `starter.html` 作为目标文件的底——`<style>` 与内联 Lucide 已就位，**禁止重写或重复输出整段 CSS**
2. 报告头：只改 `.report-header` 里的 eyebrow / h1 / meta 文字，结构与动画 class 原样保留
3. 内容区：在 `<!-- 内容区 -->` 注释处，按识别结果从 `components.html` 复制需要的组件 HTML，填真实数据
4. 自定义配色时，按文末「主题换色」在 starter 的 `:root` 末尾追加覆盖块
5. 严格遵循 `DESIGN.md` 规范，默认**浅色 + 橙色主题**

> 提速要点：CSS 一行都不重写——样式全靠 starter 已内置的 class 命中。模型只产出内容块，输出量最小，这是本技能最大的耗时来源。

---

## 第二步半：交互确认

**在输出 HTML 之前**，先问配色：

```
问：「要用默认模版（浅色 + 橙色）还是自定义配色？」

├── 默认 → 直接生成，结束
└── 自定义
      ↓
    问：「浅色还是深色报告？」
      ↓
    问：「主色 hex 是？」→ 按用户色值生成
```

每一步等用户回答再继续，不合并提问，不主动追问其他内容。

---

## 第三步：输出前自检

生成完 HTML 后，逐条核对，有问题改完再输出：

- [ ] 所有颜色用 `var(--xxx)`，无写死十六进制值 →（DESIGN §2）
- [ ] Lucide 已从 `lucide-snippet.html` 内联，无外部 CDN script →（DESIGN §14）
- [ ] 同列单元格样式统一，无随机 `<strong>` 或单行颜色异常 →（DESIGN §9）
- [ ] 表格文字列统一 fg-1；数字/金额列 600 + tabular-nums + nowrap；日期列 nowrap；颜色只给 badge，不染文字 →（DESIGN §9）
- [ ] 右对齐列：CSS 里有 `.table-card th.text-right { text-align:right }` →（DESIGN §9）
- [ ] Badge 内无 Unicode 符号（⚠ 等），只用 Lucide 图标或纯文字 →（DESIGN §9）
- [ ] 停用人员：名字 `fg3` + `badge-default`；在职人员名字无颜色 class →（DESIGN §9）
- [ ] 洞察块：4 个 level 各用一次，无颜色重复；图标彩色实底反白 →（DESIGN §10）
- [ ] Section 副标题无括号 →（DESIGN §6）
- [ ] 文字段落高亮每段不超过 3 处，颜色按语义选：红=已确认负面 / warning橙=潜在风险 / 品牌橙=行动建议 / 绿=已确认正面 / 灰=中性强调 →（DESIGN §13）
- [ ] 无补造数据——报告里出现的内容必须来自入参（KPI 环比数字：有对比期才输出，无则省略，不造随机值）
- [ ] 图标+文字行：图标有 `flex-shrink:0`，文字容器有 `flex:1; min-width:0`，容器用 `align-items:flex-start` →（DESIGN §18）
- [ ] 无自造组件用语义色做大面积背景——`--info-soft` / `--success-soft` 等只用于 badge、icon；大块背景只用 `--surface` / `--surface-sub` / `--primary-soft`；新组件背景一律白底 + `--primary` 左边框

---

## 参考案例

| 文件 | 场景 | 包含组件 |
|------|------|---------|
| `example.html` | CRM 销售报告（基础模板） | KPI 卡、图表、数据表、洞察块、方法论折叠 |

---

## 输出规范

1. 基于 `starter.html` 骨架生成，`<style>` 与 Lucide 已内置，**禁止重写或重复输出整段 CSS**
2. 只输出 HTML，不输出任何解释文字
3. 颜色只用 `var(--xxx)`，不写死十六进制值

---

## 主题换色

设计系统采用 4 层 token 结构（Seed → Map → Alias → Component）。换主题时只需覆盖 Seed + Map primary，所有组件自动跟着变。

### 预设主题（`themes/` 文件夹）

| 文件 | 主色 | 适用场景 |
|------|------|---------|
| `theme-orange.css` | `#FF8000` | 默认，品牌橙 |
| `theme-blue.css`   | `#2563EB` | 企业/科技 |
| `theme-green.css`  | `#16A34A` | 健康/自然 |
| `theme-purple.css` | `#8B5CF6` | 创意/高端 |
| `theme-black-gold.css` | `#D4AF37` | 黑金/奢华（深色） |

### 浅色主题换色（4行搞定）

在报告 HTML 的 `:root` 末尾追加，覆盖默认值：

```css
:root {
  --seed-primary: #2563EB;
  --seed-bg:      #F8FAFF;
  --map-primary-50:  #EFF6FF;
  --map-primary-100: #DBEAFE;
  --map-primary-500: #2563EB;
  --map-primary-700: #1D4ED8;
}
```

### 深色主题（黑金等）

深色主题需要额外覆盖 Alias 层的表面色和文字色（因为深色背景下文字需要翻转），直接复制 `theme-black-gold.css` 的完整 `:root` 块使用。

### 任意 hex 推色阶（浅色主题）

用户提供任意 `#RRGGBB`，按以下步骤推算所有 primary token：

> **注意**：`themes/` 里的预设色值是手工调优过的，视觉上比公式结果更暖、更鲜亮。公式用于自定义色，效果近似但不完全一致——这是预期行为，不是公式错误。

**第一步：转 HSL**，得到 H（色相 0–360）、S（饱和度 0–100）、L（亮度 0–100）。

**第二步：推 token 值**

| Token | 公式 |
|-------|------|
| `--map-primary-500` | 种子色本身 |
| `--map-primary-700` | `HSL(H, min(S×1.05, 100), max(L×0.72, 15))` |
| `--map-primary-100` | `HSL(H, max(S×0.22, 7), min(L+(100-L)×0.78, 95))` |
| `--map-primary-50`  | `HSL(H, max(S×0.12, 4), min(L+(100-L)×0.93, 98))` |
| `--seed-bg` / `--bg-page` | `HSL(H, max(S×0.08, 3), min(L+(100-L)×0.96, 99))` |
| `--brand` | 若种子色相对亮度 > 0.30（偏浅色），用 p700；否则用种子色本身 |

> 相对亮度公式：将 R/G/B 各自 ÷255 → 若 ≤0.04045 则 ÷12.92，否则 `((x+0.055)/1.055)^2.4`；然后 `0.2126R + 0.7152G + 0.0722B`。

**第三步：推 header blob 颜色**（从种子色 RGB 分量 R/G/B 偏移，各值 clamp 到 0–255）

| Token | 公式 |
|-------|------|
| `--hd-blob-1` | `rgba(R+60, G+60, B+20, 0.55)` |
| `--hd-blob-2` | `rgba(R-20, G-40, B+30, 0.45)` |
| `--hd-blob-3` | `rgba(R+30, G+30, B+50, 0.30)` |

**第四步：其余 token 不变**，文字色、语义色、圆角、间距全部保持 `tokens.css` 默认值。

---

## 组件沉淀规则

遇到现有组件无法覆盖的新结构时：

**先问：能不能用现有组件拼出来？**
- 能 → 直接组合，不新建
- 不能 → 看下面

**拼不出来时，按复用频率决定：**

| 情况 | 做法 |
|------|------|
| 同类结构在 3 份以上报告出现 | 抽成组件，加进 `components.html` 和 `manifest` |
| 只在当前报告出现 | token + inline HTML，不建组件 |

**token + inline HTML 写法：**
不写 CSS class，样式直接写在 `style=""` 里，但值全部引用 `var(--xxx)`：

```html
<div style="
  background: var(--surface-inset);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-soft);
  padding: 14px 16px;
  font-size: 13px;
  color: var(--fg-3);
">
  一次性内容
</div>
```

这样视觉上与设计系统一致，但不占组件库位置。

### 改组件必须同步（强制收尾）

新增或修改任何组件时：

1. **CSS 只改 `components.html`**——它是 CSS 的唯一真身，`starter.html` 已内置全部 CSS，`components.manifest.json` **不含 css 字段**
2. **`components.html` 与 `components.manifest.json` 一起改**——结构/类名变了，manifest 的 `html`、`note`、组件清单同步更新
3. **跑校验**：`python3 check-sync.py`，必须输出 ✅ 才算改完。它会拦下「manifest 引用了 components 没有的 class」（漂移）、「manifest 残留 css 字段」等问题
4. 改了报告头动画/装饰，记得 `starter.html`、`components.html`、`manifest` 三处的报告头结构保持一致

---

## 迁移已有 HTML（外部文件美化）

接到别人的 HTML 文件时，按以下五步顺序处理。**组件是选配，按内容需要组合，不套模板字段。**

### Step 1 — 结构底层（强制，最先改）

> 最快做法：直接复制 `starter.html`，body / `.page` 三件套与 header 已就位，把对方内容搬进内容区即可。下面是需要手改时的目标值。

`body` 必须：
```css
background: #F0F2F5;
padding: 40px 24px;
```

`.page` 容器必须：
```css
padding: 0 32px 60px;   /* 顶部 0，header 贴顶 */
background: #FFFCF7;
border-radius: 20px;
box-shadow: 0 4px 32px rgba(0,0,0,0.06);
overflow: hidden;
position: relative;
```

> body 与 .page 背景色必须不同——同色会导致圆角处产生断裂缺口。

- 页面顶部 → 换 `report-header` 组件
- 页面底部折叠说明 → 换方法论折叠（`<details>` + `.methodology-body`）

### Step 2 — Token 替换

对照 `design-tokens.json`，把所有硬编码色值替换为 `var(--xxx)`。

重点核查：
- `--bg` 必须 `#FFFCF7`，不能是 `#F7F8FA` / `#FFFFFF` / 其他
- `--primary` 必须 `#FF8000`
- `--radius` 必须 `16px`，`--radius-sm` 必须 `12px`

### Step 3 — 组件映射

| 原内容特征 | 换成 |
|-----------|------|
| 一段结论性文字 | `summary-block` |
| 带图标的行动 / 洞察条目 | `icon-row` |
| 多个短 key-value 信息格 | `inner-grid` |
| 人员信息卡 | `person-card` |
| 时间序列节点 | `timeline` |
| 警告 / 风险横幅 | `icon-row` danger 色 |
| 分组标题 + 列表 | `icon-row--list` |
| 徽章/标签 | `.badge .badge-*` |
| 内联高亮 | `.hl-*` |

**无法映射的结构**：保留原内容，但至少替换 token、字体、外框（surface + border + radius + shadow）。

### 卡片层级规范

| 类型 | 背景 | 边框 | 投影 | 圆角 | 使用场景 |
|------|------|------|------|------|---------|
| **独立卡片** | `--surface` 白 | `1px solid var(--border-subtle)` | **无** | `--radius` | 直接浮于页面，层次靠 border + 背景色区分 |
| **内部卡片** | `--surface-inset` 浅灰 | `1px solid var(--border-soft)` | 无 | `--radius-sm` | 嵌套在其他容器内，不与页面底色竞争层次 |

- 所有卡片（独立卡片、内部卡片）一律不加 box-shadow，没有明确要求不加
- 颜色变体（danger/warning/success/info）在 `kv-item` 上加 class，效果为 soft 背景 + 左侧 4px 彩色边框

### Step 4 — 文字规范

| 层级 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 标题 | 16px | 700 | fg-1 |
| 正文 | 14px | 400 | fg-1 / fg-3 |
| 辅助说明 | 13px | 400 | fg-3 |
| meta / 日期 | 11px | 500 | fg-3 |

### Step 5 — 自检

- [ ] `:root` token 与 `design-tokens.json` 一致
- [ ] `body` + `.page` 三件套齐全
- [ ] 无硬编码十六进制色值
- [ ] 所有 badge / 高亮用标准 class
- [ ] Lucide 图标已内联（无外部 CDN）
