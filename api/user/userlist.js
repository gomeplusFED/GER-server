/**
 * @author zhaodonghong
 * @fileoverview api  login.js
 * @date 2017/03/03
 */
let userList = require('../../plugin/readUserList');
module.exports = function(req, res){
	let userName = req.body.superName;
	let page = parseInt(req.body.page, 10);
	let size = req.body.size || 10;
	userList(function(data){
		if( data.code === 200 ){
			let lists = data.data;
			let children = lists[userName].child;
			let pageSize = Math.ceil(children.length / size );
			let childList = [];

			children.forEach(v=>{
				childList.push(lists[v]);
			});

			if( pageSize >= page ){
				res.status(200).json({
					code: 200,
					message: '获取成功！',
					data: childList.slice((page-1)*size, size * page) || []
				});
			}else{

				res.status(200).json({
					code: 200,
					message: '获取成功！',
					data: childList.slice((pageSize-1)*size, size * pageSize)
				});
				
			}
		}else{
			res.status(200).json({
				code: '424',
				message: '读取失败！'
			});
		}
	});
	
	
	
};