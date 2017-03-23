/**
 * @author zhaodonghong
 * @fileoverview api report index.js
 * @date 2017/03/03
 */
var getAll = require('./getAll');
var contains = require('./contains');
var test = require('./test');

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
	},
	{
		router: '/report/test',
		type: 'get',
		apiToDo: test
	}
]