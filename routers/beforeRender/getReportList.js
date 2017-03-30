/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */

module.exports = function ( req, res, data ) {
    if(req.query.href){
        res.render( 'index', data );
    }else{
        res.redirect('/report');
    }
};