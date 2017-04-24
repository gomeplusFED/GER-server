/**
 * @author zhaodonghong
 * @fileoverview api user/edit.js
 * @date 2017/03/03
 */
let dateFormat = require('dateformat');
let userList = require( '../../plugin/readFile' );
let editFile = require( '../../plugin/writeFile' );
module.exports = function ( req, res ) {
    let body = req.body;
    let userName = body.userName;
    let superName = body.superName;
    let password = body.pwd;
    let watchUrl = body.watchUrl;
    let type = body.type;
    //superName === userName  //编辑管理员
    //superName !== usserName //编辑子账号
    userList( './user.json',( err, data ) => {
        if( err ){
            
            res.status( 200 ).json( {
                code: 424,
                message: '失败！'
            } );
        }else{
            
            let users = JSON.parse(data);
            if ( type === 'edit' ) {
                //编辑子账号
                users[ userName ].password = password;
                users[ userName ].watchUrl = watchUrl;
            } else if ( type === 'add' ) {
                //新建子账号
                if ( users[ userName ] ) {
                    res.status( 200 ).json( {
                        code: 409,
                        message: '用户名已存在'
                    } );
                } else {
                    users[ superName ].child.push( userName );
                    users[ userName ] = {
                        name: userName,
                        password: password,
                        time: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
                        watchUrl: watchUrl,
                        parent: superName
                    };
                }
            } else {
                res.status( 200 ).json( {
                    code: 406,
                    message: '请求参数不正确，拒绝访问！'
                } );
            }

            editFile( './user.json', JSON.stringify( users ), ( response ) => {
                if ( response.code === 200 ) {
                    res.status( 200 ).json( {
                        code: 200,
                        message: '成功！'
                    } );
                } else {
                    res.status( 200 ).json( {
                        code: 424,
                        message: '失败！'
                    } );
                }
            } );
        }
    } );
};