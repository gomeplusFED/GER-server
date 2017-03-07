/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/03
 */

var fs = require('fs');
var path = require('path');

module.exports = function(req, res){
 	var img = fs.createReadStream(path.resolve(__dirname,'../../public/images/read.gif'));
 	
 	//res.json(req.query);
 	//do  something
 	img.pipe(res);
}