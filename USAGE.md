# FX-UI-REPORT-SKILL — Usage

给接入方 AI 看的使用指南。

## 人类触发方式

| 方式 | 操作 |
|------|------|
| Claude Code skill | 将本文件夹放入 `~/.claude/skills/`，会话中输入 `/fx-ui-report-skill` 触发 |
| 手动引用 | 把文件夹路径告诉 Claude：「读 `SKILL.md`，帮我把这份数据做成 fx-ui 风格报告」 |
| 项目内置 | 将本文件夹放入项目 repo，在项目 `CLAUDE.md` 中注明路径，团队成员自动加载 |

**触发时可指定的选项：**

| 选项 | 默认 | 可选值 |
|------|------|--------|
| 报告风格 | 浅色 | 浅色 / 深色 |
| 主色 | 橙色 `#FF8000` | 任意 hex，AI 自动推色阶 |

```
/fx-ui-report-skill 帮我出这份报告               ← 浅色 + 橙色
/fx-ui-report-skill 深色报告，帮我出这份报告      ← 深色 + 橙色
/fx-ui-report-skill 主色 #2563EB，帮我出这份报告  ← 浅色 + 自定义蓝
```

---

## Read Order

1. 先读这份文件，了解技能的职责边界和调用方式
2. 读 `SKILL.md`，了解工作流程、参照文件清单和输出前自检
3. 全读 `starter.html`，复制为目标文件骨架；它已内置 token、组件 CSS 和 Lucide
4. 读 `DESIGN.md`，了解所有组件的设计原则和规格
5. 按需查 `components.html`，复制需要的组件 HTML 结构
6. 按需查 `example.html`，只参考完整报告的章节组织和信息密度
7. 需要 Chart.js 图表配置、配色和 canvas 高度写法时查 `preview/charts.html`

生成报告时无需单独读取或复制 `tokens.css`、组件 `<style>`、`lucide-snippet.html`；这些内容已经内置在 `starter.html`。

规范源优先级：`starter.html` > `DESIGN.md` > `components.html` > `example.html`。`example.html` 不是规范源、CSS 源或组件真相源；若它与前三者冲突，一律以前三者为准。

`preview/` 目录只提供预览和参考，不参与规范优先级。

---

## 文件职责一览

| 文件 | 职责 | 新内容往哪加 |
|------|------|------------|
| `SKILL.md` | 工作流：识别语义块 → 组装组件 → 输出前自检。只管"做什么"，不管"怎么做" | 不加规则，只改流程描述 |
| `DESIGN.md` | 组件手册：设计原则 + 规格 + 一致性规则。**所有新规则的唯一归宿** | 找到对应章节追加 |
| `USAGE.md` | 接入指南：文件职责、读取顺序、Do/Avoid 速查 | 新增文件时更新职责表 |
| `lucide-snippet.html` | Lucide 图标内联脚本模板，复制进生成的 HTML `<head>` 即用 | 新增图标路径时更新 |
| `theme-toolbar.js` | 独立主题切换工具栏，`<script src>` 引入即用；主题变更时 dispatch `fxthemechange` 事件 | 新增预设主题时更新 `PRESETS` 对象 |
| `example.html` | 人工校对过的标准输出样本，只做章节组织与信息密度参考 | 有重大风格升级时同步，但不得覆盖 starter / DESIGN / components 规则 |
| `starter.html` | 报告生成骨架，已内置 token、组件 CSS 与 Lucide | 组件或 token 变更时同步 |
| `components.html` | 组件 CSS 真相源与可视化展示 | 新增正式组件时同步 |
| `tokens.css` | Design Token 独立定义与维护参考 | 新增 token 时更新，并同步 starter |
| `preview/charts.html` | Chart.js 图表库预览：图表类型、配色、配置和显式高度 canvas 写法 | 新增 Chart.js 图表类型时同步 |
| `preview/colors.html` | 色板预览：给人查看 token 与 BI 图表色板 | token 色值变化时同步 |
| `preview/typography.html` | 文字层级预览：给人查看 fg-1/2/3/4 和字号层级 | 文字规范变化时同步 |

> **判断规则放哪里：** 只要是"HTML 应该长什么样"的规则，放 `DESIGN.md`。跟识别输入、决定输出哪些块相关的逻辑，放 `SKILL.md`。

## 分发与构建规则

**唯一源码目录**：`/Users/heqiao/Desktop/fx-ui-report-skill`

这里保留开发文件、预览、测试素材、构建脚本和历史辅助文件。所有规则修改、主题 token 调整、组件修复都只在源码目录完成。

**唯一分发目录**：`dist/fx-ui-report-skill/`

发给别人、安装到别的机器或交付给接入方时，只使用这个目录，或使用同目录下自动生成的 `dist/fx-ui-report-skill.zip`。不要直接分发源码根目录，也不要手工维护桌面的 `fx-ui-report-skill-share` 作为长期版本。

构建命令：

```bash
python3 scripts/build-dist.py
```

构建脚本会：

- 先运行 `python3 scripts/check-sync.py` 校验源码；
- 清空并重建 `dist/fx-ui-report-skill/`；
- 只复制 skill 必要文件：`SKILL.md`、`agents/`、`assets/`、`references/`、`scripts/check-sync.py`；
- 移除 `.DS_Store` 和 `__pycache__`；
- 在分发目录内再次运行 `scripts/check-sync.py`；
- 生成 `dist/fx-ui-report-skill.zip`，zip 内容与分发目录同版本。

分发目录和 zip 都是构建产物，不手改。若发现产物问题，回到源码文件修改后重新运行 `python3 scripts/build-dist.py`。

桌面旧目录 `/Users/heqiao/Desktop/fx-ui-report-skill-share` 只作为历史临时拷贝；后续若需要桌面副本，也应从 `dist/fx-ui-report-skill/` 复制，不再作为维护源。

## Git 管理规则

Git 只管理源码和维护脚本，不管理可再生构建产物。

**应提交：**

- `SKILL.md`
- `agents/`
- `assets/`
- `references/`
- `scripts/check-sync.py`
- `scripts/build-dist.py`
- `USAGE.md`
- 其他明确作为源码维护的规范、模板、manifest、token 文件

**不提交：**

- `dist/`
- `dist/fx-ui-report-skill.zip`
- `.DS_Store`
- `__pycache__/`
- `.codex/`
- 临时测试输出和本地缓存

发版流程：

```bash
python3 scripts/check-sync.py
python3 scripts/build-dist.py
git status --short
```

确认源码变更符合预期后再 commit。需要给别人文件时，用本地生成的 `dist/fx-ui-report-skill.zip`；需要记录版本时，用 git tag 标记源码版本，而不是提交 zip。

## GitHub Release 分发规则

长期分发使用 GitHub Releases，不用桌面目录或网盘作为主渠道。

**推荐公开下载地址格式：**

```text
https://github.com/<owner>/fx-ui-report-skill/releases/latest/download/fx-ui-report-skill.zip
```

其中 `<owner>` 替换为实际 GitHub 用户名或组织名。这个 `latest` 地址会始终指向最新 Release，适合发给接入方长期使用。

### 首次建立远程仓库

在 GitHub 新建仓库，例如 `fx-ui-report-skill`，然后在本地绑定 remote：

```bash
git remote add origin git@github.com:<owner>/fx-ui-report-skill.git
git push -u origin main
```

如果仓库已存在 remote，只需要确认：

```bash
git remote -v
```

### 日常维护流程

```bash
python3 scripts/check-sync.py
python3 scripts/build-dist.py
git status --short
git add <源码文件>
git commit -m "update fx-ui report skill"
git push
```

`dist/` 和 zip 不提交，它们只在本地构建或 GitHub Actions 里生成。

### 发版流程

使用语义版本 tag：

```bash
git tag v1.0.0
git push origin v1.0.0
```

仓库内的 `.github/workflows/release.yml` 会在 tag 以 `v` 开头时自动执行：

1. checkout 源码；
2. 运行 `python3 scripts/build-dist.py`；
3. 创建 GitHub Release；
4. 上传 `dist/fx-ui-report-skill.zip`。

发版后，对外只给最新下载地址：

```text
https://github.com/<owner>/fx-ui-report-skill/releases/latest/download/fx-ui-report-skill.zip
```

### 修复已发布版本

不要覆盖旧 tag。修复后重新打新版本：

```bash
git tag v1.0.1
git push origin v1.0.1
```

旧版本保留在 Releases 里，方便回滚和追溯。

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
