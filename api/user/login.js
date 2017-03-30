/**
 * @author zhaodonghong
 * @fileoverview api  login.js
 * @date 2017/03/03
 */

let userList = require( '../../plugin/readUserList' );

const doLogin = ( req, res, name, pwd ) => {
    userList( ( data ) => {
        if ( data.code === 200 ) {
            let user = data.data[ name ];
            if ( user && user.password === pwd ) {
                req.session.userName = name;
                req.session.superName = ( user.child ? name : user.parent );
                req.session.isLogin = true;
                req.session.isSuper = ( user.child ? true : false );
                res.redirect( '/index' );
            } else {
                req.flash( 'errorMsg', '账号或密码无效，请重试！' );
                res.redirect( '/login' );
            }
        } else {
            res.status( 200 ).json( {
                code: '424',
                message: '读取失败！'
            } );
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
            /*if( userList[name] && userList[name].password === pwd ){
            	req.session.userName = name;
            	req.session.isLogin = true;
            	req.session.character = userList[name].character;
            	res.redirect('/index');


            }else{
            	req.flash('errorMsg', '账号或密码无效，请重试！');
            	res.redirect('/login');
            }*/
        } else {
            req.session.loginError = '账号或密码无效，请重试！';
            res.redirect( '/login' );
        }
    }

};