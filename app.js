/* jshint esversion: 6 */
const express = require('express');
const app = express();

// 控制器
const router = require('./controller/router.js');

// 设置模板引擎
app.set('views', './views');
app.set('view engine', 'ejs');

// 路由中间件，托管静态页面
app.use(express.static('./public'));
app.use(express.static('./uploads'));

// 首页
app.get('/', router.showIndex);
// 相册列表页
app.get('/:albumName', router.showAlbum);
// 上传页面
app.get('/up', router.showUp);
app.post('/up', function(req, res){

});

// 404 页面
app.use(router.hanldError);

// 监听 8080 端口
app.listen(8080);
