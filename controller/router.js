/* jshint esversion: 6 */
const file = require('../models/file.js');

// 首页
exports.showIndex = function(req, res, next){
	// res.render('index', {
	// 	'albums': getAllalbums()
	// });

	// 以上写法是错误的
	// 因为 nodejs 是异步 I/O
	// 所以内层函数不能用 return 返回数据，而是用回调函数
	// 数据被当做回调函数的参数返回
	file.getAllAlbums(function(err, allAlbums){
		if(err){
			next();
			return;
		}
		res.render('index', {
			'albums': allAlbums
		});
	});
};

// 相册列表页
exports.showAlbum = function(req, res, next){
	var albumName = req.params.albumName;

	file.getAllImagesByAlbumName(albumName, function(err, allImages){
		if(err){
			next();
			return;
		}
		res.render('album', {
			'albumName': albumName,		// 用于显示面包屑
			'images': allImages
		});
	});
};

// 上传页面
exports.showUp = function(req, res, next){
	file.getAllAlbums(function(err, allAlbums){
		if(err){
			next();
			return;
		}
		res.render('upload', {
			'allAlbums': allAlbums
		});
	});
};

// 处理错误
exports.hanldError = function(req, res){
	res.render('error');
};
