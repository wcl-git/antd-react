---
order: 2
title: 使用模版
---

使用webpack所带handlebars-loader进行模版数据和数据整合

整合后设置printTmpl，并设置printTmplState为true打印模版

````jsx
import { Print, Button } from 'antd';
let test = require('./test.hbs');

let MyPrint = React.createClass({
  getInitialState() {
    return {
      printTmpl: '',
      printTmplState: false,
    };
  },
  hanlerPrintData() {
    setTimeout(() => {
      let tmp = test({
        username: 'bob',
        content: 'test',
      });
      this.setState({
        printTmpl: tmp,
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
