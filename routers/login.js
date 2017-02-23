/**
 * Created by liangxiao on 16/8/1.
 */

module.exports = function( Router ){
	Router.all('/', function( req, res ){
		console.log(11111);
		res.render('login');
	});
	Router.get('/login', function( req, res ){
		console.log(req.session.loginError + '------');
		res.render('login');
	});
	Router.post('/login', function(req, res) {
		var reqBody = req.body;
		if(reqBody.userName  && reqBody.passWord ){
			doLogin(req, res, reqBody.userName, reqBody.passWord)
			//res.redirect('/user');
		}else{
			req.session.loginError =  '账号或密码无效，请重试！'
			res.redirect('/login');
		}
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
		if( userList[name] && userList[name][password] === password ){
			req.session.userName = name;
			req.session.isLogin = true;
			req.session.character = userList[name][character];
			res.redirect('/user');
		}
	}
	//flashfy()



	/*Router.get(/^((?!\/css|\/img|\/mods|\/js).)*$/, function(req, res, next) {
	    if (false) {
	      
	      next();
	    } else {
	      res.redirect('/login');
	    }
	});*/
	return Router;
};