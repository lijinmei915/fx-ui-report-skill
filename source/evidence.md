# fx-ui Report Skill — Source Evidence

## Source Scope

这份报告 skill 不是凭空编写的，所有 token 值和视觉规则都来自 fx-ui 项目的真实产物。

## Included Source Files

- `theme/fx-theme.css` — token 真相源（公司视觉变量，详见 `docs/TOKENS.md`）
- `skills/fx-ui-report/example.html` — 人工校对通过的报告样板，是 `opportunity_forecast_fx-ui.html` 经多轮迭代后的最终版本

## Token Contract

`source/token-contract.report.json` 把 `design-tokens.json` 里每一个报告 token 映射回 `theme/fx-theme.css` 的具体行号。

报告 skill 使用了一套**别名层**（`--fg-1~4`、`--bg`、`--surface`…），这是为了让生成的 HTML 更可读——但每个别名都有对应的 shadcn/fx-ui 原始 token，不是自造颜色。

`design-tokens.json`、`tailwind-v4.css`、`tokens.css`、`components.html` 都是「导出产物」——
真相源永远是 `theme/fx-theme.css` 和 `example.html`，这些文件改了就要重新导出，不要手动改导出产物。

## 校验脚本

`scripts/check-tokens-sync.sh` 会在每次提交前检查 `fx-theme.css :root {}` 里的所有 hex 值是否都登记在 `docs/TOKENS.md` 里。
如果 `theme/fx-theme.css` 改了某个 token 的色值，需要同步更新 `tokens.css` 和 `design-tokens.json`，否则脚本会报漂移。
