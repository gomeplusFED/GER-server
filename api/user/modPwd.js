/**
 * @author zhaodonghong
 * @fileoverview api user/edit.js
 * @date 2017/03/03
 */

let userList = require( '../../plugin/readFile' );
let editFile = require( '../../plugin/writeFile' );
module.exports = function ( req, res ) {
    let body = req.body;
    let userName = body.userName;
    let password = body.pwd;
    let users = '';
    userList( './user.json', ( err, data ) => {
        if( err ){
            res.status( 200 ).json( {
                code: 424,
                message: '文件读取失败，请重试！'
            } );
        }else{
            users = JSON.parse(data);
            users[ userName ].password = password;
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
    } );
};