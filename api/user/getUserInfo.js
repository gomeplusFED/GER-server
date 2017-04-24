/**
 * @author zhaodonghong
 * @fileoverview api  getUserInfo.js
 * @date 2017/03/03
 */

let readFile = require( '../../plugin/readFile' );
module.exports = function ( req, res ) {
    let userName = req.body.userName;
    readFile( './user.json', ( err, data ) => {
        if(err){

            res.status( 200 ).json( {
                code: 424,
                messsage: '读取失败'
            } );
        }else{

            let users = JSON.parse(data);

            //获取子账号
            if ( users[ userName ] ) {
                res.status( 200 ).json( {
                    code: 200,
                    messsage: '获取成功',
                    data: users[ userName ]
                } );
            } else {
                res.status( 200 ).json( {
                    code: 424,
                    messsage: '查无此人'
                } );
            } 
        }

    } );


};