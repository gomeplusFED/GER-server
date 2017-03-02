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

module.exports = function(app) {
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'html');

    //parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    //  
    //parse application/json 
    app.use(bodyParser.json());

    app.set('trust proxy', 1);

    app.use(session({
        name: 'gerServer',
        secret: 'gerServer',
        maxAge: 24 * 60 * 60 * 1000 
      }));

  
    app.use(flash);



    routers.forEach(function(router) {

        app.use(router);
    });

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
