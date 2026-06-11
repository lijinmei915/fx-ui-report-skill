# CLI 调用规范

## 使用场景

当客户360档案需要从纷享销客 CRM 拉取客户、联系人、商机、销售记录、竞品明细、合同、订单、回款、客户健康预警或流失原因时，读取本文件并按企业 CLI 规范执行查询。

## 查询原则

- 先查 `AccountObj`，拿到客户 `_id`，再查询关联对象。
- 用户未指定时间范围时，不主动添加时间过滤条件。
- 查询不到客户时，先让用户确认客户名称。
- 查到多个客户时，先让用户选择目标客户。
- 查询结果不足时，写入“信息缺口”，不要编造 CRM 数据。
- 相对时间按 `currentDateTime` 解析；“我”“我负责的”按 `currentEmployeeName` 解析。

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

## 标准模式默认查询

| 对象 | 查询字段 | 用途 |
| --- | --- | --- |
| `NewOpportunityObj` | `_id,name,sales_stage,amount,probability,close_date,sales_status` | 当前商机、历史商机、阶段、金额、赢率、预计结单 |
| `ContactObj` | `_id,name,job_title,primary_contact` | 联系人、关键联系人、决策链候选 |
| `ActiveRecordObj` | `interactive_scenario,interactive_types,active_record_content,create_time` | 跟进记录、客户原话、关系变化、痛点证据 |
| `CompetitiveLinesObj` | `_id,name,competitor_id,advantage,weaknesses,quotation_amount,is_win` | 竞品在场状态、报价、优劣势、输赢结果 |

## full 模式扩展查询

`--full`、历史客户、已成交客户或用户要求历史/财务/客户健康时，再查询：

| 对象 | 查询字段 | 用途 |
| --- | --- | --- |
| `ContractObj` | `_id,name,contract_amount,started_time,expired_time,status` | 合同金额、合同周期、续约窗口、合同状态 |
| `SalesOrderObj` | `_id,name,order_amount,order_status,payment_amount,receivable_amount,field_y33wm__c,field_RMqlg__c` | 订单金额、订单状态、回款金额、应收金额、自定义业务字段 |
| `object_yFjSD__c` | `_id,name,field_yn287__c,field_cmSR1__c,field_w16tW__c,field_UP2co__c` | CSM 客户预警、客户健康、服务风险 |
| `object_d3V9S__c` | `_id,name,field_yjo3L__c,field_U4Bk7__c,field_dpebo__c,field_a20hA__c` | 流失原因、流失归因、流失阶段 |

## 可选补充对象

仅在用户要求或主数据不足时查询：

| 对象 | 用途 |
| --- | --- |
| `ScheduleObj` | 日程、会议安排、计划拜访 |
| `CheckinsObj` | 外勤拜访、签到、现场拜访轨迹 |
| `PaymentObj` | 若环境中有独立回款对象，可用于补充订单回款 |
| `PersonnelObj` | AE、CSM、售前、实施等内部负责人信息 |

## 查询结果使用规则

- `ActiveRecordObj.active_record_content` 是痛点、承诺、关系温度和竞品线索的高价值来源。
- `ContactObj.primary_contact` 只能表示 CRM 主联系人，不等于 EB；EB 必须由职位、审批链或互动证据确认。
- `NewOpportunityObj.probability` 是 AE 主观赢率，只作为商机信号，不作为结果预测。
- `CompetitiveLinesObj.competitor_id` 非空时，竞品阶段至少为 C2“在场”。
- `CompetitiveLinesObj.quotation_amount` 非空时，说明已知竞品报价，可写入竞品全貌。
- CSM 预警是客户健康风险，不等于已流失。
- 流失原因中出现“竞争”“自研”“替换”等描述时，竞品阶段至少为 C2；若已有签约替换记录，可判断为 C4。
