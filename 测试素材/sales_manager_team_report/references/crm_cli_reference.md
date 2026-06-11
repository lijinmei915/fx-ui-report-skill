# CRM CLI 查询参考

本文件用于销售管理者团队日报、团队周报、团队月报的数据查询。只有在当前环境提供 `sharecrm` CLI，且用户请求需要查询 CRM 数据时才读取本文件。

## 基本原则

- 先查 CRM 事实，再生成团队报表。
- 先解析团队范围、AE 范围和时间范围，再执行查询。
- 首次查询任何对象前，必须先查询对象字段；字段未确认时不要猜字段名。
- 用户显式指定团队、区域、行业组、销售经理或 AE 列表时，以用户输入为准。
- 用户使用“我的团队、我负责的团队、当前团队”等表达时，优先使用当前管理者上下文；无法确定时先追问。
- 使用 `currentDateTime` 解析“今天、昨天、本周、上周、本月、上月、最近 N 天”等相对时间；日报、周报、月报必须严格按 `references/report_periods.md` 的自然日、ISO 自然周和自然月规则计算。周报必须使用 ISO 自然周：`本周 = currentDateTime 所在周的周一至周日`，`上周 = 本周周一 - 7 天 至 本周周一 - 1 天`；不要把“上周”当成最近 7 天。
- CRM 查询和内部 payload 可以使用对象 ApiName 与记录 ID；用户可见的 CRM 数据汇总、数据说明和保存结果必须使用中文对象名称，并隐藏记录 ID、`_id` 和长串主键。
- 只使用本文件列出的读取命令：`describe get`、`query-by-name`、`query-by-fields`。不要尝试企业规范未记录的快捷命令或销售专用命令。

## 标准查询流程

```text
Step 1 - 解析团队范围、AE 范围、报告周期和时间范围。
Step 2 - 必要时查询人员记录，确定 AE 列表；团队字段必须先 describe。
Step 3 - 确定需要查询的对象；包括用户选择的自定义对象。
Step 4 - 对每个对象先执行 describe get，确认可用字段、时间字段、人员字段、团队字段和关联字段。
Step 5 - 用 query-by-fields 查询日志、商机、订单、回款、销售记录、日程、外勤等事实数据。
Step 6 - 按 AE、客户、商机、阶段、行业和时间聚合。
Step 7 - 结合 rules/ 生成团队日报、周报或月报。
Step 8 - 用户确认后，按可用 CRM 创建能力写入日志。
```

时间解析校验：

- 团队日报：今天/昨天必须是 `Asia/Shanghai` 自然日，查询范围为 00:00:00 到 23:59:59。
- 团队周报：本周/上周必须是 ISO 自然周，周一到周日；不要按当前日期滚动 7 天。
- 团队月报：本月/上月必须是自然月，从 1 日到月末。
- 标题、正文、CRM 查询过滤和日志保存时间必须共用同一个已解析周期。

推荐查询顺序：

1. 人员：团队或 AE 范围不明确时，先查询人员对象；无法确认团队字段时要求用户提供 AE 列表。
2. 日志：查询上期团队日志或管理者日志，用于管理动作闭环。
3. 核心结果：查询商机、订单、回款。
4. 执行动作：查询销售记录、日程、外勤。
5. 补充：客户、线索、联系人只在需要名称、行业、状态或联系人上下文时查询。
6. 自定义对象：用户指定后先 describe，再按已确认字段查询；不要把自定义对象当作已知标准对象处理。

范围和数据覆盖的细则见 `rules/R08_team_scope_and_coverage.md`。周期与指标口径见 `references/report_periods.md`。

团队日报、周报、月报保存到 CRM 日志对象的确认流程见 `rules/R09_team_journal_storage_confirmation.md`，字段映射见 `references/journal_object_reference.md`。

## 字段确认

每个对象在本轮请求中首次查询前，先执行：

```bash
sharecrm data describe get --object_api_name <ObjectApiName> --simple_describe true
```

执行后只使用返回中确认存在的字段：

- 时间过滤字段：如 `create_time`、`payment_time`、`new_stat_date`、`journal_time`，以 describe 返回为准。
- 人员过滤字段：不要默认存在 `owner`、`owner_id`、`created_by`、销售姓名或 AE 字段；只有 describe 确认后才可作为过滤条件。
- 团队/部门字段：不要默认存在 `manager_id`、`department_id`、`dept_id`、`team_id`；只有 describe 确认后才可用于团队范围查询。
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
- 日志：找到上周团队周报，其中包含上期管理动作、风险复盘和本周行动计划。
- 销售记录：本周共 30 条记录，其中 12 条与重点商机推进相关。
- 商机：查询到 50 条商机，已按阶段和负责 AE 汇总。
```

禁止输出：

```text
- 用对象 ApiName、记录 ID 或长串主键描述日志、销售记录、商机、订单、回款。
```

除非用户明确要求定位底层记录，不要展示记录 ID、`_id`、数据 ID 或长串主键。

## 团队与 AE 范围解析

团队报表必须先明确 AE 范围。优先顺序：

1. 用户显式提供团队名称、区域、行业组、销售经理或 AE 列表。
2. 通过 CRM 人员对象或组织关系查询团队成员；字段必须先 describe。
3. 当前管理者上下文中可确认的下属范围。
4. CRM/日志不可用时，通过本地 memory 中出现的 AE 归档推断候选范围。
5. 要求用户补充 AE 列表。

当前企业规范只明确 `PersonnelObj` 是人员对象，但未给出团队字段、上级字段或部门字段。实际查询时应以 CRM 字段定义为准，不要假设存在 `manager_id`、`department_id`、`owner` 等字段。

如果无法确认完整 AE 范围，必须标注“团队成员范围待确认”，不要默认所有 AE 都已纳入统计。

如果只能通过本地 memory 找到候选 AE，必须标注为“候选范围”，不要把候选 AE 当作正式团队名单。

## 常用命令

### 查询对象字段

```bash
sharecrm data describe get --object_api_name <ObjectApiName> --simple_describe true
```

### 按名称查询记录

```bash
sharecrm data record query-by-name --name <名称> --object_api_names <ObjectApiName>
```

示例：

```bash
sharecrm data record query-by-name --name <销售姓名> --object_api_names PersonnelObj
sharecrm data record query-by-name --name <客户名称> --object_api_names AccountObj
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
- 不使用未经过 describe 确认的负责人、团队、部门、客户、金额、阶段字段。

## 目标、任务与口径缺失处理

团队目标或 AE 目标来源优先级：

1. CRM 中明确的目标/配额对象或字段。
2. 用户提供的团队或 AE 目标。
3. CRM 日志中有明确来源的目标。
4. 本地 memory 中有明确来源的目标，仅在 CRM/日志不可用时兜底参考。

如果没有目标数据，不计算目标完成率，只输出成交、回款、Pipeline 等事实指标，并在指标模块内说明“目标数据缺失”。

任务/P0/逾期数据来源优先级：

1. CRM 中明确的任务对象或字段。
2. 日程。
3. 销售记录中可识别的承诺事项。
4. 上期团队日志中的管理动作和下期计划。
5. 用户输入。
6. 团队 `memory/management_action/`，仅在 CRM/日志不可用时兜底参考。

如果没有明确任务对象，不要声称已查询 CRM 任务；应说明“任务数据来自日程、销售记录、CRM 日志或用户输入推断”。

## 团队日报查询建议

日报优先查询当天实际结果、异常和明日管理动作。

| 对象 | ApiName | 建议字段 | 用途 |
|------|---------|----------|------|
| 日志 | `JournalObj` | 先 describe；常见可读字段包括 `work_summary, work_experience, work_plan, journal_time, record_type` | 最近团队日志和管理动作延续 |
| 销售记录 | `ActiveRecordObj` | `account_id, new_opportunity_id, interactive_scenario, interactive_types, active_record_content, create_time` | 当日各 AE 跟进记录 |
| 日程 | `ScheduleObj` | `participants, content, begin_time, end_time, related_object_data` | 当日/明日日程和关键会议 |
| 外勤 | `CheckinsObj` | `owner, customer_id, communicate_record, new_stat_date, checkins_scene` | 外勤拜访和现场沟通 |
| 商机 | `NewOpportunityObj` | `account_id, name, sales_stage, amount, probability, probability_amount, sales_status, close_date` | 当日商机变化 |
| 订单 | `SalesOrderObj` | `account_id, name, create_time, order_amount` | 当日成交 |
| 回款 | `PaymentObj` | `account_id, name, create_time, payment_time, amount` | 当日回款 |

上表是字段候选，不是免 describe 清单；实际查询必须以 describe 返回为准。

## 团队周报查询建议

周报优先查询团队目标进展、AE 横向对比、Pipeline 和风险。

| 对象 | ApiName | 用途 |
|------|---------|------|
| 日志 | `JournalObj` | 上周团队日志、本周已生成日志、上期管理动作 |
| 商机 | `NewOpportunityObj` | 本周 Pipeline、阶段变化、赢单、输单、无效 |
| 订单 | `SalesOrderObj` | 本周成交订单 |
| 回款 | `PaymentObj` | 本周回款 |
| 销售记录 | `ActiveRecordObj` | 本周跟进、客户反馈、竞品和风险证据 |
| 日程/外勤 | `ScheduleObj` / `CheckinsObj` | 下周关键计划、拜访和主管可介入会议 |
| 客户/线索/联系人 | `AccountObj` / `LeadsObj` / `ContactObj` | 仅在需要补充名称、行业、状态或联系人信息时查询 |

## 团队月报查询建议

月报优先查询团队经营结果、结构趋势和管理问题。

| 对象 | ApiName | 用途 |
|------|---------|------|
| 日志 | `JournalObj` | 上月团队日志、月内日志、历史复盘和下期计划 |
| 商机 | `NewOpportunityObj` | 月初/月末 Pipeline、阶段结构、赢单、输单、无效 |
| 订单 | `SalesOrderObj` | 月度成交订单和成交金额 |
| 回款 | `PaymentObj` | 月度回款 |
| 销售记录 | `ActiveRecordObj` | 重点客户互动、风险证据、AE 执行情况 |
| 客户/线索/联系人 | `AccountObj` / `LeadsObj` / `ContactObj` | 月度新增、成交状态、行业和联系人上下文补充 |

## 日志历史查询建议

生成团队报表前，优先查询日志作为团队历史来源：

| 报告 | 建议查询 |
|------|----------|
| 日报 | 查询团队或管理者最近一条日志，或当天已有日志 |
| 周报 | 查询上周团队日志、本周已生成日志 |
| 月报 | 查询上月团队日志、月内日志 |

查询日志时也必须先 describe。只有字段确认存在时，才使用 `record_type`、`journal_time`、人员字段或名称字段过滤。

如果日志不可用，说明无法读取历史日志；不要自动退回为已读取本地 memory，除非本地 memory 明确存在且用户允许参考。

## 聚合建议

团队报表查询后至少按以下维度聚合：

- AE
- 客户
- 商机阶段
- 行业或客户类型
- 时间周期
- 风险类型
- 成交/回款状态

## 查询失败处理

遇到以下情况时，不要继续换命令乱试：

- CLI 不存在或不可执行。
- 没有 CRM 权限。
- describe 失败或字段名不确定。
- 一次按已确认字段构造的 query-by-fields 查询失败。
- 查询返回空。
- 团队范围或 AE 列表不明确。
- 时间范围不明确。
- CRM 数据与 AE 自述、本地 memory 或历史日志冲突。

处理方式：

```text
当前无法完整查询 CRM 数据，原因是：[原因]。
请补充：[需要用户补充的数据]。
以下内容将基于已获得数据生成；受影响的判断会在对应模块内简短说明。
```

如果是字段或命令问题，说明“已按对象字段查询，但当前 CLI/字段不支持该条件”，然后追问或基于已获得数据继续生成；查询数据时不要继续尝试 `sharecrm sales ...`、`--data`、`owner_id`、`manager_id` 等未确认写法。`--data` 只允许用于下方日志创建命令。

## 日志写入处理

需要保存团队日报、周报或月报到 CRM 日志对象时：

1. 先按 `rules/R09_team_journal_storage_confirmation.md` 展示中文待写入预览并询问用户。
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
- `journal_time` 必须使用 `yyyyMMdd`；周报/月报使用已解析出的 `period_end` 转换得到的 `<period_end_yyyyMMdd>`，日报使用日报日期转换得到的 `<period_date_yyyyMMdd>`；不要使用 `yyyy-MM-dd`、`yyyy-MM-dd HH:mm:ss`、当前生成日覆盖周报周期结束日或其他带横线/时间格式。
- 用户可见的业务类型展示为“日计划 / 周计划 / 月计划”，但内部 payload 必须使用 CRM 接受的枚举值；已验证周报可用 `record_type:"default_week__c"`，并搭配 `period_type:"weekly"`。
- 日报和月报写入前如未确认枚举值，应先 describe `JournalObj` 或参考已返回字段定义，确认 `record_type` 和 `period_type` 的内部值；不要在枚举字段里直接写中文展示值。
- `owner` 是 employee 字段，必须传当前管理者或当前用户员工 ID 数组，例如 `["1000"]`。
- `comment_by` 是 employee 字段，默认传当前管理者或当前用户员工 ID 数组，例如 `["1000"]`。
- 写入成功后，以 CLI 返回结果为准；不要默认展示 `_id` 或长串主键。

内部写入 payload 参考；不要把以下 ApiName 直接展示给用户：

- `object_api_name`: `JournalObj`
- `object_data.record_type`: 业务类型的 CRM 内部枚举值；周报已验证为 `default_week__c`，日报/月报需以 `JournalObj` 字段定义为准
- `object_data.period_type`: 周期类型；周报已验证为 `weekly`，日报/月报需以 `JournalObj` 字段定义为准
- `object_data.journal_time`: `yyyyMMdd` 格式；日报用当天，周报/月报使用已解析周期结束日，必须与报表标题和 CRM 查询周期一致
- `object_data.owner`: 当前管理者或当前用户员工 ID 数组，例如 `["1000"]`
- `object_data.comment_by`: 点评人，employee 字段，默认当前管理者或当前用户员工 ID 数组，例如 `["1000"]`
- `object_data.work_summary`: 本期工作总结，纯文本；从团队报表关键业务模块原文详细回填，不做提炼
- `object_data.work_plan`: 下期工作计划，纯文本；从团队行动计划 P0/P1/P2 原文详细回填，不做提炼
- `object_data.work_experience`: 心得体会，纯文本；可从管理判断、风险复盘、团队经验和关键反思中适当提炼

不要主动写入 `name`、`journal_time_range`、`related_object` 或系统字段。如果 CRM 创建接口强制要求其他非默认字段，不要自动补填；说明缺少的必填字段，并等待用户或系统明确要求。

## 禁止行为

- 不在 describe 之前查询业务对象。
- 不使用企业规范未记录的 `sharecrm sales ...` 快捷命令。
- 查询记录时不使用 `--data` JSON 或混合 JSON/扁平参数写法；保存日志时按固定创建命令使用 `--data`。
- 不猜 `owner`、`owner_id`、`manager_id`、`department_id`、`stage`、`payment_amount`、`account_name` 等字段。
- 不输出与 CRM 记录矛盾的推断。
- 不在信息不足时假装知道。
- 不声称已经自动同步、自动写入或自动提醒，除非环境确实提供相应能力。
- 不把没有查询到的数据写成事实。
- 不用团队平均掩盖缺失 AE 或异常 AE。
- 推断必须标注来源和置信度：确认 / 推断 / 待确认。
- 不在用户确认前写入日志。
- 不编造 CRM 创建命令、记录 ID 或保存成功状态。
