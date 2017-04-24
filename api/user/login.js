/**
 * @author zhaodonghong
 * @fileoverview api  login.js
 * @date 2017/03/03
 */

let readFile = require( '../../plugin/readFile' );

const doLogin = ( req, res, name, pwd ) => {
    let originUrl = req.body.originUrl;
    readFile( './user.json', (err, data) => {
        if(err){
            res.status( 200 ).json( {
                code: '424',
                message: '读取失败！'
            } );
        }else{
            let user = JSON.parse(data)[ name ];
            if ( user && user.password === pwd ) {
                req.session.userName = name;
                req.session.superName = ( user.child ? name : user.parent );
                req.session.isLogin = true;
                req.session.isSuper = ( user.child ? true : false );
                let url = originUrl ? '/index?originUrl=' + encodeURIComponent( originUrl ) : '/index';
                res.redirect( url );
            } else {
                req.flash( 'errorMsg', '账号或密码无效，请重试！' );
                let url = originUrl ? '/login?originUrl=' + encodeURIComponent( originUrl ) : '/login';
                res.redirect( url );
            }
        } 
    } );

};
module.exports = function ( req, res, next ) {

    if ( req.session.isLogin ) {
        next( '没有权限' );
    } else {
        var reqBody = req.body;
        var name = reqBody.userName;
        var pwd = reqBody.passWord;
        if ( name && pwd ) {
            doLogin( req, res, name, pwd );
        } else {
            req.session.loginError = '账号或密码无效，请重试！';
            res.redirect( '/login' );
        }
    }

};