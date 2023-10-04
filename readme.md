# Tid2PNG

条目截图 （Screenshot Tiddler）: Captures the currentTiddler as a PNG image

最佳使用方法是将 截图按钮 放在“查看工具栏”，即默认方式，这样拍照的时候就不会因为“乱动”而照片模糊。（或者实现几种辅助“拍照”工具，比如快捷键、悬浮菜单等等）

## Read Me

Usage: Click the icon on the Tiddler toolbar to Captures the currentTiddler as a PNG image.

## Credits

* [tiddly-gittly/Modern.TiddlyDev](https://github.com/tiddly-gittly/Modern.TiddlyDev)
* [niklasvh/html2canvas](https://github.com/niklasvh/html2canvas)

使用pnpm包管理器

## Contributors

* dongrentianyu: https://github.com/dongrentianyu
* WhiteFall: https://github.com/Zacharia2
* FSpark: https://github.com/FSpark

<img width=145 src="https://img.thosefree.com/wp-content/uploads/2020/09/html2canvas-cover.jpg&720x405.jpg">

实现原理：通过捕获当前条目的DOM状态，对它进行“拍照”处理获得图像文件（照片），然后保存下来。

注意：水平分割线height不应小于1px或更高，否则会导致异常（在CanvasRenderingContext2D上执行'drawImage'失败:image参数是一个宽度或高度为0的canvas元素;）。