/**
 * @author zhaodonghong
 * @fileoverview api  login.js
 * @date 2017/03/03
 */
//公共引用
var userList = require('../../plugin/readUserList');
module.exports = function(req, res, next){
	var userName = req.body.userName;
	var page = parseInt(req.body.page, 10);
	var size = req.body.size || 10;
	userList(function(){
		var list = this[userName].child;
		var pageSize = Math.ceil(list.length / size );
		if( pageSize >= page ){
			res.status(200).json(list.slice((page-1)*size, size * page) || []);
		}else{
			res.status(200).json(list.slice((pageSize-1)*size, size * pageSize));
		}
	});
	
	
}