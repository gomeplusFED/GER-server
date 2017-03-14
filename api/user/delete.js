/**
 * @author zhaodonghong
 * @fileoverview api user/edit.js
 * @date 2017/03/03
 */
var userList = require('../../plugin/readUserList');
var editUserList = require('../../plugin/writeUserList');
module.exports = function(req, res, next){
	var data = req.body;
	var userName = data.userName;
	var superName = data.superName;
	userList(function(){
		var lists = this;
		var childList = lists[superName].child;
		var index = null;
		for(var i = 0, len = childList.length; i < len; i++){
			if(childList[i].name === userName){
				childList.splice(i,1);
				break;
			}
		}
		
		editUserList( JSON.stringify(lists), (isWrited)=>{
			res.status(200).json({
				code: isWrited ? 200 : 503,
				message: isWrited? '成功' : '失败'
			})
		});
	});
	
	
}

