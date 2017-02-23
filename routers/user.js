/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */

module.exports = function( Router ){
	Router.get('/user', function( req, res ){
		res.render('userlist');
	});
	return Router;
};