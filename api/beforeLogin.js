/**
 * @author zhaodonghong
 * @fileoverview routers index.js
 * @date 2017/02/22
 */



var express = require('express');


var Router = express.Router();
var add = require('./report/add');
var login = require('./user/login');


module.exports = function addRouter(){
	let api = [
		{
			router: '/report/add',
			type: 'get',
			apiToDo: add
		},
		{
			router: '/login',
			type: 'post',
			apiToDo: login
		}
	];
	api.forEach((v)=>{
		Router[v.type](v.router, function(req, res, next){
			v.apiToDo(req, res, next);
		});
	});
	return Router;
}




