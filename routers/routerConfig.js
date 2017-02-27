/**
 * @author zhaodonghong
 * @fileoverview routers user.js
 * @date 2017/02/22
 */

module.exports = function(Router){
	var routers = {
		error: {
			report: {
				router: '/report',
				title: '错误列表'
			},
			detail: {
				router: '/report/detail',
				title: '错误详情'
			}
		},
		user:  {

			index: {
				router: '/index',
				title: '用户列表'
			},
			add: {
				router: '/user/add',
				title: '添加用户'
			},
			edit: {
				router: '/user/edit',
				title: '用户编辑'
			},
			changepass: {
				router: '/user/changepass',
				title: '修改密码'
			}
		}
	};
	var routersArr = [];
	let item;
	for( let k in routers ){
		item = routers[k]
		for( let n  in item ){

			Router.get(item[n].router, function(req,res){
				res.render('index',{
					isLogin: req.session.isLogin,
					character: req.session.character,
					title: item[n].title
				});
			});
		}
	}
	
	return Router;

}