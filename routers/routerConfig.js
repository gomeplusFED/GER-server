/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */

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
			type: 'get'
		}
	];
	let routers = Array.prototype.concat( user, report );
		
	
	
	routers.forEach((v)=>{
		Router[v.type](v.router, function(req,res){
			console.log(1111111)
			let data = v.beforeRender ? v.beforeRender(req, res) : {};
			let defaultData = {
				isLogin: req.session.isLogin,
				character: req.session.character,
				userName: req.session.userName
			};
			let result = Object.assign(defaultData, data);
			res.render('index',result);
		});
	});
		
	return Router;

};