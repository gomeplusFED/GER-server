/**
 * @author zhaodonghong
 * @fileoverview api  getUserInfo.js
 * @date 2017/03/03
 */

let userList = require('../../plugin/readUserList');
module.exports= function( req, res ){
	let userName = req.body.userName;
	userList(function(result){
		let users = result.data;
		
		//获取子账号
		if( users[userName] ){
			res.status(200).json({
				code: 200,
				messsage: '获取成功',
				data: users[userName]
			});
		}else{
			res.status(200).json({
				code: 424,
				messsage: '查无此人'
			});
		}
		
	});
	
	
}

