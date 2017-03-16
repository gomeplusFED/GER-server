/**
 * @author zhaodonghong
 * @fileoverview api user index.js
 * @date 2017/03/03
 */
let logout = require('./logout');
let userlist = require('./userlist');
let getUserInfo = require('./getUserInfo');
let edit = require('./edit');
let deleteUser = require('./delete');
let modPwd = require('./modPwd');


module.exports = [
	{
		router: '/logout',
		type: 'get',
		apiToDo: logout
	},	
	{
		router: '/user/getlist',
		type: 'post',
		apiToDo: userlist
	},
	{
		router: '/user/getUserInfo',
		type: 'post',
		apiToDo: getUserInfo
	},
	{
		router: '/user/edit',
		type: 'post',
		apiToDo: edit
	},
	{
		router: '/user/delete',
		type: 'post',
		apiToDo: deleteUser
	},
	{
		router: '/user/modPwd',
		type: 'post',
		apiToDo: modPwd
	}
]