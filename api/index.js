/**
 * @author zhaodonghong
 * @fileoverview api index.js
 * @date 2017/03/03
 */
let express = require('express');
let user = require('./user');
let report = require('./report');
let elasticsearch = require('elasticsearch');

let Router = express.Router();
let client = new elasticsearch.Client({
    //host: '10.125.137.44:9200',  //线上
    host: '10.69.205.21:9201',   //pre
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
}