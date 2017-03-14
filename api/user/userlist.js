/**
 * @author zhaodonghong
 * @fileoverview api  login.js
 * @date 2017/03/03
 */
//公共引用
var fs = require('fs');
var path = require('path');
module.exports = function(req, res, next){
	var userName = req.body.userName;
	fs.readFile(path.resolve(__dirname,'../../plugin/index.js'),'utf-8', function (err, data) {
	    if(err) {
	     	console.error(err);
	     	return;
	    }else{
	    	var list = JSON.parse(data);
	    	res.status(200).json(list[userName].child || []);
	    }
	});

}