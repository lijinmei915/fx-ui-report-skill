# R09 - CRM 日志存储确认

## 目标

个人日报、周报、月报生成完成后，询问用户是否将本次报表保存到 CRM 日志对象。

本规则只负责“生成后确认”和“待写入内容整理”。面向用户只展示中文字段，不展示字段 ApiName。未获得用户明确确认前，不允许调用任何 CRM 写入能力。

写入 CRM 日志时，日志保存预览默认展示 6 个中文字段：业务类型、时间、本期工作总结、下期工作计划、心得体会、点评人。内部写入 payload 必须按“唯一写入范式”构造，除上述业务字段外，还必须包含 CRM 创建日志所需的 `owner` 和 `period_type`。

点评人默认回填规则：默认是当前销售本人。`owner` 和 `comment_by` 都是 employee 字段，内部 payload 必须传员工 ID 数组，例如 `["1000"]`；不要传人员姓名字符串。

日志保存日期必须复用 `R01_period_router.md` 和 `references/report_periods.md` 已解析出的时间窗口，不要重新按当前日期猜测：

- 日报：`journal_time` 使用日报对应日期。
- 周报：`journal_time` 使用 ISO 自然周周日，即 `period_end`。
- 月报：`journal_time` 使用自然月最后一天，即 `period_end`。

保存预览的“时间”可以展示日期范围；payload 的 `journal_time` 只能写单个 `yyyyMMdd` 日期。

个人周报的日志保存预览必须按周报正文模块回填：

- 本期工作总结：回填 `## ✅ 本周关键成果` 的详细原文纯文本内容，不要提炼。
- 下期工作计划：回填 `## 🎯 下周行动` 的详细原文纯文本内容，保留 P0/P1/P2 优先级、客户/联系人、动作、目标、截止时间和验证标准，不要提炼。
- 心得体会：回填 `## 🧠 本周复盘` 的纯文本内容，可以适当提炼。

个人周报不要用摘要、关键指标、客户/商机进展、风险预警替代上述 3 个来源模块；本期工作总结和下期工作计划不要压缩改写，只可去除 Markdown 标记后保留原文语义和细节。

## 触发时机

在完成个人日报、个人周报或个人月报输出后执行本规则。

适用报告：

- 个人日报
- 个人周报
- 个人月报

## 确认话术

输出报表后，追加以下确认：

是否将本次个人[日报/周报/月报]保存到 CRM 日志？
确认后我会按下方内容写入；未确认前不会保存。

同时展示中文写入预览，至少包含：

日志保存预览直接作为正文输出，不要放进代码块：

- `## 📝 日志保存预览`
- 业务类型：日计划/周计划/月计划
- 时间：
- 本期工作总结：
- 下期工作计划：
- 心得体会：
- 点评人：

确认区只展示上述 6 个中文字段。不要展示日志编号、负责人、日志日期范围、关联业务模块、对象 ApiName 或字段 ApiName。

写入内容必须是纯文本：不要包含 HTML 标签、Markdown 表格、CRM 日志保存确认模块或数据说明模块。个人周报必须从“本周关键成果、下周行动、本周复盘”三个模块分别回填，不要混用其他模块；其中“本周关键成果”和“下周行动”必须详细保留原文，不要提炼、压缩或改写为摘要；“本周复盘”可以适当提炼为心得体会。

## 明确确认标准

只有用户明确表达以下意图，才可以进入写入步骤：

- 确认保存
- 确认写入
- 保存到 CRM
- 写入日志对象
- 保存到日志
- 是，保存

以下情况都不能写入：

- 用户没有回复
- 用户只说“看看、先这样、稍后”
- 用户要求修改报表
- 用户对字段内容有疑问

## 字段映射

字段映射和字段约束见 `references/journal_object_reference.md`。

生成 payload 时必须包含：`journal_time`、`period_type`、`record_type`、`owner`、`comment_by`、`work_summary`、`work_plan`、`work_experience`。

不要主动包含 `name`、`journal_time_range`、`related_object`、系统字段、除 `comment_by` 以外的评论字段、锁定状态和生命周期字段。如果当前 CRM 强制要求其他非默认字段，不要自动补填；应说明缺少必填字段，并等待用户或系统明确要求。

## 写入前检查

调用 CRM 写入能力前必须确认：

1. 用户已明确确认保存。
2. `journal_time` 已按周期规则确认并转换为 `yyyyMMdd`：日报用日报日期，周报用 ISO 自然周周日，月报用自然月最后一天；不要使用当前生成日覆盖报表周期日期。
3. `journal_time` 不使用 `yyyy-MM-dd`、`yyyy-MM-dd HH:mm:ss`、日期范围文本或其他带横线/时间/范围的格式。
4. 周报 `period_type` 已设置为 `weekly`。
5. 周报 `record_type` 已设置为 `default_week__c`。
6. `owner` 已确认为当前销售人员员工 ID 数组，例如 `["1000"]`。
7. `comment_by` 已确认为当前销售人员员工 ID 数组，例如 `["1000"]`。
8. `work_summary` 个人周报必须来自“本周关键成果”详细原文，不要提炼。
9. `work_plan` 个人周报必须来自“下周行动”详细原文，并保留 P0/P1/P2 优先级、客户/联系人、动作、目标、截止时间和验证标准，不要提炼。
10. `work_experience` 个人周报必须来自“本周复盘”，可以适当提炼。

## 写入能力处理

写入 CRM 日志时，必须使用以下唯一命令路径：

```bash
Sharecrm data record create --data '<JSON>'
```

不要尝试以下错误路径：

- 不使用 `apiName` 作为顶层字段，必须使用 `object_api_name`。
- 不使用 `--object_api_name JournalObj --data ...` 的混合参数写法。
- 不使用 `--object_data ...`。
- 不把 `object_data` 拆到 `--data` 外面。
- 不把中文字段名写入 JSON。
- 不把人员姓名字符串写入 employee 字段。
- 不把 `journal_time` 写成 `yyyy-MM-dd`、`yyyy-MM-dd HH:mm:ss` 或其他带横线/时间格式。

个人周报保存到 CRM 日志时，payload 必须使用如下结构：

```json
{
  "object_api_name": "JournalObj",
  "object_data": {
    "journal_time": "<period_end_yyyyMMdd>",
    "period_type": "weekly",
    "record_type": "default_week__c",
    "owner": ["1000"],
    "comment_by": ["1000"],
    "work_summary": "从本周关键成果原文详细回填的纯文本",
    "work_plan": "从下周行动P0/P1/P2原文详细回填的纯文本",
    "work_experience": "从本周复盘适当提炼的纯文本"
  }
}
```

对应命令示例：

```bash
Sharecrm data record create --data '{"object_api_name":"JournalObj","object_data":{"journal_time":"<period_end_yyyyMMdd>","period_type":"weekly","record_type":"default_week__c","owner":["1000"],"comment_by":["1000"],"work_summary":"从本周关键成果原文详细回填的纯文本","work_plan":"从下周行动P0/P1/P2原文详细回填的纯文本","work_experience":"从本周复盘适当提炼的纯文本"}}'
```

如果当前销售人员员工 ID 无法确认，不能试错写入，必须先查询或向用户确认。

如果当前环境没有可用写入能力、CLI 不支持创建记录、无权限或写入失败：

- 不声称已经保存。
- 说明失败原因或能力缺失。
- 输出仅包含上述唯一写入范式字段的待写入 payload，便于用户人工处理或稍后重试。

## 成功输出

写入成功后，返回：

已保存到 CRM 日志。
- 业务类型：
- 时间：
- 保存结果：成功

默认不展示记录 ID、`_id` 或长串主键。只有用户明确要求排查底层数据或定位记录时，才可以补充记录 ID。

## 禁止行为

- 不在用户确认前自动写入。
- 不把“建议写入 memory”等同于已写入 CRM。
- 不编造 CRM 创建命令、记录 ID 或成功状态。
- 不在保存成功结果中默认展示记录 ID、`_id` 或长串主键。
- 不主动写入日志编号、日志日期范围、关联业务模块或除 `owner`、`comment_by` 以外的任何非默认人员/评论字段。
- 不把 HTML 标签、Markdown 表格、完整报表全文或保存确认模块写入 CRM 日志。
- 不主动填写 `create_time`、`created_by`、`last_modified_time`、`last_modified_by` 等系统字段。
- 不主动填写 `comment_status`、`lock_status`、`life_status`，除非用户或系统明确要求。
- 不在面向用户的确认区展示 `name`、`work_summary`、`work_experience`、`work_plan`、`journal_time` 等字段 ApiName。
