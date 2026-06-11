# R05 风险与敏感点

## 目标

整理领导陪访前必须知道的风险、敏感点和不能踩的坑。该规则关注“领导出面是否会放大风险、如何把风险转成可处理的问题、哪些边界不能现场越过”。

## 触发条件

完成 R01-R04 后始终执行。即使没有明确风险，也必须输出“暂无明确高风险记录”并列出陪访前需要 AE 核对的风险项。

## 输入来源

- R01 陪访背景中的紧急度、Memory 状态和陪访原因。
- R02 商机价值中的金额、阶段、预算、审批链、竞争窗口。
- R03 客户高层与关键人地图。
- R04 领导可介入点。
- CRM `ActiveRecordObj`、`CompetitiveLinesObj`、合同、订单、回款、CSM 预警、流失原因。
- Memory 中的高层关系、历史承诺、交付争议、客户敏感点、关键博弈事件。
- `references/executive_visit_reference.md` 和 `references/competitive_reference.md`。

## 风险类型

| 类型 | 说明 |
| --- | --- |
| relationship | 高层关系、Coach 降温、绕人、客户内部政治 |
| commitment | 历史承诺未兑现、领导可能被要求现场承诺 |
| competitor | 竞品 POC、报价、招投标、竞品高层关系 |
| budget | 预算、审批、采购、法务卡点 |
| delivery | 交付、实施、服务、客户健康风险 |
| payment | 回款、应收、历史财务风险 |
| churn | 流失、不续约、替换风险 |
| compliance | 合规、安全、审计、数据边界 |
| executive_boundary | 领导角色边界不清导致的风险 |
| data_gap | 信息缺口导致陪访判断失真 |

## 输出契约

```yaml
r05_risk_sensitive_points:
  risks:
    - risk_id:
      type: relationship|commitment|competitor|budget|delivery|payment|churn|compliance|executive_boundary|data_gap
      risk:
      severity: high|medium|low|unknown
      evidence:
      business_impact:
      implication_for_executive:
      executive_should_do:
      executive_should_not_do:
      ae_follow_up:
      confidence: confirmed|inferred|unknown
  sensitive_points:
    - point:
      why_sensitive:
      do_not:
      safer_path:
      confidence: confirmed|inferred|unknown
  questions_to_confirm_before_visit:
    - question:
      why_it_matters:
      suggested_owner: ae|sales_manager|executive|csm|se|finance|customer|unknown
  data_gaps:
    - gap
```

## 分级规则

| 严重度 | 判断标准 |
| --- | --- |
| high | 可能导致客户流失、商机失败、关系破裂、投诉升级、领导现场失控、合同/回款风险 |
| medium | 会影响陪访效果、推进节奏、关键人关系或客户信任 |
| low | 需要注意但短期不会改变陪访结果 |
| unknown | 信息不足，需 AE 或相关角色补充 |

## 分析规则

- 风险必须有证据；行业假设只能进入“陪访前核对问题”或 `data_gaps`。
- 每个高风险必须写清楚领导“应该做”和“不要做”。
- 领导不能现场承诺报价、折扣、交付日期、定制范围或超授权资源。
- 客户内部政治不能凭职位脑补，必须有 Memory、CRM 或用户明确输入支撑。
- 交付、回款、CSM 预警和流失原因要如实写，不要为了让领导愿意去而弱化。
- 竞品进入 C2 及以上时，必须进入风险表；C3/C4 通常至少为 `medium`。
- 不输出“今日目标”“P0/P1/P2”“就绪度”等 AE 内部语言。

## Markdown 输出

```markdown
## 5. 风险与敏感点

### 最高风险（不超过 3 条）
| 风险 | 类型 | 严重度 | 证据 | 对领导的影响 | 领导应该做 | 领导不要做 | 会后承接 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | 关系/承诺/竞品/预算/交付/回款/流失/合规/领导边界/信息缺口 | 高/中/低/未知 |  |  |  |  | AE/销售经理/CSM/售前/实施 |

### 敏感点
| 敏感点 | 为什么敏感 | 不能做 | 更稳妥的路径 |
| --- | --- | --- | --- |
|  |  |  |  |

### 陪访前必须核对
| 问题 | 为什么重要 | 建议负责人 |
| --- | --- | --- |
|  |  | AE/销售经理/拟陪访领导/CSM/售前/财务/客户 |

### 风险缺口
- {缺少客户高层态度、预算审批、竞品阶段、历史承诺、交付/回款或领导角色边界等信息}
```
