/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */

module.exports = function( Router ){

	Router.get('/user/list', function( req, res ){
		res.render('userlist');
	});

	Router.get('/user/add', function( req, res ){
		res.render('useradd');
	});

	Router.get('/user/detail', function( req, res ){
		res.render('userdetail');
	});

	Router.get('/user/changepass', function( req, res ){
		res.render('changepass');
	});

	return Router;
};