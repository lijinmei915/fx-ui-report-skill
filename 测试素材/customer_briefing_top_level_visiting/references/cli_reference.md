# CLI 调用规范

## 使用场景

当高层陪访简报需要从纷享销客 CRM 拉取客户、商机、联系人、跟进动态、竞品明细、合同、订单、回款、CSM 预警、流失原因或内部负责人信息时，读取本文件并按企业 CLI 规范查询。

## 查询原则

- 先查询 `AccountObj`，拿到客户 `_id`，再查询关联对象。
- 用户未指定时间范围时，不主动添加时间过滤条件。
- 查询不到客户时，先让用户确认客户名称。
- 查到多个客户时，先让用户选择目标客户。
- 高层陪访场景必须同时检查 Memory；CRM 只能补事实，不能替代 AE 对高层关系、历史承诺和敏感点的判断。
- 查询结果不足时，写入“陪访缺口”，不要编造 CRM 数据。

## Step 1：查询客户

```bash
sharecrm data record query-by-name --name <客户名称> --object_api_names AccountObj
```

返回客户记录后，取 `_id` 作为后续 `<accountId>`。

## Step 2：查询关联对象

```bash
sharecrm data record query-by-fields \
  --object_api_name <objectApiName> \
  --select_fields <fields> \
  --account_id-eq <accountId> \
  --sort last_modified_time:desc \
  --limit 50
```

如果用户明确指定时间范围，再追加：

```bash
--last_modified_time-gte <startTime> --last_modified_time-lte <endTime>
```

时间格式：`yyyy-MM-dd HH:mm:ss`。

## 标准陪访默认查询

| 对象 | 查询字段 | 陪访用途 |
| --- | --- | --- |
| `NewOpportunityObj` | `_id,name,sales_stage,amount,probability,close_date,sales_status,budget_status,approval_flow,competitors,notes` | 商机价值、阶段、预算审批、竞争窗口、陪访理由 |
| `ContactObj` | `_id,name,job_title,primary_contact,mobile,email` | 客户高层、EB/TB/UX/Coach/Gatekeeper、领导会面对象 |
| `ActiveRecordObj` | `interactive_scenario,interactive_types,active_record_content,create_time` | 最近互动、客户原话、承诺、情绪、参会人、高层汇报记录 |
| `CompetitiveLinesObj` | `_id,name,competitor_id,advantage,weaknesses,quotation_amount,is_win` | 竞品在场、报价压力、历史输赢、领导需知道的竞争风险 |

## full 模式扩展查询

`--full`、已成交客户、续约/增购客户、高风险客户或用户要求历史/财务/客户健康时，再查询：

| 对象 | 查询字段 | 陪访用途 |
| --- | --- | --- |
| `ContractObj` | `_id,name,contract_amount,started_time,expired_time,status` | 历史合同、续约窗口、合同状态、领导是否需要稳关系 |
| `SalesOrderObj` | `_id,name,order_amount,order_status,payment_amount,receivable_amount,field_y33wm__c,field_RMqlg__c` | 历史订单、回款、应收、财务风险 |
| `object_yFjSD__c` | `_id,name,field_yn287__c,field_cmSR1__c,field_w16tW__c,field_UP2co__c` | CSM 客户预警、客户健康、服务/交付隐患 |
| `object_d3V9S__c` | `_id,name,field_yjo3L__c,field_U4Bk7__c,field_dpebo__c,field_a20hA__c` | 流失原因、竞品替换、自研替换、服务不满 |

## 可选补充对象

仅在用户要求或主数据不足时查询：

| 对象 | 陪访用途 |
| --- | --- |
| `ScheduleObj` | 已约高层会议、未来日程、领导陪访安排 |
| `CheckinsObj` | 现场拜访历史、客户现场经营频率 |
| `PaymentObj` | 若环境中有独立回款对象，可补充回款流水 |
| `PersonnelObj` | AE、销售经理、陪访领导、CSM、售前、实施等内部负责人信息 |

## 陪访使用规则

- `ActiveRecordObj.active_record_content` 是客户原话、高层态度、历史承诺、敏感点的重要来源。
- `ContactObj.primary_contact` 只能表示 CRM 主联系人，不等于 EB 或客户高层。
- `NewOpportunityObj.probability` 是 AE 主观赢率，只作为商机状态参考，不作为领导是否陪访的唯一依据。
- `CompetitiveLinesObj.competitor_id` 非空时，说明竞品至少在场；有报价、POC、招投标或输赢记录时，必须进入风险提示。
- `object_yFjSD__c` 是客户健康风险，不等于客户已经流失，但领导陪访前必须知道。
- `object_d3V9S__c` 中出现“竞争”“自研”“替换”“服务不满”等原因时，必须进入陪访风险。
- CRM 没有记录但 Memory 有明确事实时，可以写入陪访简报，并标注来源为 Memory。
