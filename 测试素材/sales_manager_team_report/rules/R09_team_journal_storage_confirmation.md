# R09 - 团队 CRM 日志存储确认

## 目标

团队日报、团队周报、团队月报生成完成后，询问用户是否将本次报表保存到 CRM 日志对象 `JournalObj`。

本规则只负责“生成后确认”和“待写入内容整理”。面向用户只展示中文字段，不展示字段 ApiName。未获得用户明确确认前，不允许调用任何 CRM 写入能力。

写入 CRM 日志时，日志保存预览默认展示 6 个中文字段：业务类型、时间、本期工作总结、下期工作计划、心得体会、点评人。内部写入 payload 必须按“唯一写入范式”构造，除上述业务字段外，还必须包含 CRM 创建日志所需的 `owner` 和 `period_type`。

团队日志的负责人和点评人默认回填当前管理者或当前用户本人。`owner` 和 `comment_by` 都是 employee 字段，内部 payload 必须传员工 ID 数组，例如 `["1000"]`；不要传人员姓名字符串。

## 触发时机

在完成团队日报、团队周报或团队月报输出后执行本规则。

适用报告：

- 团队日报
- 团队周报
- 团队月报

## 确认话术

输出报表后，追加以下确认：

是否将本次团队[日报/周报/月报]保存到 CRM 日志？
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

写入内容必须是纯文本，不要包含 HTML 标签、Markdown 表格、CRM 日志保存确认模块或数据说明模块。本期工作总结和下期工作计划不要做提炼，必须从对应报表模块原文详细回填；心得体会可以从管理判断、风险复盘、团队经验和关键反思中适当提炼。

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
- 团队范围完全无法确认

## 字段映射

字段映射和字段约束见 `references/journal_object_reference.md`。

生成 payload 时必须包含：`journal_time`、`period_type`、`record_type`、`owner`、`comment_by`、`work_summary`、`work_plan`、`work_experience`。

不要主动包含 `name`、`journal_time_range`、`related_object`、系统字段、除 `comment_by` 以外的评论字段、锁定状态和生命周期字段。如果当前 CRM 强制要求其他非默认字段，不要自动补填；应说明缺少必填字段，并等待用户或系统明确要求。

## 写入前检查

调用 CRM 写入能力前必须确认：

1. 用户已明确确认保存。
2. 团队范围或 AE 覆盖已在报表中说明。
3. `journal_time` 已转换为 `yyyyMMdd`；日报用当天，周报/月报用已解析周期结束日，必须与报表标题和 CRM 查询周期一致；不要使用 `yyyy-MM-dd`、`yyyy-MM-dd HH:mm:ss`、当前生成日覆盖周报周期结束日或其他带横线/时间格式。
4. 周报 `period_type` 已设置为 `weekly`。
5. 周报 `record_type` 已设置为 `default_week__c`。
6. `owner` 已确认为当前管理者或当前用户员工 ID 数组，例如 `["1000"]`。
7. `comment_by` 已确认为当前管理者或当前用户员工 ID 数组，例如 `["1000"]`。
8. `work_summary` 已从团队报表中能代表本期工作的模块原文详细回填，不做提炼；周报优先回填“本周关键结果、AE 表现与异常、重点客户与商机、跨 AE 风险”，日报/月报使用对应关键结果、异常/风险和重点客户/商机模块。
9. `work_plan` 已从团队行动计划 P0/P1/P2 原文详细回填，不做提炼，并保留优先级、负责人、动作、截止时间和验证标准。
10. `work_experience` 已由管理判断、风险复盘、团队经验和关键反思适当提炼为纯文本。

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

团队周报保存到 CRM 日志时，payload 必须使用如下结构：

```json
{
  "object_api_name": "JournalObj",
  "object_data": {
    "journal_time": "<period_end_yyyyMMdd>",
    "period_type": "weekly",
    "record_type": "default_week__c",
    "owner": ["1000"],
    "comment_by": ["1000"],
    "work_summary": "从团队关键结果、AE表现、重点客户与商机、跨AE风险原文详细回填的纯文本",
    "work_plan": "从团队行动计划P0/P1/P2原文详细回填的纯文本",
    "work_experience": "从管理复盘适当提炼的纯文本"
  }
}
```

对应命令示例：

```bash
Sharecrm data record create --data '{"object_api_name":"JournalObj","object_data":{"journal_time":"<period_end_yyyyMMdd>","period_type":"weekly","record_type":"default_week__c","owner":["1000"],"comment_by":["1000"],"work_summary":"从团队关键结果、AE表现、重点客户与商机、跨AE风险原文详细回填的纯文本","work_plan":"从团队行动计划P0/P1/P2原文详细回填的纯文本","work_experience":"从管理复盘适当提炼的纯文本"}}'
```

如果当前管理者或当前用户员工 ID 无法确认，不能试错写入，必须先查询或向用户确认。

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
- 不把 HTML 标签、Markdown 表格、完整报表正文、详细版全文或保存确认模块写入 CRM 日志。
- 不主动填写 `create_time`、`created_by`、`last_modified_time`、`last_modified_by` 等系统字段。
- 不主动填写 `comment_status`、`lock_status`、`life_status`，除非用户或系统明确要求。
- 不在面向用户的确认区展示 `name`、`work_summary`、`work_experience`、`work_plan`、`journal_time` 等字段 ApiName。
