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
				title: '用户列表',
				type: 'get'
			},
			detail: {
				router: '/report/detail',
				title: '错误详情',
				type: 'get'
			}
		},
		user:  {

			index: {
				router: '/index',
				title: '用户列表',
				type: 'get'
			},
			add: {
				router: '/user/add',
				title: '添加用户',
				type: 'get'
			},
			edit: {
				router: '/user/edit',
				title: '用户编辑',
				type: 'get'
			},
			changepass: {
				router: '/user/changepass',
				title: '修改密码',
				type: 'get'
			}
		}
	};
	var routersArr = [];
	let item;
	for( let k in routers ){
		item = routers[k]
		for( let n  in item ){
			Router[item[n].type](item[n].router, function(req,res){
				let data = item[n].beforeRender ? item[n].beforeRender(req, res) : {};
				let defaultData = {
					isLogin: req.session.isLogin,
					character: req.session.character
				}
				defaultData.title =  item[n].title || '';
				let result = Object.assign(defaultData, data);
				if ( item[n].type === 'get'){
					res.render('index',result);
				}
			});
		}
	}
	
	return Router;

}