/**
 * @author zhaodonghong
 * @fileoverview api user index.js
 * @date 2017/03/03
 */

var logout = require('./logout');
var userlist = require('./userlist');
var getUserInfo = require('./getUserInfo');
var edit = require('./edit');
var deleteUser = require('./delete');

module.exports =  [
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
	}
]