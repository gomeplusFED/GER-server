/**
 * @author zhaodonghong
 * @fileoverview api report/test.js
 * @date 2017/04/11;
 */

let utils = require( '../../plugin/utils' );
module.exports = function ( req, res ) {
	let client = this;
    let reqBody = req.body;
    let localRegexp = utils.replacePoint( reqBody.local );
    client.search( {
        size: 0,
        from: 0,
        index: 'logstash-web_access*',
        body: utils.getSearhBody( reqBody )
    } ).then( resWrap => {
    	res.status(200).json({
    		code: 200,
    		message: '成功',
    		data: resWrap
    	});
    }, results => {
        res.status( 200 ).json( {
            code: 424,
            data: results,
            message: '获取失败'
        } );
    } );
};