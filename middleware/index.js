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
    secret: 'gerServer'
  }));

  app.use(flash);

  app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });


  routers.forEach(function(router) {
    app.use(router);
  });

  app.use(lactate.static(path.join(__dirname, '../public')));

  app.use(function() {
    var args = arguments;
    var isErr = args[0] instanceof Error;
    if (isErr) {
      args[2].status(500).send(args[0]);
    } else {
      args[2]();
    }
  });
};
