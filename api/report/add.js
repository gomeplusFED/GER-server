/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/03
 */
let fs = require( 'fs' );
let path = require( 'path' );
let moment = require( 'moment' );
let elasticsearch = require( 'elasticsearch' );
let config = require( '../../config.js' );
let uuidV1 = require( 'uuid/v1' );

module.exports = function ( req, res, next ) {
    let client = new elasticsearch.Client( config.elasticsearch() );
    let img = fs.createReadStream( path.resolve( __dirname, '../../public/images/read.gif' ) );
    //增加写入elasticsearch的操作
    let indexDate = moment().format( 'YYYY.MM.DD' );
    if ( req.query.err_msg ) {
        let params = {
            log_master: 'js'
        };
        let errmsg = decodeURIComponent( req.query.err_msg );
        errmsg = errmsg.replace( /\^/g, '&' );
        errmsg = errmsg.split( '&' );
        errmsg.forEach( ( item ) => {
            item = item.split( '=' );
            params[ item[ 0 ] ] = item[ 1 ];
        } );
        var timestamp = moment().format();
        var request_time = moment().format( 'YYYY-MM-DD hh:mm:ss' );
        console.log( timestamp );
        client.create( {
            index: 'logstash-web_access' + indexDate,
            type: 'logs',
            id: uuidV1(),
            body: {
                project_name: "JS",
                '@timestamp': timestamp,
                request_time: request_time,
                message: {
                    log_master: 'js',
                    msg: params.msg,
                    projectType: params.projectType,
                    currentUrl: params.currentUrl,
                    flashVer: params.flashVer,
                    level: params.level,
                    referer: params.referer,
                    screenSize: params.screenSize,
                    timestamp: params.timestamp,
                    userAgent: params.userAgent,
                    title: params.title,
                    host: params.host,
                    colNum: params.colNum,
                    rowNum: params.rowNum,
                    targetUrl: params.targetUrl,
                    ext: params.ext
                }
            }
        }, function ( error, response ) {
            if ( error ) {
                next( error );
            } else {
                console.log( response );
                img.pipe( res );
            }
        } );
    } else {
        img.pipe( res );
    }
};