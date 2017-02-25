/**
 * @author zhaodonghong
 * @fileoverview routers index.js
 * @date 2017/02/22
 */
var express = require('express');
var userRouters = require('./user');
var errorRouters = require('./error');
var router = express.Router();
var otherRouters = errorRouters.concat(userRouters)
module.exports = [];



function addRouter(path) {
  module.exports.push(require(path)(router));
}
addRouter('./login');
addRouter('./logout');
addRouter('./routerConfig');