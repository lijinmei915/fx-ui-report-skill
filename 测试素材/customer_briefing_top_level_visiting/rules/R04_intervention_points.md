# R04 领导可介入点

## 目标

把客户背景、商机价值和关键人地图转化成领导可以执行的介入动作，明确领导以什么身份出面、解决什么问题、预期产生什么效果，以及哪些边界不能越过。

## 触发条件

完成 R01-R03 后始终执行。若无法定义明确领导动作，必须输出“暂不建议领导直接出面”或“需补齐信息后再判断”，不能强行安排陪访。

## 输入来源

- R01 陪访背景：陪访原因、会议背景、紧急度、Memory 状态。
- R02 商机价值：金额、阶段、预算、审批链路、为什么现在要见。
- R03 客户高层与关键人：客户高层、Coach、Gatekeeper、关系温度、敏感点。
- CRM `ActiveRecordObj` 中的客户原话、承诺、反对意见、最近会议结论。
- Memory 中的历史升级、领导曾介入、客户高层关系、敏感点。
- `references/executive_visit_reference.md`。

## 介入角色

| 角色 | 适用场景 | 典型动作 |
| --- | --- | --- |
| company_sponsor | 客户担心公司实力、长期服务或资源保障 | 公司背书、长期合作承诺边界、资源机制说明 |
| business_partner | 客户高层关注业务结果、经营指标、组织管理 | 业务价值对齐、管理抓手讨论 |
| relationship_stabilizer | 历史承诺、交付、投诉或竞品冲击导致关系不稳 | 表达重视、修复机制、稳住关键人 |
| decision_probe | 预算、审批、采购路径不清晰 | 探测决策标准、预算归属、时间表 |
| competition_reframer | 竞品深度介入、报价压制或标准被竞品定义 | 重塑比较维度、强调长期价值 |
| internal_coordinator | 需要我方跨部门资源投入 | 说明资源投入和责任机制 |

## 输出契约

```yaml
r04_intervention_points:
  recommended_interventions:
    - intervention_id:
      leader_role: company_sponsor|business_partner|relationship_stabilizer|decision_probe|competition_reframer|internal_coordinator
      target_person:
      business_problem:
      leader_action:
      expected_effect:
      required_prework:
      follow_up_owner:
      boundary:
      confidence: confirmed|inferred|unknown
  not_recommended_actions:
    - action:
      why_not:
      safer_alternative:
  questions_for_leader_to_ask:
    - question:
      purpose:
      use_when:
  data_gaps:
    - gap
```

## 判断规则

- 每个介入点必须回答：领导为什么比 AE 更适合做这件事。
- 不把“催客户反馈”“推进预算”“讲产品功能”写成领导动作。
- 领导动作应落在背书、定调、破局、探测、稳关系、资源协调。
- 每个介入点必须有边界：不能现场承诺报价、折扣、交付日期、定制范围或超授权资源。
- 如果客户只是需要售前演示、报价解释或实施排期，建议由 AE/售前/CSM 处理，不建议领导出面。
- 介入点最多 3 个；超过 3 个说明没有聚焦，需要压缩。
- 所有领导动作必须有会后承接人。

## Markdown 输出

```markdown
## 4. 领导可介入点

### 推荐介入动作
| 介入点 | 领导角色 | 面向对象 | 要解决的问题 | 领导怎么做 | 预期效果 | 会后承接人 | 边界 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | 公司背书/业务共创/关系稳定/决策探测/竞争破局/内部协调 |  |  |  |  | AE/销售经理/CSM/售前/实施 |  |

### 不建议领导做的事
| 不建议动作 | 原因 | 更稳妥替代 |
| --- | --- | --- |
|  |  |  |

### 领导可问的问题
| 问题 | 目的 | 适用时机 |
| --- | --- | --- |
|  |  |  |

### 介入信息缺口
- {缺少领导角色、客户高层诉求、预算阻力、竞品状态、历史承诺、会后承接人等信息}
```
