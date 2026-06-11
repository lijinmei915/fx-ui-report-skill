# CRM CLI 查询参考

本文件用于个人销售日报、周报、月报的数据查询。只有在当前环境提供 `sharecrm` CLI，且用户请求需要查询 CRM 数据时才读取本文件。

## 基本原则

- 先查 CRM 事实，再生成报表。
- 先解析销售人员与时间范围，再执行数据查询。
- 首次查询任何对象前，必须先查询对象字段；字段未确认时不要猜字段名。
- 用户显式指定销售人员、日期、周次或月份时，以用户输入为准。
- 用户使用“我、我的客户、我负责的商机”等表达时，使用 `currentEmployeeName` 解析当前人员。
- 用户使用“今天、昨天、本周、上周、本月、上月、最近 N 天”等表达时，使用 `currentDateTime` 解析时间范围。周报必须使用 ISO 自然周：`本周 = currentDateTime 所在周的周一至周日`，`上周 = 本周周一 - 7 天 至 本周周一 - 1 天`；不要把“上周”当成最近 7 天。
- CRM 查询和内部 payload 可以使用对象 ApiName 与记录 ID；用户可见的 CRM 数据汇总、数据说明和保存结果必须使用中文对象名称，并隐藏记录 ID、`_id` 和长串主键。
- 只使用本文件列出的读取命令：`describe get`、`query-by-name`、`query-by-fields`。不要尝试企业规范未记录的快捷命令或销售专用命令。

## 标准查询流程

```text
Step 1 - 解析销售人员、报告周期和时间范围。
Step 2 - 确定需要查询的对象；包括用户选择的自定义对象。
Step 3 - 对每个对象先执行 describe get，确认可用字段、时间字段、人员字段和关联字段。
Step 4 - 必要时用 query-by-name 查询人员、客户、线索等主记录。
Step 5 - 用 query-by-fields 查询日志、销售记录、日程、外勤、商机、订单、回款等事实数据。
Step 6 - 聚合客户、商机、跟进、订单、回款和上期承诺。
Step 7 - 结合 rules/ 生成个人日报、周报或月报。
Step 8 - 用户确认后，按可用 CRM 创建能力写入日志。
```

推荐查询顺序：

1. 日志：先查询历史日志，用于上期承诺、昨日/上周/上月计划和复盘。
2. 活动：查询销售记录、日程、外勤，拿到本期真实动作和客户反馈。
3. 商机：查询阶段、金额、赢率、状态、预计关闭时间。
4. 结果：查询订单和回款。
5. 补充：客户、线索、联系人只在需要名称、状态或补充上下文时查询。
6. 自定义对象：用户指定后先 describe，再按已确认字段查询；不要把自定义对象当作已知标准对象处理。

人员范围和数据覆盖的细则见 `rules/R08_person_scope_and_coverage.md`。周期与指标口径见 `references/report_periods.md`。

个人日报、周报、月报保存到 CRM 日志对象的确认流程见 `rules/R09_journal_storage_confirmation.md`，字段映射见 `references/journal_object_reference.md`。

## 字段确认

每个对象在本轮请求中首次查询前，先执行：

```bash
sharecrm data describe get --object_api_name <ObjectApiName> --simple_describe true
```

执行后只使用返回中确认存在的字段：

- 时间过滤字段：如 `create_time`、`payment_time`、`new_stat_date`、`journal_time`，以 describe 返回为准。
- 人员过滤字段：不要默认存在 `owner`、`owner_id`、`created_by` 或销售姓名字段；只有 describe 确认后才可作为过滤条件。
- 团队/部门字段：个人报表一般不主动使用；如用户指定部门或团队，同样必须先 describe。
- 关联字段：如客户、商机、联系人字段，必须以 describe 返回的字段为准。
- 选择字段：`--select_fields` 只能包含已确认字段；字段不确定时先删掉该字段或追问，不要硬填。

同一对象本轮已经 describe 过，可以复用已确认字段，不要反复 describe。

## 用户可见对象名称

查询和写入时可以使用 ApiName；对用户输出 CRM 数据汇总时必须改成中文对象名。

| 内部对象 ApiName | 用户可见名称 |
|------------------|--------------|
| `JournalObj` | 日志 |
| `ActiveRecordObj` | 销售记录 |
| `ScheduleObj` | 日程 |
| `CheckinsObj` | 外勤 |
| `NewOpportunityObj` | 商机 |
| `SalesOrderObj` | 订单 |
| `PaymentObj` | 回款 |
| `AccountObj` | 客户 |
| `LeadsObj` | 线索 |
| `ContactObj` | 联系人 |
| `PersonnelObj` | 人员 |

推荐输出：

```text
CRM 数据汇总：
- 日志：找到昨日的个人日志，其中包含昨日工作总结、复盘和今日行动计划。
- 销售记录：昨日共 8 条记录，其中 6 条与客户沟通相关，2 条为待确认记录。
```

禁止输出：

```text
- 用对象 ApiName、记录 ID 或长串主键描述日志、销售记录、商机、订单、回款。
```

除非用户明确要求定位底层记录，不要展示记录 ID、`_id`、数据 ID 或长串主键。

## 常用命令

### 查询对象字段

```bash
sharecrm data describe get --object_api_name <ObjectApiName> --simple_describe true
```

### 按名称查询记录

用于查询客户、人员、线索等主记录。

```bash
sharecrm data record query-by-name --name <名称> --object_api_names <ObjectApiName>
```

示例：

```bash
sharecrm data record query-by-name --name <客户名称> --object_api_names AccountObj
sharecrm data record query-by-name --name <销售姓名> --object_api_names PersonnelObj
```

如果没有查到记录，必须向用户确认名称或要求补充数据。

### 按字段查询记录

用于按已确认字段查询明细数据。固定使用扁平参数，不使用 `--data` JSON，也不要混用 JSON 和扁平参数。

```bash
sharecrm data record query-by-fields \
  --object_api_name <ObjectApiName> \
  --select_fields <confirmed_fields> \
  --<confirmed_field>-eq <value> \
  --<confirmed_time_field>-gte "<startTime>" \
  --<confirmed_time_field>-lte "<endTime>" \
  --sort <confirmed_time_field>:desc \
  --limit 50
```

参数要求：

| 参数 | 要求 |
|------|------|
| `ObjectApiName` | 已确认对象 ApiName，例如 `NewOpportunityObj` |
| `confirmed_fields` | describe 返回中确认存在的字段，用英文逗号分隔 |
| `<confirmed_field>-eq` | 只使用已确认字段，例如 describe 确认存在 `account_id` 后才能使用 `--account_id-eq` |
| `<confirmed_time_field>-gte/lte` | 时间字段必须来自 describe，格式 `yyyy-MM-dd HH:mm:ss` |
| `sort` | 排序字段必须来自 describe，通常使用时间字段倒序 |
| `limit` | 返回数量上限，默认 50；需要更多时分批或说明覆盖限制 |

禁止写法：

- 不使用 `sharecrm sales ...` 这类企业规范未记录的快捷命令。
- 不使用 `--data` JSON 参数查询记录。
- 不混用 JSON payload 和 `--<field>-<operator>` 扁平参数。
- 不使用未经过 describe 确认的负责人、客户、金额、阶段字段。

## 人员过滤

个人报表需要尽量限定到当前销售人员，但不要猜负责人字段。

处理顺序：

1. 使用 `currentEmployeeName` 或用户指定姓名确认销售姓名。
2. 如需要人员 CRM 记录，先 describe `PersonnelObj`，再用 `query-by-name` 查人员。
3. 查询业务对象前，先 describe 该对象，确认是否存在可用于人员过滤的字段。
4. 只有字段确认后，才可使用人员过滤条件。
5. 如果对象没有明确人员字段，先按时间和对象查询，再在结果中基于已返回的人员/创建人/负责人文本谨慎筛选，并在数据说明中写明限制。

不要默认所有对象都支持 `owner`、`owner_id` 或人员 ID 过滤。

## 目标、任务与口径缺失处理

个人目标来源优先级：

1. CRM 中明确的目标/配额对象或字段。
2. 用户提供的个人目标。
3. 日志历史中有明确来源的目标。
4. 本地 `memory/` 中有明确来源的目标，仅在 CRM/日志不可用时兜底参考。

如果没有目标数据，不计算目标完成率，只输出成交、回款、Pipeline 等事实指标，并在指标模块内说明“目标数据缺失”。

任务/P0/逾期数据来源优先级：

1. CRM 中明确的任务对象或字段。
2. 日程。
3. 销售记录中可识别的承诺事项。
4. 上期日志中的下期工作计划。
5. 用户输入。
6. 本地 `memory/`，仅在 CRM/日志不可用时兜底参考。

如果没有明确任务对象，不要声称已查询 CRM 任务；应说明“任务数据来自日程、销售记录、日志或用户输入推断”。

## 个人日报查询建议

日报优先查询当天实际动作和当天结果。

| 对象 | ApiName | 建议字段 | 用途 |
|------|---------|----------|------|
| 日志 | `JournalObj` | 先 describe；常见可读字段包括 `work_summary, work_experience, work_plan, journal_time, record_type` | 最近个人日志和承诺延续 |
| 销售记录 | `ActiveRecordObj` | `account_id, new_opportunity_id, interactive_scenario, interactive_types, active_record_content, create_time` | 当日跟进记录和沟通结论 |
| 日程 | `ScheduleObj` | `participants, content, begin_time, end_time, related_object_data` | 当日会议、拜访和后续动作 |
| 外勤 | `CheckinsObj` | `owner, customer_id, communicate_record, new_stat_date, checkins_scene` | 当日外勤拜访和沟通记录 |
| 商机 | `NewOpportunityObj` | `account_id, name, sales_stage, amount, probability, probability_amount, sales_status, close_date` | 当日商机阶段、金额或赢率变化 |
| 订单 | `SalesOrderObj` | `account_id, name, create_time, order_amount` | 当日成交订单 |
| 回款 | `PaymentObj` | `account_id, name, create_time, payment_time, amount` | 当日回款 |

上表是字段候选，不是免 describe 清单；实际查询必须以 describe 返回为准。

## 个人周报查询建议

周报优先查询本周承诺兑现、客户跟进和商机变化。

| 对象 | ApiName | 用途 |
|------|---------|------|
| 日志 | `JournalObj` | 上周日志、本周已生成日志、上期工作计划 |
| 销售记录 | `ActiveRecordObj` | 本周跟进记录、沟通结论、假推进证据 |
| 日程/外勤 | `ScheduleObj` / `CheckinsObj` | 本周拜访会议、下周已安排事项 |
| 商机 | `NewOpportunityObj` | 本周 Pipeline、阶段变化、赢单、输单、无效 |
| 订单 | `SalesOrderObj` | 本周成交 |
| 回款 | `PaymentObj` | 本周回款 |
| 客户/线索/联系人 | `AccountObj` / `LeadsObj` / `ContactObj` | 仅在需要补充名称、状态、来源或联系人信息时查询 |

## 个人月报查询建议

月报优先查询目标完成、Pipeline 质量和关键客户趋势。

| 对象 | ApiName | 用途 |
|------|---------|------|
| 日志 | `JournalObj` | 上月日志、月内日志、历史复盘和下期计划 |
| 商机 | `NewOpportunityObj` | 月初/月末 Pipeline、赢单、输单、无效商机 |
| 订单 | `SalesOrderObj` | 月度成交订单和成交金额 |
| 回款 | `PaymentObj` | 月度回款 |
| 销售记录 | `ActiveRecordObj` | 重点客户互动、风险证据、客户态度变化 |
| 客户/线索/联系人 | `AccountObj` / `LeadsObj` / `ContactObj` | 月度新增、成交状态、联系人上下文补充 |

## 日志历史查询建议

生成报表前，优先查询日志作为个人历史来源：

| 报告 | 建议查询 |
|------|----------|
| 日报 | 查询该销售最近一条日志，或当天已有日志 |
| 周报 | 查询上周日志、本周已生成日志 |
| 月报 | 查询上月日志、月内日志 |

查询日志时也必须先 describe。只有字段确认存在时，才使用 `record_type`、`journal_time`、人员字段或名称字段过滤。

如果日志不可用，说明无法读取历史日志；不要自动退回为已读取本地 memory，除非本地 memory 明确存在且用户允许参考。

## 查询失败处理

遇到以下情况时，不要继续换命令乱试：

- CLI 不存在或不可执行。
- 没有 CRM 权限。
- describe 失败或字段名不确定。
- 一次按已确认字段构造的 query-by-fields 查询失败。
- 查询返回空。
- 用户名称、客户名称或时间范围不明确。
- CRM 数据与用户自述冲突。

处理方式：

```text
当前无法完整查询 CRM 数据，原因是：[原因]。
请补充：[需要用户补充的数据]。
以下内容将基于已获得数据生成；受影响的判断会在对应模块内简短说明。
```

如果是字段或命令问题，说明“已按对象字段查询，但当前 CLI/字段不支持该条件”，然后追问或基于已获得数据继续生成；查询数据时不要继续尝试 `sharecrm sales ...`、`--data`、`owner_id` 等未确认写法。`--data` 只允许用于下方日志创建命令。

## 日志写入处理

需要保存个人日报、周报或月报到 CRM 日志对象时：

1. 先按 `rules/R09_journal_storage_confirmation.md` 展示中文待写入预览并询问用户。
2. 用户明确确认后，优先使用 `Sharecrm data record create --data '<JSON>'` 写入日志。
3. 如果没有可用写入能力、CLI 不支持创建记录、无权限或写入失败，不要编造命令或成功状态。
4. 写入失败或能力不可用时，只输出包含唯一写入范式字段的 payload，便于用户人工处理或稍后重试。

创建命令路径固定为：

```bash
Sharecrm data record create --data '{"object_api_name":"JournalObj","object_data":{"journal_time":"<period_end_yyyyMMdd>","period_type":"weekly","record_type":"default_week__c","owner":["1000"],"comment_by":["1000"],"work_summary":"...","work_plan":"...","work_experience":"..."}}'
```

命令要求：

- `--data` 的值必须是一个完整 JSON 字符串，顶层包含 `object_api_name` 和 `object_data`。
- `object_api_name` 固定为 `JournalObj`。
- `object_data` 只放默认写入字段；不要把中文预览字段名直接放进 JSON。
- 不使用 `apiName` 作为顶层字段；不使用 `--object_api_name JournalObj --data ...`、`--object_data ...` 或混合参数写法；不要把 `object_data` 拆到 `--data` 外面。
- `journal_time` 必须使用 `yyyyMMdd`，周报使用已解析出的 `period_end` 转换得到的 `<period_end_yyyyMMdd>`；不要使用 `yyyy-MM-dd`、`yyyy-MM-dd HH:mm:ss`、当前生成日或其他带横线/时间格式。
- 用户可见的业务类型展示为“日计划 / 周计划 / 月计划”，但内部 payload 必须使用 CRM 接受的枚举值；已验证周报可用 `record_type:"default_week__c"`，并搭配 `period_type:"weekly"`。
- 日报和月报写入前如未确认枚举值，应先 describe `JournalObj` 或参考已返回字段定义，确认 `record_type` 和 `period_type` 的内部值；不要在枚举字段里直接写中文展示值。
- `owner` 是 employee 字段，必须传当前销售人员员工 ID 数组，例如 `["1000"]`。
- `comment_by` 是 employee 字段，默认传当前销售人员员工 ID 数组，例如 `["1000"]`。
- 写入成功后，以 CLI 返回结果为准；不要默认展示 `_id` 或长串主键。

内部写入 payload 参考；不要把以下 ApiName 直接展示给用户：

- `object_api_name`: `JournalObj`
- `object_data.record_type`: 业务类型的 CRM 内部枚举值；周报已验证为 `default_week__c`，日报/月报需以 `JournalObj` 字段定义为准
- `object_data.period_type`: 周期类型；周报已验证为 `weekly`，日报/月报需以 `JournalObj` 字段定义为准
- `object_data.journal_time`: `yyyyMMdd` 格式；必须复用报表解析出的周期日期，日报用日报对应日期，周报用 ISO 自然周周日，月报用自然月最后一天
- `object_data.owner`: 当前销售人员员工 ID 数组，例如 `["1000"]`
- `object_data.comment_by`: 点评人，employee 字段，默认当前销售人员员工 ID 数组，例如 `["1000"]`
- `object_data.work_summary`: 本期工作总结，纯文本；个人周报从“本周关键成果”详细原文回填，不要提炼
- `object_data.work_plan`: 下期工作计划，纯文本；个人周报从“下周行动”详细原文回填，保留 P0/P1/P2、客户/联系人、动作、目标、截止时间和验证标准，不要提炼
- `object_data.work_experience`: 心得体会，纯文本；个人周报从“本周复盘”回填，可以适当提炼

不要主动写入 `name`、`journal_time_range`、`related_object` 或系统字段。如果 CRM 创建接口强制要求其他非默认字段，不要自动补填；说明缺少的必填字段，并等待用户或系统明确要求。

## 禁止行为

- 不在 describe 之前查询业务对象。
- 不使用企业规范未记录的 `sharecrm sales ...` 快捷命令。
- 查询记录时不使用 `--data` JSON 或混合 JSON/扁平参数写法；保存日志时按固定创建命令使用 `--data`。
- 不猜 `owner`、`owner_id`、`stage`、`payment_amount`、`account_name` 等字段。
- 不输出与 CRM 记录矛盾的推断。
- 不在信息不足时假装知道。
- 不声称已经自动同步、自动写入或自动提醒，除非环境确实提供相应能力。
- 不把没有查询到的数据写成事实。
- 推断必须标注来源和置信度：确认 / 推断 / 待确认。
- 不在用户确认前写入日志。
- 不编造 CRM 创建命令、记录 ID 或保存成功状态。
