# R01 陪访背景

## 目标

先确认这次为什么需要领导出面、谁申请、谁陪访、客户侧谁参会、会议处于什么商机节点，以及当前信息是否足以支撑领导判断。该规则决定整份高层陪访简报的可信度和紧急程度。

## 触发条件

用户请求高层陪访、领导汇报、客户高层会面或关键商机升级时，始终执行。

## 输入来源

- 用户输入的申请人、拟陪访领导、客户参会人、会议时间、陪访原因。
- CRM `AccountObj`、`NewOpportunityObj`、`ScheduleObj`。
- CRM `ActiveRecordObj.active_record_content` 中的高层汇报、客户邀约、会议背景。
- Memory 中的高层关系、历史升级、领导曾介入记录、客户敏感点。
- `references/cli_reference.md` 和 `references/crm_schema.md`。

## 输出契约

```yaml
r01_visit_context:
  customer:
    account_id:
    name:
    industry:
    deal_status:
  visit_request:
    requester:
    executive_visitor:
    executive_role:
    customer_executives:
      - name:
        title:
        expected_role:
    visit_time:
    visit_format: onsite|online|phone|unknown
    request_reason:
    meeting_stage:
  context_status:
    memory_status: complete|partial|insufficient
    crm_status: complete|partial|insufficient
    urgency: high|medium|low|unknown
    should_executive_attend: recommend|cautious|not_recommend|insufficient
    reason:
  confirmation_needed:
    - question:
      why_it_matters:
      suggested_owner: ae|sales_manager|executive|csm|se|customer|unknown
  confidence: confirmed|inferred|unknown
```

## 判断规则

- 陪访原因必须来自用户、CRM 会议/商机记录、Memory 或客户明确邀约，不要臆测。
- 没有申请人、拟陪访领导或客户参会高层时，不阻塞生成，但必须写入“陪访缺口”。
- 只要存在客户高层参会、预计结单 30 天内、竞品深度评估、预算审批卡点、交付/回款/投诉风险，陪访紧急度至少为 `medium`。
- 如果客户只需要产品细节、报价细节或实施排期，结论应偏向“暂不建议领导直接出面”。
- Memory 为空或只有零散 CRM 字段时，`memory_status=insufficient`，并在摘要中提示“需 AE 补充高层关系和历史敏感点”。
- 不输出见客前“今日目标”、`P0/P1/P2` 或“就绪度”；只写陪访背景和待确认项。

## Markdown 输出

```markdown
## 1. 陪访背景

### 陪访请求
| 字段 | 内容 | 置信度 |
| --- | --- | --- |
| 申请人 |  | 确认/推断/未知 |
| 拟陪访领导 |  | 确认/推断/未知 |
| 客户参会高层 |  | 确认/推断/未知 |
| 陪访时间/形式 | 现场/线上/电话/未知 |  |
| 陪访原因 |  |  |
| 当前商机节点 |  |  |
| Memory 状态 | 完整/部分/不足 |  |

### 是否建议领导出面
| 判断 | 理由 | 紧急度 |
| --- | --- | --- |
| 建议/谨慎建议/暂不建议/信息不足 |  | 高/中/低/未知 |

### 陪访缺口
| 缺口 | 影响 | 建议补齐人 |
| --- | --- | --- |
|  |  | AE/销售经理/拟陪访领导/CSM/售前/客户 |
```
