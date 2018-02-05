/* jshint esversion: 6 */
const fs = require('fs');

// 这个函数的 callback 有两个参数，一个是 err
// 一个是存放所有相册名的 array
exports.getAllAlbums = function(callback){
	fs.readdir('./uploads', function(err, files){
		if(err){
			callback('No uploads directory.', null);
			return;
		}
		var allAlbums = [];
		// 遍历 uploads 下的 files
		// 迭代器
		(function iterator(i){
			if(i == files.length){
				// 遍历结束
				callback(null, allAlbums);
				return;
			}
			fs.stat('./uploads/' + files[i], function(err, stats){
				if(err){
					callback('Not found ' + files[i], null);
					return;
				}
				if(stats.isDirectory()){
					allAlbums.push(files[i]);
				}
				// 递归调用
				iterator(++i);
			});
		})(0);
	});
};

// 通过相册名称获取所有图片
exports.getAllImagesByAlbumName = function(albumName, callback){
	fs.readdir('./uploads/' + albumName, function(err, files){
		if(err){
			callback('No ' + albumName + 'directory.', null);
			return;
		}
		var allImages = [];
		(function iterator(i){
			if(i == files.length){
				callback(null, allImages);
				return;
			}
			fs.stat('./uploads/' + albumName + '/' + files[i], function(err, stats){
				if(err){
					callback('Not found ' + files[i], null);
					return;
				}
				if(stats.isFile()){
					allImages.push(files[i]);
				}
				iterator(++i);
			});
		})(0);
	});
};
