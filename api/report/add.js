/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/03
 */
let fs = require('fs');
let path = require('path');
module.exports = function(req, res){
 	let img = fs.createReadStream(path.resolve(__dirname,'../../public/images/read.gif'));
 	img.pipe(res);
};