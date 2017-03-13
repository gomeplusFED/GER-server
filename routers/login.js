/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */
module.exports = function(Router){
	Router.get('/login', function( req, res ){		
		if (req.session.isLogin){
			res.redirect('/index');
		}else{
			res.render('login');
		}
	});


	Router.all(/^((?!\/css|\/img|\/mods|\/js|\/report\/add).)*$/, function(req, res, next) {
	    if (req.session.isLogin) {
	      	next();  	
	    } else {
	      	res.redirect('/login');
	    }
	});

	Router.get('/', function( req,  res){
	    res.redirect('/index');
	});




	
	return Router;
};