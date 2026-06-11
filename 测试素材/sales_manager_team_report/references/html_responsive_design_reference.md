# HTML 自适应设计参考

本文件用于团队日报、团队周报、团队月报的 HTML 输出。目标是让同一份 HTML 在手机端和 Web 端都易读、专业、稳定。

## 页面原则

- 单页 HTML，默认不依赖外部资源。
- Mobile-first：先保证手机端单列阅读，再增强桌面端布局。
- 页面像销售主管经营看板，不像营销落地页。
- 内容顺序与团队报表一致：摘要、指标、关键结果、AE 表现、重点客户/商机、跨 AE 风险、行动计划、数据说明。
- 不展示对象 ApiName、记录 ID、系统字段。

## 布局规则

- 主容器：`max-width: 1120px; margin: 0 auto; padding: 16px;`
- 手机端：所有模块单列排列。
- 桌面端：指标卡、摘要卡、行动块可多列；正文模块仍保持清晰纵向阅读。
- 表格：必须有横向滚动容器 `.table-wrap { overflow-x: auto; }`。
- 长文本：允许换行，不使用固定高度截断关键内容。
- P0/P1/P2：使用视觉层级区分，但不使用高饱和大色块。

## 推荐 CSS 片段

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  line-height: 1.6;
  color: #1f2933;
  background: #f6f7f9;
}

.report {
  max-width: 1120px;
  margin: 0 auto;
  padding: 16px;
}

.section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 14px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.metric-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fbfcfd;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  padding: 10px;
  text-align: left;
  vertical-align: top;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 860px) {
  .action-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .report {
    padding: 12px;
  }

  .section {
    padding: 14px;
  }

  h1 {
    font-size: 22px;
  }

  h2 {
    font-size: 18px;
  }
}

@media print {
  body {
    background: #ffffff;
  }

  .section {
    break-inside: avoid;
    border-color: #d1d5db;
  }
}
```

## 表格与手机端

团队报表中 AE 表现和关键指标可以保留表格，但必须处理手机端：

- 简单表格：使用 `.table-wrap` 横向滚动。
- 行数多、列数多：优先拆成“桌面表格 + 手机卡片列表”。
- 手机卡片必须保留桌面表格的核心字段，不得删掉风险和管理判断。

## HTML 内容限制

- HTML 中的 CRM 数据说明只能使用中文对象名。
- 不输出 `_id`、记录 ID、数据 ID 或长串主键。
- 不输出 `JournalObj`、`NewOpportunityObj` 等对象 ApiName。
- 不输出 `work_summary`、`work_experience`、`journal_time` 等字段 ApiName。
- 不把“生成 HTML”描述为“已保存到 CRM”。

## 验收标准

生成 HTML 前检查：

1. 有 viewport。
2. 手机端单列可读。
3. 桌面端宽度不超过主容器。
4. 表格不会撑破屏幕。
5. P0/P1/P2 行动在手机端仍清晰。
6. 没有对象 ApiName、记录 ID 或系统字段。
7. HTML 之后仍有 CRM 日志保存确认。
