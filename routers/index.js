/**
 * @author zhaodonghong
 * @fileoverview routers index.js
 * @date 2017/02/22
 */
let express = require( 'express' );
let login = require( './login' );
let other = require( './routerConfig' );
let Router = express.Router();

module.exports = [ login( Router ), other( Router ) ];