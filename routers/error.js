/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */
module.exports = function(Router){

	var routers = ['/report', '/report/detail'];
	routers.forEach((v)=>{
		Router.get(v, function( req, res ){
			res.render('index',{
				isLogin: req.session.isLogin,
				character: req.session.character
			});
		});
	});

	return Router;
}