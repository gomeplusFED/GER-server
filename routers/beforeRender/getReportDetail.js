/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */

module.exports = function ( req, res, data ) {
    if(req.query.id && req.query.index){
        res.render( 'index', data );
    }else{
        res.redirect('/report');
    }
};
//http://127.0.0.1:8888/report/detail?id=AVsT4kyv8AWXF14aspBw