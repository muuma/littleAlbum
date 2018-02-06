/* jshint esversion: 6 */
const file = require('../models/file.js');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const md5 = require('md5');

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

// 上传功能
exports.upLoads = function(req, res, next){
	if(req.url == '/up' && req.method.toUpperCase() == 'POST'){
		// 创建一个表单
		var form = new formidable.IncomingForm();
		// 设置多文件上传
		// form.multiples = true;
		// 配置临时上传路径
		form.uploadDir = path.normalize(__dirname + '/../tmp/');
		// 解析文件内容
		form.parse(req, function(err, fields, files, next){
			if(err){
				next();
				return;
			}
			// 限制文件尺寸，小于 2M
			var size = parseInt(files[i].image_input.size / 1024);
			if(size > 2048){
				res.send('图片尺寸应小于2M');
				// 删除图片
				fs.unlink(files[i].image_input.path);
				return;
			}
			// 时间戳
			var timestamp = new Date().getTime() + '';
			// 5 位随机数
			var randnum = parseInt(Math.random() * 89999 + 10000) + '';
			// 重命名
			var tarname = md5(timestamp + randnum);
			// 图片扩展名
			var extname = path.extname(files[i].image_input.name);
			// 上传目录
			var albumname = fields.album_name;
			// 临时上传路径
			var tmppath = files[i].image_input.path;
			// 最终上传路径
			var tarpath = path.normalize(__dirname + '/../uploads/' + albumname + '/' + tarname + extname);
			// 改名
			fs.rename(tmppath, tarpath, function(err){
				if(err){
					res.send('改名失败');
					return;
				}
				res.send('成功');
			});
		});
		return;
	}
};

// 处理错误
exports.hanldError = function(req, res){
	res.render('error');
};
