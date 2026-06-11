# R05 项目背景与商机全貌

## 目标

整理客户名下当前与历史商机，并补充项目背景、客户目标、硬门槛、预算审批、IT 现状和使用规模，帮助 AE 判断客户处在什么商业阶段、项目为什么发生、哪些条件会决定成败。

## 触发条件

存在 `NewOpportunityObj`、历史商机记忆、需求调研、拜访记录、IT 系统信息、使用规模信息或用户提供的项目信息时执行。

## 输入来源

- CRM `NewOpportunityObj`。
- CRM 跟进记录中的商机阶段变化。
- CRM 跟进记录、会议纪要、需求调研中的项目起源、客户期望、硬门槛、预算审批和时间表。
- Memory 中的赢单、输单、搁置、重启记录。
- Memory 中的 IT 现状、现有系统满意度、集成约束、使用群体和组织范围。
- full 模式下的合同、订单和回款记录。

## 输出契约

```yaml
r05_opportunity_overview:
  project_background:
    origin:
    customer_goals:
      - goal:
        business_value:
        confidence: confirmed|inferred|unknown
    must_have_requirements:
      - requirement:
        impact:
        confidence: confirmed|inferred|unknown
    budget_and_approval:
      budget_range:
      approval_chain:
      decision_timeline:
      current_stage:
      confidence: confirmed|inferred|unknown
  it_landscape:
    systems:
      - name:
        purpose:
        satisfaction: high|medium|low|unknown
        key_issue:
        integration_relevance:
    opportunity_points:
      - point:
        reason:
        confidence: confirmed|inferred|unknown
  usage_scope:
    user_groups:
      - group:
        scale:
        core_need:
        priority: P0|P1|P2|unknown
        confidence: confirmed|inferred|unknown
  active_opportunities:
    - opportunity_id:
      name:
      stage:
      status:
      amount:
      probability:
      close_date:
      budget_status:
      next_milestone:
      main_blocker:
      confidence: confirmed|inferred|unknown
  historical_opportunities:
    - name:
      status:
      result:
      reason:
      lesson:
  expansion_signals:
    - signal:
      source:
      confidence: confirmed|inferred|unknown
  data_gaps:
    - gap
```

## 分析规则

- 优先呈现进行中商机，其次呈现会影响当前认知的赢单、输单、搁置商机。
- `probability` 是 AE 在 CRM 中录入的主观赢率，只能作为信号，不能当作预测结论。
- 商机金额、阶段、结单日期必须来自 CRM 或用户明示；缺失时写“未知”。
- 历史输单要记录原因和教训，不要包装成当前风险，除非同类模式仍在发生。
- 增购信号必须有证据类型：已购模块、未覆盖团队、新业务线、交付满意、CSM 反馈或客户明确表达。
- 商机判断保留置信度，不把 AE 主观赢率写成预测结论。
- 项目背景要回答“为什么现在启动、客户希望改变什么、哪些条件必须满足、谁审批、什么时间要决策”。
- 必选条件必须来自客户明确表达、招采要求、会议纪要、CRM 备注或用户输入；不允许把我方产品卖点写成客户硬门槛。
- IT 现状重点写系统用途、满意度、关键限制、集成关系和可切入机会；不要扩展成泛泛的数字化诊断。
- 使用规模要按群体拆分，优先说明销售、渠道/代理、管理层、业务部门、海外/区域团队等实际使用对象。
- P0/P1/P2 在标准版中只用于“使用规模优先级”，不要写成见客前行动优先级。

## Markdown 输出

```markdown
## 5. 💼 项目背景与商机全貌

### 项目背景与目标
| 维度 | 内容 | 置信度 |
| --- | --- | --- |
| 项目起源 |  | 确认/推断/未知 |
| 客户期望 |  |  |
| 必选条件 |  |  |
| 预算范围 |  |  |
| 审批链路 |  |  |
| 当前阶段 |  |  |
| 决策时间表 |  |  |

### IT 现状
| 系统 | 用途 | 满意度 | 关键信息 | 对本项目影响 |
| --- | --- | --- | --- | --- |
|  |  | 高/中/低/未知 |  |  |

**机会点：**
- {从现有系统痛点、集成约束或替换意愿中提炼的机会点}

### 使用规模
| 部门/群体 | 规模 | 核心诉求 | 优先级 | 置信度 |
| --- | --- | --- | --- | --- |
|  |  |  | P0/P1/P2/未知 | 确认/推断/未知 |

### 当前商机
| 商机 | 阶段 | 状态 | 金额 | 赢率 | 预计结单 | 预算 | 主要阻塞 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |

### 历史商机
| 商机 | 结果 | 原因 | 对当前的启示 |
| --- | --- | --- | --- |
|  | 赢单/输单/搁置/无效 |  |  |

### 增购或重启信号
- {信号，证据类型，置信度}

### 商机缺口
- {缺失的阶段、预算、决策或竞品信息}
```
