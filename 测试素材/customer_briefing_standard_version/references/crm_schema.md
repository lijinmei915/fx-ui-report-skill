# CRM 字段映射参考

仅在需要解释原始 CRM 字段、用户粘贴数据或 CLI 查询结果时读取本文件。正常生成客户360时，不需要完整加载。

## 客户360主要对象

| 对象 | 中文名称 | 对应规则 |
| --- | --- | --- |
| `AccountObj` | 客户 | R01 客户画像 |
| `NewOpportunityObj` | 商机 | R05 项目背景与商机全貌 |
| `ContactObj` | 联系人 | R03 关系温度、R04 决策链 |
| `ActiveRecordObj` | 销售记录/跟进动态 | R02 时间线、R03 关系温度、R06 痛点地图、R07 竞品全貌 |
| `CompetitiveLinesObj` | 竞品明细 | R07 竞品全貌 |
| `ContractObj` | 合同 | R09 历史合作、财务与客户健康 |
| `SalesOrderObj` | 销售订单 | R09 历史合作、财务与客户健康 |
| `PaymentObj` | 回款 | R09，若环境中存在独立回款对象 |
| `object_yFjSD__c` | CSM 客户预警 | R09 客户健康风险、R06 痛点补充 |
| `object_d3V9S__c` | 客户流失原因 | R09 流失原因、R07 竞品补充 |
| `ScheduleObj` | 日程 | 可选补充，会议计划和未完成事项 |
| `CheckinsObj` | 外勤签到 | 可选补充，现场拜访轨迹 |
| `PersonnelObj` | 人员 | 可选补充，内部负责人 |

## AccountObj 客户字段

| 字段 | 含义 | 映射到 |
| --- | --- | --- |
| `_id` | 客户 ID | `r01_customer_profile.customer_id` |
| `name` | 客户名称 | `customer_name` |
| `industry` | 行业/细分赛道 | 行业、痛点假设、行业基准 |
| `employee_count` | 员工规模 | 规模判断 |
| `annual_revenue` | 营收量级 | 规模、财务信号 |
| `deal_status` | 成交状态 | 新客户/已成交/多次成交判断 |
| `account_source` | 客户来源 | 来源与触发背景 |
| `last_followed_time` | 最后跟进时间 | 信息时效性 |
| `create_time` | 客户入库时间 | 客户历史长度 |
| `address` | 所在地 | 区域和组织背景 |
| `website` | 官网 | 可选公开信息检索 |

## NewOpportunityObj 商机字段

| 字段 | 含义 | 映射到 |
| --- | --- | --- |
| `_id` | 商机 ID | 商机唯一标识 |
| `name` | 商机名称 | 当前/历史商机 |
| `sales_stage` | 销售阶段 | 线索、需求确认、POC、方案确认、合同谈判、签约等 |
| `sales_status` | 商机状态 | 进行中、赢单、输单、无效 |
| `amount` | 商机金额 | 商机价值 |
| `probability` | AE 录入赢率 | 主观信心信号 |
| `close_date` | 预计结单日期 | 时间窗口 |
| `budget_status` | 预算状态 | 已批复、申请中、未知 |
| `approval_flow` | 审批链路 | 决策链和组织政治 |
| `competitors` | 已知竞品 | 竞品全貌 |
| `notes` | 商机备注 | 触发事件、痛点、特殊背景 |

多商机客户应优先分析进行中商机；历史赢单、输单、搁置商机用于复盘客户行为模式。

## ContactObj 联系人字段

| 字段 | 含义 | 映射到 |
| --- | --- | --- |
| `_id` | 联系人 ID | 溯源 |
| `name` | 姓名 | 关键人列表 |
| `job_title` | 职务 | EB/TB/UX/Coach/Gatekeeper 候选判断 |
| `primary_contact` / `is_primary` | CRM 主联系人标记 | 主联系人，不等同于最终决策人 |
| `mobile` / `email` | 联系方式 | 默认不展示，除非用户明确要求 |

角色判断必须结合互动证据。不能只因为职位高就确认 EB，也不能只因为频繁沟通就确认 Coach。

## ActiveRecordObj 跟进记录字段

| 字段 | 含义 | 映射到 |
| --- | --- | --- |
| `interactive_scenario` | 互动场景 | 时间线和销售阶段语境 |
| `interactive_types` | 互动方式 | 电话、在线会议、现场拜访、邮件等 |
| `active_record_content` | 跟进正文 | 客户原话、痛点、承诺、竞品、情绪、关系变化 |
| `create_time` | 记录时间 | 时间线排序和信息时效 |

互动场景只能作为弱信号，必须阅读正文。正文中的客户原话、承诺、反对意见和参与人变化优先级最高。

## CompetitiveLinesObj 竞品明细字段

| 字段 | 含义 | 映射到 |
| --- | --- | --- |
| `_id` | 竞品明细 ID | 溯源 |
| `name` | 明细名称 | 竞品记录 |
| `competitor_id` | 竞品 | 竞品名称或竞品对象 ID |
| `advantage` | 竞品优势 | 客户认为竞品强在哪里 |
| `weaknesses` | 竞品弱点 | 客户或 AE 记录的竞品短板 |
| `quotation_amount` | 竞品报价 | 报价和商务压力 |
| `is_win` | 竞品是否赢单 | 历史结果或当前结果 |

## R09 扩展对象字段

### ContractObj

| 字段 | 含义 |
| --- | --- |
| `_id` | 合同 ID |
| `name` | 合同名称 |
| `contract_amount` | 合同金额 |
| `started_time` | 合同开始时间 |
| `expired_time` | 合同到期时间 |
| `status` | 合同状态 |

### SalesOrderObj

| 字段 | 含义 |
| --- | --- |
| `_id` | 订单 ID |
| `name` | 订单名称 |
| `order_amount` | 订单金额 |
| `order_status` | 订单状态 |
| `payment_amount` | 已回款金额 |
| `receivable_amount` | 应收金额 |
| `field_y33wm__c` / `field_RMqlg__c` | 企业自定义业务字段，按 CLI 返回含义解释 |

### CSM 预警与流失原因

| 对象 | 字段 | 使用方式 |
| --- | --- | --- |
| `object_yFjSD__c` | `field_yn287__c,field_cmSR1__c,field_w16tW__c,field_UP2co__c` | 客户健康、服务风险、续约风险，需要结合字段显示名和记录正文解释 |
| `object_d3V9S__c` | `field_yjo3L__c,field_U4Bk7__c,field_dpebo__c,field_a20hA__c` | 流失原因、竞品替换、自研替换、预算或服务问题 |

## 最小可用输入

没有 CLI 或 CRM 工具输出时，最小输入为：

```text
客户名称：
客户行业/规模：
当前商机：
最近互动：
关键联系人：
已知痛点：
已知竞品：
历史合作：
仍不确定的信息：
```

缺失项进入 R08 开放问题，不要静默补齐。
