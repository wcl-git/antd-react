---
category: Components
chinese: 打印
type: Other
english: Print
---

点击元素，调用浏览器打印功能打印需求模版

## 何时使用

需要打印固定dom节点或模版。

## API


| 成员        | 说明           | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| printTmpl       | 所要打印的模版片段(必填)             | String  |   无   |
| printTmplState  | 模版状态(是否为可打印状态)(必填)      | Bool    |   无   |
| hanlerPrintData | 模版在不可打印状态时所要触发的模版数据获取整合方法  | Function |  无  |
| printTmplTitle  | 打印模版的title                    | String    |   无   |
| iframe          | 是否使用插入iframe的方式触法打印时间     | Bool     |   true   |
| noPrintSelector | 模版内不需要打印的内容的选择器(id或者class)     | String     |   '.no-print'   |
| timeout         | 解决IE兼容性所需的setTimeout时间(不建议修改)  | Number |  250  |
| 开发中           |  ------                              |   -------  |  ----  |