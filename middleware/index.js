/**
 * @author zhaodonghong
 * @fileoverview middleware index.js
 * @date 2017/02/22
 */

var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var lactate = require('lactate');
var flash = require('flashify');
var routers = require('../routers');
var beforeLogin = require('../api/beforeLogin');
var api = require('../api');
module.exports = function(app) {
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'html');

    //parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Content-Type", "image/png");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1')
        next();
    });
    //parse application/json 
    app.use(bodyParser.json());

    app.set('trust proxy', 1);

    app.use(session({
        name: 'gerServer',
        secret: 'gerServer',
        maxAge: 24 * 60 * 60 * 1000 
      }));

  
    app.use(flash);




    app.use(beforeLogin());

    routers.forEach(function(router) {

        app.use(router);
    });

    app.use(api());

    app.use(lactate.static(path.join(__dirname, '../public')));
  

    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function() {
        if(arguments.length === 4 ){
            // 设置响应状态
            arguments[2].status(arguments[0].status || 500);
            // 渲染错误处理页
            arguments[2].send(`404`);
        }
    });
};
