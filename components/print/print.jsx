import React, { Component } from 'react';

export default class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iframeShow: false,
      iframeStyle: {
        position: 'absolute',
        top: -999,
        left: -999,
        width: 0,
        height: 0,
        border: 0,
      },
      inPrint: false,
    };
  }
  /**
   * 数据更新时触发函数
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.printTmplState !== prevProps.printTmplState && !! this.props.printTmplState && this.state.inPrint) {
      this.printContent();
    }
  }
  /**
   * 打印方法
   * @param {Node} frameWindow - 调用打印的窗口
   * @param {string} content - 打印内容的dom string片段
   * @return {Promise}
   */
  printFrame = (frameWindow, content) => {
    return new Promise((resolve, reject) => {
      try {
        frameWindow = frameWindow.contentWindow || frameWindow.contentDocument || frameWindow;
        let wdoc = frameWindow.document || frameWindow.contentDocument || frameWindow;
        if (this.props.doctype) {
          wdoc.write(this.props.doctype);
        }
        wdoc.write(content);
        wdoc.close();

        setTimeout(() => {
          // Fix for IE : Allow it to render the iframe
          frameWindow.focus();
          try {
            // Fix for IE11 - printng the whole page instead of the iframe content
            if (!frameWindow.document.execCommand('print', false, null)) {
              // document.execCommand returns false if it failed -http://stackoverflow.com/a/21336448/937891
              frameWindow.print();
            }
          } catch (e) {
            frameWindow.print();
          }
          frameWindow.close();
          resolve();
        }, this.props.timeout);
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * 使用iframe的形式打印内容
   * @param {string} content - 打印内容的dom string片段
   */
  printContentInIFrame = (content) => {
    let frameWindow = this.refs.printIframe;
    this.printFrame(frameWindow, content).then(() => {
      setTimeout(() => {
        // Wait for IE
        // Destroy the iframe if created here
        this.setState({
          iframeShow: false,
          inPrint: false,
        });
      }, 100);
    }, (err) => {
      // Use the pop-up method if iframe fails for some reason
      console.error('Failed to print from iframe', err);
      this.printContentInNewWindow(content);
    });
  }
  /**
   * 使用新开窗口的形式打印内容
   * @param {string} content - 打印内容的dom string片段
   */
  printContentInNewWindow = (content) => {
    let frameWindow = window.open();
    this.printFrame(frameWindow, content).then(() => {
      this.setState({
        iframeShow: false,
        inPrint: false,
      });
      console.log('success');
    });
  }
  /**
   * 按钮触发函数，打印内容，根据配置使用不同的方式触发打印函数
   */
  printContent = () => {
    let content = this.hanlePrintContent();
    if (this.props.iframe) {
      try {
        this.setState({
          iframeShow: this.props.iframe,
        }, () => {
          this.printContentInIFrame(content);
        });
      } catch (e) {
        // Use the pop-up method if iframe fails for some reason
        console.error('Failed to print from iframe', e.stack, e.message);
        this.printContentInNewWindow(content);
      }
    } else {
      // Use a new window for printing
      this.printContentInNewWindow(content);
    }
  }
  /**
   * 处理打印内容
   * @return {String}
   */
  hanlePrintContent = () => {
    let style;
    let link;
    let meta;
    let title;
    let content = this.convertStrToDom(this.props.printTmpl);

    if (this.props.globalStyles) {
      style = document.querySelectorAll('style');
      link = document.querySelectorAll('link');
      meta = document.querySelectorAll('meta');
      title = document.querySelector('title');
    } else if (this.props.mediaPrint) {
      // Apply the media-print stylesheet
      link = document.querySelectorAll('link[media=print]');
    }

    if (this.props.noPrintSelector) {
      let child = content.querySelectorAll(this.props.noPrintSelector);
      Array.prototype.map.call(child, (elem) => {
        elem.parentNode.removeChild(elem);
      });
    }
    this.appendDomList(content, title);
    this.appendDomList(content, meta);
    this.appendDomList(content, link);
    this.appendDomList(content, style);
    if (this.props.printTmplTitle) {
      let ctitle = content.querySelector('title');
      let text = document.createTextNode(this.props.printTmplTitle);
      if (!ctitle) {
        let newTitle = document.createElement('title');
        content.appendChild(newTitle);
      }
      content.querySelector('title').append(text);
    }

    return content.innerHTML;
  }
  /**
   * 向需要打印的dom节点内添加title, meta, link, style等
   * @param {Node} content
   * @param {Node} nodelist
   */
  appendDomList = (content, nodelist) => {
    if (!nodelist) {
      return;
    }
    Array.prototype.map.call(nodelist, (elem) => {
      content.appendChild(elem.cloneNode(true));
    });
  }
  /**
   * 转换dom字符串片段位标准dom节点
   * @param {String} domStr - dom的字符串片段
   */
  convertStrToDom = (domStr) => {
    let wrap = document.createElement('div');
    wrap.innerHTML = domStr;
    return wrap;
  }
  /**
   * 确认打印数据是否完成,调用不同的方式
   */
  isPrintDataComplete = () => {
    this.setState({
      inPrint: true,
    });
    if (this.props.printTmplState) {
      this.printContent();
    } else {
      this.props.hanlerPrintData();
    }
  }

  render() {
    let btn = React.cloneElement(this.props.children, {
      onClick: this.isPrintDataComplete,
    });
    return (
      <div className="zcy-print-wrap">
        {this.state.iframeShow && <iframe ref="printIframe" style={{ ...this.state.iframeStyle }} ></iframe>}
        {btn}
      </div>
    );
  }
}

Print.propTypes = {
  globalStyles: React.PropTypes.bool,
  mediaPrint: React.PropTypes.bool,
  noPrintSelector: React.PropTypes.string,
  manuallyCopyFormValues: React.PropTypes.bool,
  timeout: React.PropTypes.number,
  iframe: React.PropTypes.bool,
  printTmpl: React.PropTypes.string.isRequired,
  printTmplState: React.PropTypes.bool.isRequired,
  printTmplTitle: React.PropTypes.string,
  hanlerPrintData: React.PropTypes.func,
};

Print.defaultProps = {
  globalStyles: true,
  mediaPrint: false,
  stylesheet: null,
  noPrintSelector: '.no-print',
  iframe: true,
  doctype: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
  timeout: 250,
  printTmplTitle: null,
  //  以下属性 开发中
  append: null,
  prepend: null,
  manuallyCopyFormValues: true,
};
