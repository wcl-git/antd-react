---
order: 1
title: 异步请求
---

异步的用法，printTmpl设置初始值为空，设置printTmplState为false，设置hanlerPrintData为异步请求封装数据函数。

当完成异步请求时，通过setState设置printTmpl，并设置printTmplState为true，组件调用数据进行打印。

````jsx
import { Print, Button } from 'antd';

let MyPrint = React.createClass({
  getInitialState() {
    return {
      printTmpl: '',
      printTmplState: false,
    };
  },
  hanlerPrintData() {
    setTimeout(() => {
      this.setState({
        printTmpl: `<div>
                      <p>内容</p>
                      <button type="button" class="ant-btn ant-btn-primary">打印</button>
                    </div>`,
        printTmplState: true,
      });
    }, 2000);
  },
  render() {
    return (
      <Print
        printTmpl={this.state.printTmpl}
        printTmplState={this.state.printTmplState}
        hanlerPrintData={this.hanlerPrintData}
      >
        <Button type="primary">异步打印</Button>
      </Print>
    );
  },
});

ReactDOM.render(
  <MyPrint />
, mountNode);
````
