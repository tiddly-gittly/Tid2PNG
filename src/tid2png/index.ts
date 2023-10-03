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

  getBase64Image(src) {
    return new Promise(resolve => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', src, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (this.status == 200) {
          let blob = this.response;
          let oFileReader = new FileReader();
          oFileReader.onloadend = (e) => {
            const base64 = e.target.result;
            resolve(base64);
          }
          oFileReader.readAsDataURL(blob);
        }
      }
      xhr.send();
    })
  }

  invokeAction(triggeringWidget, event) {
    const setup = {
      useCORS: true, // 使用跨域
      allowTaint: true
    };
    
    let tiddler_frame = triggeringWidget.domNode.closest("[role='article']");
    let details = tiddler_frame.querySelector(".kk-utility-details");
    // html2canvas 无法渲染网络图片 

    // 拿到所有img元素，整理为列表。
    // 将img链接整理为base64图片在放回去。
    let img_elist = tiddler_frame.querySelectorAll("img");
    let imgArray = Array.from(img_elist);
    // console.log(imgArray);
    // pamoise 初始化请求图片

    Promise.all(imgArray.map((item, index, arr) => {
      // let img_e = document.querySelector("img");
      // img_e.getAttribute("src");
      // console.log(item.getAttribute("src"));
      return this.getBase64Image(item.getAttribute("src"))
    })).then(result => {
      // 返回的图片列表，重新渲染到页面上

      console.log(result);

      for (var idex in result) {
        img_elist[idex].setAttribute('crossorigin', "anonymous"); // 重点！设置image对象可跨域请求
        img_elist[idex].setAttribute('src', result[idex]);
      }

      console.log(img_elist);

      if (details) {
        details.hidden = true;
      }

      if (tiddler_frame) {
        html2canvas(tiddler_frame, setup).then((canvas) => {
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

    })
  }
}

exports['tid2png'] = Tid2PngWidget;
