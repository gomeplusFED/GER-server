/**
 * @author zhaodonghong
 * @fileoverview middleware index.js
 * @date 2017/02/22
 */
let ejs = require( 'ejs' );
let path = require( 'path' );
let fs = require( 'fs' );
let bodyParser = require( 'body-parser' );
let session = require( 'cookie-session' );
let lactate = require( 'lactate' );
let sourcemap = require( 'source-map' );
let upload = require( 'multer' )( {
    dest: 'public/'
} );
let flash = require( 'flashify' );
let routers = require( '../routers' );
let beforeLogin = require( '../api/beforeLogin' );
let api = require( '../api' );
module.exports = function ( app ) {
    //use html
    app.engine( 'html', ejs.renderFile );
    app.set( 'view engine', 'html' );

    //parse application/x-www-form-urlencoded 
    app.use( bodyParser.urlencoded( {
        extended: false
    } ) );
    //允许跨域
    app.all( '*', function ( req, res, next ) {
        res.header( "Access-Control-Allow-Origin", "*" );
        next();
    } );
    //parse application/json 
    app.use( bodyParser.json() );

    app.set( 'trust proxy', 1 );

    app.use( session( {
        name: 'gerServer',
        secret: 'gerServer',
        maxAge: 24 * 60 * 60 * 1000
    } ) );
    app.use( flash );
    //登录前接口
    app.use( beforeLogin() );
    //server端路由配置
    routers.forEach( function ( router ) {
        app.use( router );
    } );
    //server端api配置
    app.use( api() );


    app.post( '/upload', upload.single( 'map' ), function ( req, res ) {
        let oldPath = path.join( process.cwd(), req.file.path );
        let newPath = path.join( process.cwd(), 'public/' + req.file.originalname );
        fs.rename( oldPath, newPath, ( err ) => {
            if ( err ) {
                res.status( 200 ).json( {
                    code: 424,
                    message: '失败',
                    data: err
                } );
            } else {
                let smc = new sourcemap.SourceMapConsumer( fs.readFileSync( newPath, 'utf8' ) );
                let ret = smc.originalPositionFor( {
                    line: parseInt( req.body.rowNum, 10 ),
                    column: parseInt( req.body.colNum, 10 )
                } );
                //删除文件
                fs.unlinkSync( newPath );
                res.status( 200 ).json( {
                    code: 200,
                    message: '成功',
                    data: ret
                } );
            }
        } );
    } );


    //server端静态文件配置
    app.use( lactate.static( path.join( __dirname, '../public' ) ) );

    app.use( function ( req, res, next ) {
        var err = new Error( 'Not Found' );
        err.status = 404;
        next( err );
    } );
    app.use( function () {
        if ( arguments.length === 4 ) {
            // 设置响应状态
            arguments[ 2 ].status( arguments[ 0 ].status || 500 );
            // 渲染错误处理页
            arguments[ 2 ].send( `404` );
        }
    } );
};