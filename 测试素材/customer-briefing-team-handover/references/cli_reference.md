# CLI 调用规范

## 使用场景

当团队交接简报需要从纷享销客 CRM 拉取客户、商机、联系人、销售记录、竞品明细、合同、订单、回款、CSM 预警、流失原因或内部负责人信息时，读取本文件并按企业 CLI 规范查询。

## 查询原则

- 先查询 `AccountObj`，拿到客户 `_id`，再查询关联对象。
- 用户未指定时间范围时，不主动添加时间过滤条件。
- 查询不到客户时，先让用户确认客户名称。
- 查到多个客户时，先让用户选择目标客户。
- 交接场景必须同时检查 Memory；CRM 只能补事实，不能替代原 AE 的历史交代。
- 查询结果不足时，写入“交接缺口”，不要编造 CRM 数据。

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

## 标准交接默认查询

| 对象 | 查询字段 | 交接用途 |
| --- | --- | --- |
| `NewOpportunityObj` | `_id,name,sales_stage,amount,probability,close_date,sales_status` | 当前商机、历史商机、阶段、金额、赢率、预计结单 |
| `ContactObj` | `_id,name,job_title,primary_contact` | 关键人、主联系人、接手联络顺序 |
| `ActiveRecordObj` | `interactive_scenario,interactive_types,active_record_content,create_time` | 最近互动、客户原话、承诺、情绪、参会人 |
| `CompetitiveLinesObj` | `_id,name,competitor_id,advantage,weaknesses,quotation_amount,is_win` | 历史竞品、当前竞品、报价、输赢结果 |

## full 模式扩展查询

`--full`、已成交客户、历史合作客户或用户要求历史/财务/客户健康时，再查询：

| 对象 | 查询字段 | 交接用途 |
| --- | --- | --- |
| `ContractObj` | `_id,name,contract_amount,started_time,expired_time,status` | 合同金额、合同周期、续约窗口、合同状态 |
| `SalesOrderObj` | `_id,name,order_amount,order_status,payment_amount,receivable_amount,field_y33wm__c,field_RMqlg__c` | 订单金额、订单状态、回款金额、应收金额、自定义业务字段 |
| `object_yFjSD__c` | `_id,name,field_yn287__c,field_cmSR1__c,field_w16tW__c,field_UP2co__c` | CSM 客户预警、客户健康、服务风险 |
| `object_d3V9S__c` | `_id,name,field_yjo3L__c,field_U4Bk7__c,field_dpebo__c,field_a20hA__c` | 流失原因、流失归因、竞品替换、自研替换 |

## 可选补充对象

仅在用户要求或主数据不足时查询：

| 对象 | 交接用途 |
| --- | --- |
| `ScheduleObj` | 已约会议、未来日程、接手人近期跟进安排 |
| `CheckinsObj` | 外勤拜访轨迹、现场拜访历史 |
| `PaymentObj` | 若环境中有独立回款对象，可补充回款流水 |
| `PersonnelObj` | 原 AE、接手 AE、CSM、售前、实施等内部负责人信息 |

## 交接使用规则

- `ActiveRecordObj.active_record_content` 是承诺、客户原话、关系变化和敏感点的重要来源。
- `ContactObj.primary_contact` 只能表示 CRM 主联系人，不等于 EB 或 Coach。
- `NewOpportunityObj.probability` 是 AE 主观赢率，只作为商机状态参考，不作为交接质量评分。
- `CompetitiveLinesObj.competitor_id` 非空时，说明竞品至少在场；有报价或 POC 记录时，应进入竞品历史。
- `object_yFjSD__c` 是客户健康风险，不等于客户已经流失。
- `object_d3V9S__c` 中出现“竞争”“自研”“替换”“服务不满”等原因时，必须进入交接风险。
- CRM 没有记录但 Memory 有明确事实时，可以写入交接简报，并标注来源为 Memory。
