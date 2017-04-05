/**
 * @author zhaodonghong
 * @fileoverview api index.js
 * @date 2017/03/03
 */
let express = require( 'express' );
let user = require( './user' );
let report = require( './report' );
let elasticsearch = require( 'elasticsearch' );
let config = require( '../config.js' );

let Router = express.Router();
let client = new elasticsearch.Client( config.elasticsearch );
module.exports = function () {
    let api = Array.prototype.concat( user, report );
    api.forEach( ( v ) => {
        Router[ v.type ]( v.router, function ( req, res ) {
            v.apiToDo.call( client, req, res );
        } );
    } );
    return Router;
};