# R03 客户高层与关键人地图

## 目标

整理客户侧高层、决策链、Coach、Gatekeeper 和关键影响人，帮助领导知道“我会见谁、谁真正有权、谁支持我们、谁可能阻碍、哪些关系有历史包袱”。

## 触发条件

存在 CRM 联系人、会议参与人、Memory 关系卡、跟进记录或用户描述的客户关键人信息时执行。没有关键人信息时，输出“关键人信息不足”，并列出陪访前必须确认的问题。

## 输入来源

- CRM `ContactObj`。
- CRM `ActiveRecordObj.active_record_content` 中的参会人、客户原话、角色描述和态度。
- CRM `NewOpportunityObj.approval_flow`、合同签署人、客户健康/投诉记录中的人员信息。
- Memory 中的高层关系、关键人关系卡、关系温度变化、历史敏感点。
- 用户补充的 AE 口头交代。

## 角色定义

| 角色 | 定义 | 高层陪访关注 |
| --- | --- | --- |
| customer_executive | 客户参会高层，如 CEO、董事长、CFO、CIO、业务 VP |
| EB | 预算/最终拍板人，关注 ROI、风险、组织价值 |
| TB | 技术/安全/集成评估人 |
| UX | 一线使用或业务体验负责人 |
| Coach | 内部支持者，愿意提供信息或推动内部决策 |
| Gatekeeper | 控制节奏、采购、流程、材料或高层入口的人 |
| Influencer | 无最终决策权但能影响判断的人 |

## 输出契约

```yaml
r03_executive_stakeholder_map:
  stakeholders:
    - name:
      title:
      role: customer_executive|EB|TB|UX|Coach|Gatekeeper|Influencer|unknown
      relationship_temperature: strong_support|support|neutral|risk|blocker|unknown
      evidence:
      leader_meeting_relevance:
      communication_advice:
      do_not:
      confidence: confirmed|inferred|unknown
  executive_meeting_targets:
    - name:
      title:
      why_this_person_matters:
      recommended_leader_posture:
      topics_to_cover:
      topics_to_avoid:
  internal_politics:
    - issue:
      evidence:
      implication_for_leader:
  data_gaps:
    - gap
```

## 判断规则

- `ContactObj.primary_contact` 只能作为主联系人，不等于 EB 或客户高层。
- 角色判断必须结合职位、行为和历史记录，不能只凭职位脑补。
- Coach 必须有支持行为证据，如安排会议、提供内部信息、推动预算、反馈竞品动态。
- Gatekeeper 必须有阻碍或节奏控制证据，如反复要求材料、卡审批、拖延会议、限制高层入口。
- 客户内部政治必须有 Memory、CRM 或用户明确输入支撑。
- 领导必看人物不超过 3 个，完整关键人不超过 5 个。
- 每个客户高层都要给“建议领导姿态”：业务共创、关系稳定、决策探测、公司背书、竞争破局等。

## Markdown 输出

```markdown
## 3. 客户高层与关键人

### 领导必看人物
| 姓名 | 职位 | 角色 | 关系温度 | 为什么重要 | 建议领导姿态 | 置信度 |
| --- | --- | --- | --- | --- | --- | --- |
|  |  | 客户高层/EB/TB/UX/Coach/Gatekeeper/Influencer | 强支持/支持/中立/风险/阻碍/未知 |  |  | 确认/推断/未知 |

### 完整关键人地图
| 姓名 | 职位 | 角色 | 证据 | 沟通建议 | 不要做 |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

### 客户内部关系与敏感点
- {内部政治、汇报关系、历史冲突、绕人风险、客户高层态度变化等}

### 关键人缺口
- {缺少客户参会高层、EB、预算审批人、Coach、Gatekeeper 或客户高层态度证据等信息}
```
