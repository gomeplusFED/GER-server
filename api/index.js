/**
 * @author zhaodonghong
 * @fileoverview api index.js
 * @date 2017/03/03
 */


var express = require('express');
var Router = express.Router();
var user = require('./user');
var report = require('./report');
module.exports = function(){
	let api = Array.prototype.concat( user, report );
	api.forEach((v)=>{
		Router[v.type](v.router, function(req,res){
			v.apiToDo(req,res);
		});
	});
	return Router;
};