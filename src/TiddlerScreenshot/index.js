const Widget = require('$:/core/modules/widgets/widget.js').widget;
const html2canvas = require('$:/plugins/FSpark/TiddlerScreenshot/html2canvas.min.js');

class TScreenshotWidget extends Widget {
  refresh(changedTiddlers) {
    return false;
  }

  render(parent, _nextSibling) {
    this.parentDomNode = parent;
    this.execute();
    this.renderChildren(parent, _nextSibling);
  }

  invokeAction(triggeringWidget, event) {
    let tiddlerFrame = triggeringWidget.domNode.closest("[role='article']");
    // 选择 kk-utility-details 元素
    // 声明变量 获取元素并赋值
    let tiddlerDiv = triggeringWidget.domNode.closest("[role='article']");
    const details = tiddlerDiv.querySelector(".kk-utility-details");

    const style = details.getAttribute('style');

    details.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '\n\n' + details.innerHTML;

    details.setAttribute('style', style);

    if (tiddlerFrame) {
      html2canvas(tiddlerFrame).then((canvas) => {
        canvas.toBlob((blob) => {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = `${this.getVariable("currentTiddler")}-${new Date().getTime()}.png`;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    }
  }
}

exports.tiddlerscreenshot = TScreenshotWidget;
