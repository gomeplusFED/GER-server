/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */
module.exports = function(Router){
	Router.get('/logout', function( req, res ){		
		req.session = null;
	    res.redirect('/login');
	});
	return Router;
};
