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
- 针对外部资源(font/image），在head区添加`dns-prefetch`,希望能提高资源加载速度

## views/js/main.js 优化说明

### 滚动性能优化
`updatePositions`方法中的一些做法导致了强制重绘，严重影响性能，主要采取以下几个方法：
- 缓存`items`变量到方法外部，由于`items`元素的数量并没有变化，因此不需要每次都重新查找
-