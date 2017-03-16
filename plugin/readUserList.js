/**
 * @author zhaodonghong
 * @fileoverview api  getUserList.js
 * @date 2017/03/03
 */
let fs = require('fs');
let path = require('path');
let result = null;
module.exports = function(callback){
	fs.readFile(path.resolve(__dirname,'./user.json'),'utf-8', function (err, data) {
	    if(err) {
	    	result = {
	    		message: err,
	    		code: 424
	    	}
	    }else{
	    	result = {
	    		message: '读取成功!',
	    		code: 200,
	    		data: JSON.parse(data)
	    	}
	    }
	    callback.call(null, result);
	});
}