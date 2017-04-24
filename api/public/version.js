/**
 * @author zhaodonghong
 * @fileoverview api public/version.js
 * @date 2017/04/24
 */

let editFile = require( '../../plugin/writeFile' );
module.exports = function ( req, res ) {
    let version = req.query.version;
    editFile('./version.json', version, function(){
    	res.redirect( '/index' );
    });
};