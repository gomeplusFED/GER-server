/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */

var request = require( 'request' );
module.exports = function ( req ) {
    request.post( 'http://127.0.0.1:8888/report/getAll', {
        form: {
            page: req.query.page === undefined ? 0 : req.query.page
        },
        json: true
    }, function ( err, resp, body ) {
        console.log( body );
    } );
};