/**
 * @author zhaodonghong
 * @fileoverview api report index.js
 * @date 2017/03/03
 */
var getAll = require('./getAll');
var contains = require('./contains');
var list = require('./list');
var demo = require('./test');
var detail = require('./getDetail');

module.exports =  [
	{
		router: '/report/getAll',
		type: 'post',
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
		apiToDo: demo
	},
	{
		router: '/report/list',
		type: 'post',
		apiToDo: list
	},
	{
		router: '/report/getDetail',
		type: 'post',
		apiToDo: detail
	}
];