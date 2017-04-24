/**
 * @author zhaodonghong
 * @fileoverview api  writeFile.js
 * @date 2017/03/03
 */
let fs = require('fs');
let path = require('path');
let result = null;
module.exports = function(name, data, callback){
	fs.writeFile(path.resolve(__dirname, name), data , function (err, data) {
	    if(err) {
	    	result = {
	    		message: err,
	    		code: 424
	    	}
	    }else{
	    	result = {
	    		message: '写入成功!',
	    		code: 200,
	    		data: true
	    	}
	    }
	    callback.call(null, result);
	});
}