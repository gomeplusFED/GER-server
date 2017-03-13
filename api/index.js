/**
 * @author zhaodonghong
 * @fileoverview api index.js
 * @date 2017/03/03
 */


var express = require('express');
var Router = express.Router();
var user = require('./user');
var report = require('./report');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '10.125.137.44:9200',
    log: 'error'
});
module.exports = function(){
	let api = Array.prototype.concat( user, report );
	api.forEach((v)=>{
		Router[v.type](v.router, function(req,res){
			v.apiToDo.call(client,req,res);
		});
	});
	return Router;
};