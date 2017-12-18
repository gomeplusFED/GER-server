/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */
let readFile = require( '../plugin/readFile' );
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
    } , {
      router: '/reportSummary',
      type: 'get'
    }];
    let routers = Array.prototype.concat( user, report );
    routers.forEach( ( v ) => {
        Router[ v.type ]( v.router, function ( req, res ) {
            
            let data = {
                isLogin: req.session.isLogin,
                isSuper: req.session.isSuper,
                userName: req.session.userName,
                superName: req.session.superName,
                isReaded: false,
                watchUrl: '',
                version: +new Date()
            };
            readFile( './user.json', (err, userData ) => {
                if( err ){
                    data.isReaded = false;
                }else{
                    readFile('./version.json', (error, versionDate) => {
                        if(error){
                            data.version = +new Date();
                        }else{
                            data.version = versionDate;
                        }

                        let result = JSON.parse(userData);
                        data.watchUrl = result[ data.userName ].watchUrl.replace( /[\r\n]/g, '^' );
                        data.isReaded = true;
                        res.render( 'index', data );
                    });
                }
            } );

        } );
    } );

    return Router;
};