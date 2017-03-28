/**
 * @author zhaodonghong
 * @fileoverview api user/edit.js
 * @date 2017/03/03
 */

let userList = require('../../plugin/readUserList');
let editUserList = require('../../plugin/writeUserList');
module.exports = function(req, res){
	let body = req.body;
	let userName = body.userName;
	let password = body.pwd;
	let users = '';
	userList(function( result ){
		if( result.code === 200 ){
			users = result.data;
			users[userName].password = password;
		}else{
			res.status(200).json({
				code: 424,
				message: '文件读取失败，请重试！'
			});
		}
		editUserList( JSON.stringify(users), (response)=>{
			if( response.code === 200 ){
				res.status(200).json({
					code: 200,
					message: '成功！'
				});
			}else{
				res.status(200).json({
					code: 424,
					message: '失败！'
				});
			}
		});
	});
};

