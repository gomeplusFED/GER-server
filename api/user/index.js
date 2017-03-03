/**
 * @author zhaodonghong
 * @fileoverview api user index.js
 * @date 2017/03/03
 */

var logout = require('./logout');

module.exports =  [
	{
		router: '/logout',
		type: 'get',
		apiToDo: logout
	}
]