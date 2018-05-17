/**
 * @author zhaodonghong
 * @fileoverview main app.js
 * @date 2017/02/22
 */
let express = require('express');
let middleware = require('./middleware');
let app = express();
middleware(app);
app.listen(62321);
console.log('the server is listen on %s',62321);
