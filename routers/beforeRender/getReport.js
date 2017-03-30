/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */

let userList = require( '../../plugin/readUserList' );
module.exports = function ( req, res, data ) {
    var userName = data.userName;
    var watch = {
        isReaded: true,
        watchUrl: ''
    };
    userList( function ( result ) {
        if ( result.code === 200 ) {
            watch.watchUrl = result.data[ userName ].watchUrl.replace( /[/\r|\/n|/\r/\n]/g, '^' );
        } else {
            watch.isReaded = false;
        }
        let resData = Object.assign( data, watch );
        res.render( 'index', resData );
    } );
};