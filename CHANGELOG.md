# 更新说明

这里记录 `fx-ui-report-skill` 最近 10 个公开版本的主要变化。

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

## v1.0.1 - 2026-06-12

- 增加通用报告生成协议。
- 增加信息桶、优先级、组件映射、隐藏/压缩规则。
- 将 `USAGE.md` 暂时加入分发包，后续版本已移除。

## v1.0.0 - 2026-06-12

- 发布第一个 GitHub Release 包。
- 增加基于 tag 的自动发布流程。
- 建立最小分发包和 latest 固定下载链接机制。
