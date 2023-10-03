import { IChangedTiddlers, IParseTreeNode, IWidgetInitialiseOptions } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
const html2canvas = require('$:/plugins/whitefall/tid2png/html2canvas.min.js');

class Tid2PngWidget extends Widget {
  private title?: string;

  // 返回的值代表是否刷新了，用于为上层微件参考
  refresh(changedTiddlers: IChangedTiddlers): boolean {
    // 更新参数，找出哪些参数改变了
    const changedAttributes = this.computeAttributes();
    if (changedAttributes.title) {
      this.refreshSelf();
      return true;
    }
  }

  /** 可选，一般是在正式渲染之前做一些参数解析等工作 */
  execute() {
    this.title = this.getAttribute("title", this.getVariable("currentTiddler"));
    // this.title = this.getAttribute("title");
  }

  /** 只会在首次渲染、销毁后重新渲染时自动调用，或者通过 refreshSelf 等方法主动调用 */
  render(parentNode: Node, nextSibling: Node) {
    // 渲染预处理工作
    this.parentDomNode = parentNode;
    this.execute();

    const setup = {
      useCORS: true, // 使用跨域
    };

    const tiddler_dom = this.document.querySelector(`[data-tiddler-title="${this.title}"]`);
    const details = this.document.querySelector(".kk-utility-details");
    if (details) {
      details.hidden = true;
    }

    if (tiddler_dom) {
      html2canvas(tiddler_dom, setup).then((canvas) => {
        // <img src="data:image/png;base64,.......">
        // 异步，就是这个代码块和外面的代码块的执行时间不同，
        // 是两个时间的代码块（插队？）时空代码块，好酷的名字。
        const png_src = canvas.toDataURL("image/png");
        const png = $tw.utils.domMaker('img', { alt: "img" });
        png.setAttribute("src", png_src);
        console.log(png);
        this.parentDomNode.appendChild(png);
        if (details) {
          details.hidden = false;
        }
      });
    }
  }
}



exports['tid2png'] = Tid2PngWidget;
