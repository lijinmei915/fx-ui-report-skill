# R06 陪访目标

## 目标

把领导可介入点和风险边界转化成 1-3 个清晰的陪访目标，并明确领导的建议话术方向、成功标准和会后承接动作。

## 触发条件

完成 R01-R05 后始终执行。若无法定义明确目标，应输出“信息不足，暂不建议领导直接出面”，并列出需要补齐的信息。

## 输入来源

- R01 陪访背景。
- R02 商机价值。
- R03 客户高层与关键人地图。
- R04 领导可介入点。
- R05 风险与敏感点。
- Memory 中的高层关系、历史升级、承诺边界、会后承接记录。
- `references/executive_visit_reference.md`。

## 目标类型

| 类型 | 说明 |
| --- | --- |
| align_value | 对齐客户高层业务价值和衡量标准 |
| stabilize_relationship | 稳定关系、修复历史承诺或服务争议 |
| probe_decision | 探测预算、审批、决策标准和时间表 |
| reframe_competition | 重塑竞品比较维度和长期价值 |
| sponsor_resources | 公司背书、资源投入、长期服务机制 |
| open_executive_channel | 建立双方高层沟通机制 |
| defer_visit | 信息不足或不适合领导出面 |

## 输出契约

```yaml
r06_visit_objectives:
  objectives:
    - objective_id:
      type: align_value|stabilize_relationship|probe_decision|reframe_competition|sponsor_resources|open_executive_channel|defer_visit
      objective:
      executive_posture:
      target_person:
      suggested_talking_direction:
      success_signal:
      avoid:
      ae_follow_up:
      owner:
      confidence: confirmed|inferred|unknown
  meeting_sequence:
    - step:
      purpose:
      speaker: executive|ae|sales_manager|se|csm|customer|unknown
  pre_visit_checklist:
    - item:
      owner:
      deadline:
  data_gaps:
    - gap
```

## 判断规则

- 陪访目标最多 3 个；超过 3 个说明没有聚焦。
- 目标必须写成“领导以什么身份做什么”，不能写成“协助推进项目”。
- 每个目标必须有成功信号，例如客户确认预算路径、明确 POC 成功标准、同意高层机制、承认竞品比较标准。
- 每个目标必须有会后承接人，通常是 AE、销售经理、CSM、售前或实施。
- 若领导动作无法区别于 AE 动作，应建议不让领导出面。
- 目标顺序应按会议逻辑排列：先关系/价值，再探测/破局，最后资源/承接。
- 不写“今天必须做”“P0/P1/P2”等 AE 自用语言。

## Markdown 输出

```markdown
## 6. 陪访目标

### 本次陪访目标（1-3 个）
| 目标 | 领导姿态 | 面向对象 | 建议表达方向 | 成功信号 | 不要做 | 会后承接 |
| --- | --- | --- | --- | --- | --- | --- |
|  | 公司背书/业务共创/关系稳定/决策探测/竞争破局/内部协调 |  |  |  |  | AE/销售经理/CSM/售前/实施 |

### 建议会议顺序
| 顺序 | 环节 | 目的 | 建议发言人 |
| --- | --- | --- | --- |
| 1 |  |  | 领导/AE/销售经理/售前/CSM/客户 |

### 陪访前检查清单
| 事项 | 负责人 | 截止时间 |
| --- | --- | --- |
|  | AE/销售经理/拟陪访领导/CSM/售前/财务 |  |

### 目标缺口
- {缺少领导角色、客户高层诉求、预算状态、竞品阶段、会后承接人或会议议程等信息}
```
