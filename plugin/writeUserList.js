/**
 * @author zhaodonghong
 * @fileoverview api  writeFile.js
 * @date 2017/03/03
 */
//公共引用
var fs = require('fs');
var path = require('path');
var isWrited = true;
module.exports = function(data, callback){
	fs.writeFile(path.resolve(__dirname,'./user.json'), data , function (err, data) {
	    if(err) {
	     	isWrited = false;
	    }
	    callback.call(null, isWrited);
	   
	});

}