/**
 * @author zhaodonghong
 * @fileoverview main app.js
 * @date 2017/02/22
 */
var express = require('express');
var middleware = require('./middleware');
var app = express();
middleware(app);
app.listen(8888);
console.log('the server is listen on %s',8888);
