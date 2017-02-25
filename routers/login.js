/**
 * @author zhaodonghong
 * @fileoverview routers login.js
 * @date 2017/02/22
 */
module.exports = function(Router){
	Router.get('/login', function( req, res ){		
		if (req.session.isLogin){
			res.redirect('index');
		}else{
			res.render('login');
		}
	});

	Router.post('/login', function(req, res,next) {
		if (req.session.isLogin){
			next('没有权限');
		}else{
			var reqBody = req.body;
			if(reqBody.userName&&reqBody.passWord ){
				doLogin(req, res, reqBody.userName, reqBody.passWord);
				res.redirect('/user');
			}else{
				req.session.loginError =  '账号或密码无效，请重试！';
				res.redirect('/login');
			}
		}
	});

	Router.all(/^((?!\/css|\/img|\/mods|\/js).)*$/, function(req, res, next) {
	    if (req.session.isLogin) {
	      	next();  	
	    } else {
	      	res.redirect('/login');
	    }
	});

	Router.get('/', function(req,res){
		res.render('index',{
			isLogin: req.session.isLogin,
			character: req.session.character
		});
	});


	var userList = {
		'test' : {
			password: '123456',
			character: 'admin'
		},
		'suman':{
			password:'123456',
			character: 'user'
		}
	
	}

	function doLogin( req, res, name, password ){
		if( userList[name] && userList[name]['password'] === password ){
			req.session.userName = name;
			req.session.isLogin = true;
			req.session.character = userList[name].character;
			res.redirect('/index');
		}else{
			req.flash('errorMsg', '账号或密码无效，请重试！');
			res.redirect('/login');
		}
	}



	
	return Router;
};