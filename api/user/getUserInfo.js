/**
 * @author zhaodonghong
 * @fileoverview api  login.js
 * @date 2017/03/03
 */
//公共引用
var userList = require('../../plugin/readUserList');
module.exports = function(req, res, next){
	var userName = req.body.userName;
	var superName = req.body.superName;
	userList(function(){
		var list = this[superName].child;
		var hasUser = false;
		var pwd = '';
		var watchUrl = [];
		for(var i = 0, len = list.length; i < len; i++){
			if(list[i].name === userName){
				hasUser = true;
				pwd = list[i].password;
				watchUrl = list[i].watchUrl;
				break;	
			}
		}
		if( hasUser ){
			res.status(200).json({
				pwd: pwd,
				watchUrl: watchUrl,
				code: 200,
				messsage: '获取成功'
			});
		}else{
			res.status(200).json({
				code: 404,
				pwd: '',
				watchUrl: watchUrl,
				messsage: '查无此人'
			});
		}
		
	});
	
	
}

