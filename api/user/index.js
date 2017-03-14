/**
 * @author zhaodonghong
 * @fileoverview api user index.js
 * @date 2017/03/03
 */

var logout = require('./logout');
var userlist = require('./userlist');

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
	}
]