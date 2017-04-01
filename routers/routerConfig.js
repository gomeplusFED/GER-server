/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */
let userList = require( '../plugin/readUserList' );
module.exports = function ( Router ) {
    let user = [ {
        router: '/index',
        type: 'get'
    }, {
        router: '/user',
        type: 'get'
    }, {
        router: '/user/add',
        type: 'get'
    }, {
        router: '/user/edit',
        type: 'get'
    }, {
        router: '/user/modpwd',
        type: 'get'
    } ];
    let report = [ {
        router: '/report/detail',
        type: 'get'
    }, {
        router: '/report/list',
        type: 'get'
    }, {
        router: '/report',
        type: 'get'
    } ];
    let routers = Array.prototype.concat( user, report );
    routers.forEach( ( v ) => {
        Router[ v.type ]( v.router, function ( req, res ) {

            let data = {
                isLogin: req.session.isLogin,
                isSuper: req.session.isSuper,
                userName: req.session.userName,
                superName: req.session.superName,
                isReaded: false,
                watchUrl: ''
            };
            userList( function ( result ) {
                if ( result.code === 200 ) {
                    data.watchUrl = result.data[ data.userName ].watchUrl.replace( /[/\r|\/n|/\r/\n]/g, '^' );
                    data.isReaded = true;
                    res.render( 'index', data );

                } else {
                    data.isReaded = false;
                }
            } );

        } );
    } );

    return Router;
};