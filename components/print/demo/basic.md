---
order: 0
title: 基本
---

最简单的用法，printTmpl传入固定dom节点字符串。

设置printTmplState 为 true

````jsx
import { Print, Button } from 'antd';

const content = `<div>
    <p>内容</p>
    <button type="button" class="ant-btn ant-btn-primary">打印</button>
  </div>`;

ReactDOM.render(
  <Print
    printTmpl={content}
    printTmplState
  >
    <Button type="primary">打印</Button>
  </Print>
, mountNode);
````
