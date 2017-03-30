/**
 * @author zhaodonghong
 * @fileoverview routers index.js
 * @date 2017/02/22
 */


let express = require( 'express' );
let add = require( './report/add' );
let login = require( './user/login' );
let Router = express.Router();
module.exports = function () {
    let api = [ {
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
    api.forEach( ( v ) => {
        Router[ v.type ]( v.router, function ( req, res, next ) {
            v.apiToDo( req, res, next );
        } );
    } );
    return Router;
};