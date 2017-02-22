/**
 * Created by liangxiao on 16/8/1.
 */

module.exports = function( Router ){
	Router.get('/', function( req, res ){
		res.render('login');
	});
	return Router;
};