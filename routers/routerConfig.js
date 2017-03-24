/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */
let getReport = require('./beforeRender/getReport');
module.exports = function(Router){
	let user = [
		{
			router: '/index',
			type: 'get'
		},{
			router: '/user',
			type: 'get'
		},{
			router: '/user/add',
			type: 'get'
		},{
			router: '/user/edit',
			type: 'get'
		},{
			router: '/user/modpwd',
			type: 'get'
		}
	];
	let report = [
		{
			router: '/report/detail',
			type: 'get'
		},{
			router: '/report/list',
			type: 'get'
		},{
			router: '/report',
			type: 'get',
			beforeRender: getReport
		}
	];
	let routers = Array.prototype.concat( user, report );
	routers.forEach((v)=>{
		Router[v.type](v.router, function(req,res){
			let defaultData = {
				isLogin: req.session.isLogin,
				isSuper: req.session.isSuper,
				userName: req.session.userName,
				superName: req.session.superName,
				isReaded: false,
				watchUrl: ''
			};
			if( v.beforeRender ){
				v.beforeRender.call(null, req, res, defaultData);
			}else{
				res.render('index',defaultData);
			}
			
		});
	});
		
	return Router;

};