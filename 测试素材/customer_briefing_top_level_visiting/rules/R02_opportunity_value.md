# R02 商机价值

## 目标

判断这个客户和本次商机是否值得领导出面，并把价值讲成领导能快速理解的业务判断：金额、阶段、战略意义、行业标杆、续约/增购空间、竞争窗口和时间压力。

## 触发条件

完成 R01 后始终执行。即使商机信息不足，也必须输出“商机价值信息不足”并列出需要 AE 或 CRM 补齐的问题。

## 输入来源

- CRM `NewOpportunityObj`：商机名称、阶段、金额、赢率、预计结单、预算状态、审批链、备注。
- CRM `AccountObj`：行业、规模、成交状态、来源、最后跟进时间。
- full 模式下的 `ContractObj`、`SalesOrderObj`、回款、客户健康数据。
- Memory 中的项目起源、客户战略背景、历史合作、续约/增购线索。
- `references/industry_benchmarks.md`，仅用于形成行业价值假设。

## 输出契约

```yaml
r02_opportunity_value:
  opportunity:
    opportunity_id:
    name:
    sales_stage:
    sales_status:
    amount:
    probability:
    close_date:
    budget_status:
    approval_flow:
    competitors:
  value_judgment:
    executive_visit_value: high|medium|low|unknown
    business_value:
    strategic_value:
    renewal_or_expansion_value:
    benchmark_value:
    timing_window:
    why_now:
    confidence: confirmed|inferred|unknown
  value_evidence:
    - evidence:
      source: crm|memory|customer_quote|public_info|inferred
      confidence: confirmed|inferred|unknown
  value_gaps:
    - gap
```

## 判断规则

- 商机金额必须来自 CRM、用户输入或 Memory，不能估算。
- `probability` 是 AE 主观赢率，只作为背景，不直接决定是否值得领导陪访。
- 价值判断必须至少回答一个问题：领导出面能增加什么确定性？
- 行业基准只能用于“待核对价值假设”，不能写成客户真实诉求。
- 如果客户是续约、增购、集团化复制、标杆客户或高风险修复场景，必须写出高层陪访的经营价值。
- 只讲“客户很重要”不合格，必须写清重要在哪里：金额、标杆、续约、竞品、组织关系、交付修复或长期战略。

## Markdown 输出

```markdown
## 2. 商机价值

### 商机概览
| 字段 | 内容 | 置信度 |
| --- | --- | --- |
| 商机名称 |  | 确认/推断/未知 |
| 当前阶段 |  |  |
| 商机状态 | 进行中/赢单/输单/搁置/未知 |  |
| 商机金额 |  |  |
| CRM 赢率 |  |  |
| 预计结单/关键时间 |  |  |
| 预算状态 | 已批复/申请中/未知 |  |
| 审批链路 |  |  |

### 陪访价值判断
| 维度 | 判断 | 证据 |
| --- | --- | --- |
| 领导出面价值 | 高/中/低/未知 |  |
| 业务价值 |  |  |
| 战略/标杆价值 |  |  |
| 续约/增购价值 |  |  |
| 时间窗口 |  |  |
| 为什么现在要见 |  |  |

### 价值缺口
- {缺少金额、阶段、预算状态、审批链路、客户高层诉求或行业价值证据等信息}
```
