/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */

module.exports = function(Router){
	let user = [
		{
			router: '/index',
			title: '用户列表',
			type: 'get'
		},{
			router: '/index/:id',
			title: '用户列表',
			type: 'get'
		},{
			router: '/user/add',
			title: '添加用户',
			type: 'get'
		},{
			router: '/user/edit/:name',
			title: '用户编辑',
			type: 'get'
		},{
			router: '/user/modpwd/:name',
			title: '修改密码',
			type: 'get'
		}
	];
	let report = [
		{
			router: '/report/:id/detail',
			title: '错误详情',
			type: 'get'
		},{
			router: '/report/:page',
			title: '错误列表',
			type: 'get'
		},{
			router: '/report',
			title: '错误列表',
			type: 'get'
		}
	];
	let routers = Array.prototype.concat( user, report );
		
	
	
	routers.forEach((v)=>{
		Router[v.type](v.router, function(req,res){
			let data = v.beforeRender ? v.beforeRender(req, res) : {};
			let defaultData = {
				isLogin: req.session.isLogin,
				character: req.session.character
			};
			defaultData.title =  v.title || '';
			let result = Object.assign(defaultData, data);
			console.log()
			if ( v.type === 'get'){
				if(req.session.character === 'admin' ){
					res.render('index',result);
				}else{
					res.render('report',result);
				}
			}
		});
	});
			

	
	return Router;

}