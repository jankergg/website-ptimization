# 项目说明
本项目通过使用`gulp`工具，结合相关插件完成对网页的自动优化，如内联必要的css/js文件，代码压缩等等，以达到优化页面加载的目的。


## 项目运行方法

- 克隆本项目，进入根目录下，运行 `npm install`
- 运行打包命令 `npm run build` 生成打包后的代码(主要是index.html)到 `dist`目录
- 运行命令 `npm start` 开启本地开发环境，在浏览器输入 `http://127.0.0.1:8000`查看效果
- 进行`pageSpeed`测试需要用到 `ngrok` 具体使用方法可以参考[这里](https://dashboard.ngrok.com/get-started)

## 首页index.html 优化说明

- 下载谷歌字体css文件到本地，并使用`gulp-inline-source`插件内联进index.html
- `style.css`: 使用`gulp-inline-source`插件内联进index.html
- `print.css`: 添加属性 `media="print"` 防止阻塞页面加载
- `analytics.js`:添加`async`属性 防止阻塞页面加载
- `perfmatters.js`:使用`gulp-inline-source`插件内联进index.html
- 使用`gulp-htmlmin`插件进一步压缩html体积
- 最后`index.html`会输出到`dist`目录下
- 针对外部资源(font/image），在head区添加`dns-prefetch`,希望能提高资源加载速度
- 说明：在`link/script`标签中添加`inline`属性可以让`gulp-inline-source`插件识别出哪些资源需要被内联进html中。

## views/js/main.js 优化说明

### 滚动性能优化
`updatePositions`方法中的一些做法导致了强制重绘，严重影响性能，主要采取以下几个方法：
- 缓存`items`变量到方法外部，由于`items`元素的数量并没有变化，因此不需要每次都重新查找,将`scrollTop`值放进变量`sct`并默认为0，这次能减少首次渲染时的强制重绘。
- `items[i].style.left` 改为 `items[i].style.transform` 提高动画性能
- `DOMContentLoaded`事件中添加图片的做法会导致大量的浏览器布局重绘，并且一次性添加200个图片数量太多，减少到50个比较合适。优化做法是：以字符串形式将图片保存到数组`imgs`中，最后一次性添加到页面中，采用 `document.querySelector("#movingPizzas1").innerHTML = imgs.join('')`

### 调整pizza尺寸 优化说明
- 将多次复用的 `randomPizzas`元素缓存到变量`pizzasDiv`中去。
- 舍弃`determineDx`方法，直接在 `changePizzaSizes`方法中,通过给 `pizzasDiv`设置不同的样式名，达到控制`randomPizzaContainer`宽度百分比的目的。为达成这个目的，需要在`style.css`中新增样式：
```
.smallSize .randomPizzaContainer{
  width:25%;
}
.middleSize .randomPizzaContainer{
  width:33.33%;
}
.bigSize .randomPizzaContainer{
  width:50%;
}
```
- 页面初始化过程中，通过`for`循环来添加pizza的做法导致严重的渲染性能问题（这与添加maker时遇到的问题一样）原代码：
```
for (var i = 2; i < 100; i++) {
  var pizzasDiv = document.getElementById("randomPizzas");
  pizzasDiv.appendChild(pizzaElementGenerator(i));
}
```
`pizzasDiv`变量已经提取出来放到外面，为了减少dom操作次数，这里采用的做法是通过`document.createDocumentFragment()`创建一个文档片段，将生成的pizza元素放入其中，最后再一次性添加到页面中：
```
var randompizzasFrag = document.createDocumentFragment();
for (var i = 2; i < 100; i++) {
    randompizzasFrag.appendChild(pizzaElementGenerator(i))
}
pizzasDiv.appendChild(randompizzasFrag);
```
