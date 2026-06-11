# CRM 常用对象与字段

本文件记录个人销售日报、周报、月报常用的 CRM 对象和字段口径。字段来自企业规范中的“CRM中的常用对象及字段”。

## 常用对象 ApiName

| 业务对象 | ApiName |
|----------|---------|
| 线索 | `LeadsObj` |
| 客户 | `AccountObj` |
| 联系人 | `ContactObj` |
| 商机 | `NewOpportunityObj` |
| 销售订单 | `SalesOrderObj` |
| 回款 | `PaymentObj` |
| 人员 | `PersonnelObj` |
| 销售记录 | `ActiveRecordObj` |
| 日程 | `ScheduleObj` |
| 高级外勤 | `CheckinsObj` |

## 客户 AccountObj

| 字段 | 含义 |
|------|------|
| `create_time` | 客户记录创建时间 |
| `name` | 客户名称 |
| `_id` | 客户唯一 ID |
| `deal_status` | 成交状态：未成交、已成交、多次成交 |
| `account_source` | 客户来源，如展会、陌拜、转介绍 |
| `last_deal_closed_time` | 最近一次成交日期 |
| `last_followed_time` | 最后一次跟进日期 |

## 商机 NewOpportunityObj

| 字段 | 含义 |
|------|------|
| `account_id` | 关联客户 |
| `create_time` | 商机创建时间 |
| `name` | 商机名称 |
| `_id` | 商机唯一 ID |
| `sales_stage` | 商机阶段 |
| `amount` | 商机金额 |
| `probability` | 赢率 |
| `probability_amount` | 预测金额，通常为 `amount * probability` |
| `sales_status` | 阶段状态：进行中、赢单、输单、无效 |
| `close_date` | 结单日期 |

## 销售记录 ActiveRecordObj

销售记录即跟进动态，用于记录销售与客户或商机的互动。

| 字段 | 含义 |
|------|------|
| `interactive_scenario` | 互动场景 |
| `interactive_types` | 互动类型 |
| `interactive_types__o` | 当互动类型为“其他”时填写的补充内容 |
| `account_id` | 关联客户 |
| `new_opportunity_id` | 关联商机 |
| `create_time` | 互动发生或记录创建时间 |
| `active_record_content` | 销售记录核心内容 |
| `_id` | 销售记录唯一 ID |

互动场景常见枚举：

| 中文 | 枚举 |
|------|------|
| 产品介绍与首面 | `product_introduction` |
| 需求调研 | `requirements_research` |
| 解决方案讲解与 POC | `POC` |
| 投标与商务谈判 | `bidding` |
| 高层汇报 | `high_level_reporting` |
| 项目启动会 | `project_launch` |
| 客户经营会 | `customer_management` |
| 结项会议 | `closing_meeting` |
| 其他 | `default` |

互动类型常见枚举：

| 中文 | 枚举 |
|------|------|
| 打电话 | `call` |
| 在线会议 | `meeting` |
| 在线聊天 | `chat` |
| 邮件 | `email` |
| 现场拜访 | `visit` |
| 其他 | `other` |

## 销售订单 SalesOrderObj

| 字段 | 含义 |
|------|------|
| `account_id` | 关联客户 |
| `create_time` | 订单创建时间 |
| `name` | 销售订单编号或名称 |
| `order_amount` | 销售订单金额 |

## 回款 PaymentObj

| 字段 | 含义 |
|------|------|
| `account_id` | 关联客户 |
| `create_time` | 回款记录创建时间 |
| `name` | 回款编号或名称 |
| `payment_time` | 实际到账日期 |
| `amount` | 本次实际到账金额 |

## 线索 LeadsObj

| 字段 | 含义 |
|------|------|
| `create_time` | 线索创建时间 |
| `name` | 线索名称 |
| `leads_stage` | 线索阶段：潜在线索、市场认可线索、销售认可线索、转商机 |
| `next_followed_remark` | 下次跟进要点 |

## 联系人 ContactObj

| 字段 | 含义 |
|------|------|
| `create_time` | 联系人创建时间 |
| `name` | 联系人姓名 |
| `job_title` | 职务 |
| `primary_contact` | 是否关键决策人 |

## 日程 ScheduleObj

| 字段 | 含义 |
|------|------|
| `participants` | 参与人 |
| `content` | 日程内容 |
| `begin_time` | 开始时间 |
| `end_time` | 结束时间 |
| `related_object_data` | 关联业务模块 |

## 高级外勤 CheckinsObj

| 字段 | 含义 |
|------|------|
| `owner` | 负责人 |
| `customer_id` | 客户 |
| `communicate_record` | 沟通记录 |
| `new_stat_date` | 计划日期 |
| `checkins_scene` | 外勤场景 |

## 字段使用约束

- 查询字段必须以 CRM 实际字段为准。
- 不确定字段是否存在时，先查询对象字段定义或要求用户补充。
- 不要把中文字段名直接当作 CLI 字段名。
- 不要假设所有对象都有同名负责人字段；人员过滤字段必须以实际 CRM 字段定义为准。
