import { IChangedTiddlers, IParseTreeNode, IWidgetInitialiseOptions } from 'tiddlywiki';
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
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

  tm_notify(generalNotification: string, message: string) {
    $tw.wiki.addTiddler({ title: `$:/state/notification/${generalNotification}`, text: `${generalNotification}: ${message}` });
    $tw.notifier.display(`$:/state/notification/${generalNotification}`);
  }

  /**
   * getBase64Image
   * @param src img_url
   * @returns "data:image/jpeg;base64,/9..." or ''
   */
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
      xhr.onerror = (err) => {
        resolve('');
        console.log(err);
      };
      xhr.ontimeout = (e) => { e };
      xhr.send();
    }).catch(err => err);
  }

  invokeAction(triggeringWidget, event) {
    // 思路：获取所有img元素并使用base64替换链接，设置他们的跨域属性。最后使用html2canvas拍照。
    NProgress.start();

    const setup = {
      useCORS: true, // 使用跨域
      allowTaint: true
    };

    let tiddler_frame = triggeringWidget.domNode.closest("[role='article']");
    let details = tiddler_frame.querySelector(".kk-utility-details");

    // 拿到所有img元素，整理为列表。
    // 将img链接整理为base64图片在放回去。
    let img_elist = tiddler_frame.querySelectorAll("img");
    let imgArray = Array.from(img_elist);
    // console.log(imgArray);

    Promise.all(imgArray.map((item, index, arr) => {
      // let img_e = document.querySelector("img");
      // img_e.getAttribute("src");
      // console.log(item.getAttribute("src"));
      return this.getBase64Image(item.getAttribute("src"))
    })).then(result => {
      // 返回的图片列表，重新渲染到页面上

      // console.log(result);

      // result、img_elist有同样的索引。
      for (var idex in result) {
        if (result[idex] !== '') {
          img_elist[idex].setAttribute('crossorigin', "anonymous"); // 重点！设置image对象可跨域请求
          img_elist[idex].setAttribute('src', result[idex]);
        }
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
            a.download = `${this.makeTitleSafe(this.getVariable("currentTiddler"))}_${new Date().getTime()}.png`;
            a.click();
            window.URL.revokeObjectURL(url);
            NProgress.done();
          });
        }).catch(err => {
          this.tm_notify("Bomb! html2canvas Error", `\n <font color="#FF0000">${err}</font>`);
          console.error(err);
          NProgress.done(true);
        });
      }

    })
  }

  makeTitleSafe(title) {
    var illegalFilenameCharacters = /<|>|\:|\"|\/|\\|\||\?|\*|\^|\s/g;
    var fixedTitle = $tw.utils.transliterate(title).replace(illegalFilenameCharacters, "_");
    return fixedTitle;
  }

}

exports['tid2png'] = Tid2PngWidget;
