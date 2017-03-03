/**
 * @author zhaodonghong
 * @fileoverview api  login.js
 * @date 2017/03/03
 */

var userList = {
	'test' : {
		password: '123456',
		character: 'admin'
	},
	'suman':{
		password:'123456',
		character: 'user'
	}

};

function doLogin( req, res, name, pwd ){
	if( userList[name] && userList[name].password === pwd ){
		req.session.userName = name;
		req.session.isLogin = true;
		req.session.character = userList[name].character;
		res.redirect('/index');
	}else{
		req.flash('errorMsg', '账号或密码无效，请重试！');
		res.redirect('/login');
	}
}
module.exports = function(req, res, next){

	if (req.session.isLogin){
		next('没有权限');
	}else{
		var reqBody = req.body;
		var name = reqBody.userName;
		var pwd = reqBody.passWord;
		if(name&&pwd ){

			if( userList[name] && userList[name].password === pwd ){
				req.session.userName = name;
				req.session.isLogin = true;
				req.session.character = userList[name].character;
				res.redirect('/index');


			}else{
				req.flash('errorMsg', '账号或密码无效，请重试！');
				res.redirect('/login');
			}
		}else{
			req.session.loginError =  '账号或密码无效，请重试！';
			res.redirect('/login');
		}
	}

}