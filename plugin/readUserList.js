/**
 * @author zhaodonghong
 * @fileoverview api  getUserList.js
 * @date 2017/03/03
 */
//公共引用
var fs = require('fs');
var path = require('path');
var list = null;
module.exports = function(callback){
	fs.readFile(path.resolve(__dirname,'./user.json'),'utf-8', function (err, data) {
	    if(err) {
	     	console.error(err);
	     	return;
	    }else{
	    	list = JSON.parse(data);
	    }
	    callback.call(list);
	});

}