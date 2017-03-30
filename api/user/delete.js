/**
 * @author zhaodonghong
 * @fileoverview api user/edit.js
 * @date 2017/03/03
 */
let userList = require( '../../plugin/readUserList' );
let editUserList = require( '../../plugin/writeUserList' );
module.exports = function ( req, res ) {
    let data = req.body;
    let userName = data.userName;
    let superName = data.superName;
    userList( result => {
        if ( result.code === 200 ) {
            let users = result.data;
            let superChild = users[ superName ].child;
            let childIndex = superChild.indexOf( userName );
            //删除super字段下child数组内当前用户名
            superChild.splice( childIndex, 1 );
            //删除children字段下当前用户名key
            delete users[ userName ];

            editUserList( JSON.stringify( users ), ( response ) => {
                if ( response.code === 200 ) {
                    res.status( 200 ).json( {
                        code: 200,
                        message: '删除成功！'
                    } );
                } else {
                    res.status( 200 ).json( {
                        code: 424,
                        message: '删除失败！'
                    } );
                }
            } );
        } else {
            res.status( 200 ).json( {
                code: 424,
                message: '读取失败！'
            } );
        }
    } );
};