# R01 客户画像

## 目标

提取客户360档案的基础画像，不做见客前行动判断。

## 触发条件

识别客户后始终执行。

## 输入来源

- CRM Account。
- 用户提供的客户背景。
- 公开信息，仅在用户要求或 CRM 信息不足时使用。
- 行业基准参考。

## 输出契约

```yaml
r01_customer_profile:
  customer_id:
  customer_name:
  industry:
  segment:
  employee_count:
  revenue_band:
  location:
  deal_status:
  account_source:
  create_time:
  last_followed_time:
  last_deal_closed_time:
  business_description:
  strategic_signals:
    - signal:
      source:
      confidence: confirmed|inferred|unknown
  data_gaps:
    - field_name
```

## 分析规则

- CRM 字段优先于公开信息。
- 公开信息只能补充业务描述和战略动态，不覆盖 CRM 事实。
- 没有证据时写“未知”，不要用行业常识补齐。
- 客户画像要回答“这个客户是谁、做什么、处在什么业务状态”，不是销售行动建议。
- 正文不逐条堆叠来源；如需说明来源类型，使用“证据类型/置信度”，最终来源口径收口到档案末尾弱引用。

## Markdown 输出

```markdown
## 1. 🪪 客户画像

| 维度 | 内容 | 置信度 |
| --- | --- | --- |
| 客户名称 |  | 确认/推断/未知 |
| 行业/赛道 |  |  |
| 规模/营收 |  |  |
| 成交状态 |  |  |
| 客户来源 |  |  |
| 最后跟进 |  |  |

### 业务描述
{客户做什么、客户服务谁、主要市场是什么}

### 战略动态
- {最近 1-2 年的重要变化，标注置信度}

### 信息缺口
- {仍缺少的信息}
```
