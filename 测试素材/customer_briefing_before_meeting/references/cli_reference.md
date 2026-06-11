# CLI 调用规范

## 使用场景

当本技能需要从 CRM 拉取客户、商机、联系人、销售记录、合同、订单、回款、CSM 预警、流失原因或竞品明细时，读取本文件并按企业 CLI 规范查询。

## 查询原则

- 先查询客户 `AccountObj`，拿到客户记录 `_id`。
- 再使用客户 `_id` 查询关联对象。
- 用户未指定时间范围时，不主动添加时间过滤条件。
- 查询不到客户时，先让用户确认客户名称。
- 查到多个客户时，先让用户选择目标客户。
- 查询结果不足时，明确写入缺失字段，不要编造 CRM 数据。

## Step 1：查询客户

使用 `query-by-name` 查询客户：

```bash
sharecrm data record query-by-name --name <客户名称> --object_api_names AccountObj
```

返回客户记录后，取 `_id` 作为后续 `<accountId>`。

## Step 2：查询关联 CRM 数据

对每个关联对象分别执行 `query-by-fields`：

```bash
sharecrm data record query-by-fields \
  --object_api_name <objectApiName> \
  --select_fields <fields> \
  --account_id-eq <accountId> \
  --sort last_modified_time:desc \
  --limit 50
```

如用户明确指定时间范围，再追加：

```bash
--last_modified_time-gte <startTime> --last_modified_time-lte <endTime>
```

时间格式：`yyyy-MM-dd HH:mm:ss`。

## 时间与人员解析

- `currentDateTime` 用于解析“今天”“本周”“最近三个月”等相对时间。
- `currentEmployeeName` 用于解析“我”“我负责的”“分配给我的”等当前人员语义。
- 用户显式提供具体时间或具体人员时，以用户输入为准。

## 默认数据源

normal 模式默认查询：

| 对象 | 查询字段 | 用途 |
| --- | --- | --- |
| `NewOpportunityObj` | `_id,name,sales_stage,amount,probability,close_date,sales_status` | 当前商机、阶段、金额、赢率、结单日期 |
| `ContactObj` | `_id,name,job_title,primary_contact` | 联系人和关键决策人 |
| `ActiveRecordObj` | `interactive_scenario,interactive_types,active_record_content,create_time` | 最近互动记录、结论、情绪、承诺 |
| `CompetitiveLinesObj` | `_id,name,competitor_id,advantage,weaknesses,quotation_amount,is_win` | 竞品明细、报价、优劣势 |

full 模式或用户要求历史/财务/风险分析时再查询：

| 对象 | 查询字段 | 用途 |
| --- | --- | --- |
| `ContractObj` | `_id,name,contract_amount,started_time,expired_time,status` | 合同签约历史 |
| `SalesOrderObj` | `_id,name,order_amount,order_status,payment_amount,receivable_amount,field_y33wm__c,field_RMqlg__c` | 订单与回款情况 |
| `object_yFjSD__c` | `_id,name,field_yn287__c,field_cmSR1__c,field_w16tW__c,field_UP2co__c` | CSM 客户预警 |
| `object_d3V9S__c` | `_id,name,field_yjo3L__c,field_U4Bk7__c,field_dpebo__c,field_a20hA__c` | 客户流失原因 |

## 对见客就绪度的影响

- `ContractObj` / `SalesOrderObj`：补充 L1 营收/签约金额，补充 L5 财务信号。
- `object_yFjSD__c`：CSM 预警可补充 L4 业务痛点和 L5 战略/健康信号。
- `object_d3V9S__c`：流失原因可补充 L4 业务痛点和 L5 战略/健康信号。
- `CompetitiveLinesObj`：直接补充竞品渗透阶段、差异化、关系对比和准备度。

## 竞品风险补充规则

- `CompetitiveLinesObj.competitor_id` 非空时，竞品阶段至少为 C2。
- `CompetitiveLinesObj.quotation_amount` 非空时，表示已知竞品报价，可计入竞争准备度。
- `object_d3V9S__c.field_U4Bk7__c` 含“竞争”“自研”等流失原因时，竞品阶段至少为 C2。
- `object_yFjSD__c` 显示客户健康度持续下降时，应作为潜在风险写入预警，但不能直接推断有竞品。
