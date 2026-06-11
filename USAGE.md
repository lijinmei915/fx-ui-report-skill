# fx-ui Report Beautifier — Usage

给接入方 AI 看的使用指南。

## 人类触发方式

| 方式 | 操作 |
|------|------|
| Claude Code skill | 将本文件夹放入 `~/.claude/skills/`，会话中输入 `/fx-ui-design-re` 触发 |
| 手动引用 | 把文件夹路径告诉 Claude：「读 `SKILL.md`，帮我把这份数据做成 fx-ui 风格报告」 |
| 项目内置 | 将本文件夹放入项目 repo，在项目 `CLAUDE.md` 中注明路径，团队成员自动加载 |

**触发时可指定的选项：**

| 选项 | 默认 | 可选值 |
|------|------|--------|
| 报告风格 | 浅色 | 浅色 / 深色 |
| 主色 | 橙色 `#FF8000` | 任意 hex，AI 自动推色阶 |

```
/fx-ui-design-re 帮我出这份报告               ← 浅色 + 橙色
/fx-ui-design-re 深色报告，帮我出这份报告      ← 深色 + 橙色
/fx-ui-design-re 主色 #2563EB，帮我出这份报告  ← 浅色 + 自定义蓝
```

---

## Read Order

1. 先读这份文件，了解技能的职责边界和调用方式
2. 读 `SKILL.md`，了解工作流程、参照文件清单和输出前自检
3. 读 `tokens.css`，整段复制 `:root {}` 进生成 HTML 的 `<style>`
4. 读 `components.html`，复制完整 `<style>` 块，不重写任何 CSS
5. 读 `lucide-snippet.html`，复制进 `<head>` 末尾
6. 读 `DESIGN.md`，了解所有组件的设计原则和规格
7. 读 `example.html`，人工校对过的完整报告参考
8. 需要图表配色参考时查 `preview/charts.html`

---

## 文件职责一览

| 文件 | 职责 | 新内容往哪加 |
|------|------|------------|
| `SKILL.md` | 工作流：识别语义块 → 组装组件 → 输出前自检。只管"做什么"，不管"怎么做" | 不加规则，只改流程描述 |
| `DESIGN.md` | 组件手册：设计原则 + 规格 + 一致性规则。**所有新规则的唯一归宿** | 找到对应章节追加 |
| `USAGE.md` | 接入指南：文件职责、读取顺序、Do/Avoid 速查 | 新增文件时更新职责表 |
| `lucide-snippet.html` | Lucide 图标内联脚本模板，复制进生成的 HTML `<head>` 即用 | 新增图标路径时更新 |
| `theme-toolbar.js` | 独立主题切换工具栏，`<script src>` 引入即用；主题变更时 dispatch `fxthemechange` 事件 | 新增预设主题时更新 `PRESETS` 对象 |
| `example.html` | 人工校对过的标准输出样本，视觉参考 | 有重大风格升级时同步 |
| `components.html` | 组件可视化展示 | 新增正式组件时同步 |
| `tokens.css` | Design Token 变量定义，`:root {}` 直接复制进生成的 HTML | 新增 token 时更新 |

> **判断规则放哪里：** 只要是"HTML 应该长什么样"的规则，放 `DESIGN.md`。跟识别输入、决定输出哪些块相关的逻辑，放 `SKILL.md`。

## 调用方式

### 输入：任意格式均可

```
你给我：HTML / JSON / Markdown / 纯文字 / 截图描述
我输出：一份完整的 fx-ui 风格独立 HTML 报告文件
```

不需要事先把数据整理成特定格式。AI 会自动识别内容语义（KPI / 图表 / 数据表 / 洞察 / 方法论），映射到对应的报告组件。

### 输出约束

- 单文件 HTML，所有样式内嵌，无外部依赖（Chart.js CDN 除外）
- 颜色只用 `tokens.css` 里定义的变量，不自造颜色
- 不修改数据事实，只管视觉呈现
- 如果入参缺少某个语义块，跳过该块，不补造数据

## Design Highlights

- **Visual style**：企业级数据报告，克制专业，信息密度优先
- **Color stance**：品牌橙顶边强调 + 中性灰背景 + 功能色（success/warning/danger/info）语义化着色
- **Hierarchy**：4 级文字明度（fg-1 → fg-4），标题类永远用 fg-1，报告里不出现看不清的文字
- **Chart colors**：10 色 BI 色板，来自 Figma「BI常用颜色」规范，各色系视觉均衡阶

## Do

- 标题类文字（section title / KPI label / card title）一律用 `var(--fg-1)`
- KPI 卡片统一加顶部 2px 品牌橙边，4 张卡样式一致
- 图表容器必须用 `<div style="position:relative;height:NNNpx">` 包裹 canvas，避免 Chart.js ResizeObserver 死循环
- Insight 图标用彩色实底 + 反白图标（不是浅底彩色图标）
- Badge 赢率/状态按语义着色（≥70% success，40–69% info，20–39% warning，<20% danger）

- 遇到 8 个标准模块之外的内容，用 `generic-block` 兜底容器承接；**视觉层永远是 fx-ui 的**（token/间距/圆角/字色/Lucide 图标），只有内部布局跟着对方数据走（详见 `DESIGN.md` 第 13 节）

## Avoid

- 不要在 `:root` 之外写死十六进制颜色值
- 不要使用 `tokens.css` 以外的颜色
- 不要修改输入数据的事实（数字、名称、日期）
- 不要补造输入中不存在的数据块
- 不要用 `fg-4`（#C1C5CE）显示任何有意义的文字——它只用于真正可忽略的装饰性内容
