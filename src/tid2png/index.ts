import { IChangedTiddlers, IParseTreeNode, IWidgetInitialiseOptions } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
const html2canvas = require('$:/plugins/FSpark/tid2png/html2canvas.min.js');

class Tid2PngWidget extends Widget {
    // 返回的值代表是否刷新了，用于为上层微件参考
    refresh(changedTiddlers: IChangedTiddlers): boolean {
    return false;
  }

  render(parentNode: Node, nextSibling: Node) {
    this.parentDomNode = parentNode;
    this.execute();
    this.renderChildren(parentNode, nextSibling);
  }

  invokeAction(triggeringWidget, event) {
    const setup = {
      useCORS: true, // 使用跨域
    };

    let tiddler_frame = triggeringWidget.domNode.closest("[role='article']");
    let details = tiddler_frame.querySelector(".kk-utility-details");

    if (details) {
      details.hidden = true;
    }

    // html2canvas 无法渲染网络图片 

    if (tiddler_frame, setup) {
      html2canvas(tiddler_frame).then((canvas) => {
        canvas.toBlob((blob) => {
          if (details) {
            details.hidden = false;
          }
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

exports['tid2png'] = Tid2PngWidget;
