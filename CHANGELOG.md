# 更新说明

这里记录 `fx-ui-report-skill` 最近 10 个公开版本的主要变化。

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

## v1.0.5 - 2026-06-12

- 将 `CHANGELOG.md` 加入对外分发包，方便用户下载后查看更新说明。
- 在 `USAGE.md` 中补充分发包更新说明的维护规则。

## v1.0.4 - 2026-06-12

- 从对外分发包中移除 `VERSION.json`。
- 在分发包的 `SKILL.md` frontmatter 中保留版本信息：
  `version`, `updated_at`, `build_commit`, and `download_url`.

## v1.0.3 - 2026-06-12

- 增加分发包 `SKILL.md` 自动写入版本信息的机制。
- 发布包里的 skill 文件现在会直接显示版本号和更新日期。

## v1.0.2 - 2026-06-12

- 增加构建时生成包元数据的机制。
- 补充包版本核验相关说明。
