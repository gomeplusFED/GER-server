/**
 * @author zhaodonghong
 * @fileoverview api report index.js
 * @date 2017/03/03
 */
let getAll = require('./getAll');

module.exports = [
	{
		router: '/report/getAll',
		type: 'get',
		apiToDo: getAll
	}
]