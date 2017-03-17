/**
 * @author zhaodonghong
 * @fileoverview api report index.js
 * @date 2017/03/03
 */

var getAll = require('./getAll');
var contains = require('./contains');

module.exports =  [
	{
		router: '/report/getAll',
		type: 'get',
		apiToDo: getAll
	},
	{
		router: '/report/contains',
		type: 'get',
		apiToDo: contains
	}
	/*,{
		router: '/user',
		type: 'get'
	},{
		router: '/user/add',
		type: 'get'
	},{
		router: '/user/edit',
		type: 'get'
	},{
		router: '/user/modpwd',
		type: 'get'
	}*/
]