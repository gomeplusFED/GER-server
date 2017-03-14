/**
 * @author zhaodonghong
 * @fileoverview api user/edit.js
 * @date 2017/03/03
 */
var userList = require('../../plugin/readUserList');
var editUserList = require('../../plugin/writeUserList');
module.exports = function(req, res, next){
	var data = req.body;
	console.log(JSON.stringify(data));
	var userName = data.userName;
	var superName = data.superName;
	var createTime = data.createTime;
	var pwd = data.pwd;
	var watchUrl = data.watchUrl;
	var noneChild = true;
	userList(function(){
		///新增未做去重判断
		var lists = this;
		lists[superName].child = lists[superName].child || [];
		var childList = lists[superName].child;
		for(var i = 0, len = childList.length; i < len; i++){
				if(childList[i].name === userName){
					childList[i].password = pwd;
					childList[i].watchUrl = watchUrl;
					noneChild = false;
				break;
			}
		}
		if( noneChild ){
			childList.push({
				password: pwd,
				time: createTime,
				name: userName,
				watchUrl: watchUrl
			})
		}
		editUserList( JSON.stringify(lists), (isWrited)=>{
			res.status(200).json({
				code: isWrited ? 200 : 503,
				message: isWrited? '成功' : '失败'
			})
		});
	});
	
	
}

