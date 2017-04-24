/**
 * @author zhaodonghong
 * @fileoverview routers index.js
 * @date 2017/02/22
 */


let express = require( 'express' );
let login = require( './user/login' );
let version = require('./public/version');
let Router = express.Router();
module.exports = function () {
    let api = [ {
        router: '/login',
        type: 'post',
        apiToDo: login
    },
    {
        router: '/version',
        type: 'get',
        apiToDo: version
    } ];
    api.forEach( ( v ) => {
        Router[ v.type ]( v.router, function ( req, res, next ) {
            v.apiToDo( req, res, next );
        } );
    } );
    return Router;
};