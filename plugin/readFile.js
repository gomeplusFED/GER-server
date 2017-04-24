/**
 * @author zhaodonghong
 * @fileoverview api  getUserList.js
 * @date 2017/03/03
 */
let fs = require('fs');
let path = require('path');
let result = null;
module.exports = function(name, callback){

	let paths = path.resolve(__dirname, name);
	fs.readFile(paths ,'utf-8', function (err, data) {
	    callback.call(null, err, data);
	});
}