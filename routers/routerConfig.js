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
			title: '用户列表',
			type: 'get'
		},{
			router: '/user/add',
			title: '添加用户',
			type: 'get'
		},{
			router: '/user/edit',
			title: '用户编辑',
			type: 'get'
		},{
			router: '/user/modpwd',
			title: '修改密码',
			type: 'get'
		}
	];
	let report = [
		{
			router: '/report/detail',
			title: '错误详情',
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
				character: req.session.character,
				userName: req.session.userName
			};
			defaultData.title =  v.title || '';
			let result = Object.assign(defaultData, data);
			if ( v.type === 'get'){
				result.title = req.session.character === 'admin' ? '用户列表' : '错误列表';
				res.render('index',result);
			}
		});
	});
			

	
	return Router;

};