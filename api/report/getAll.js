/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */
var getSearhBody = function ( v, d, i, j ) {

    let name = v + '|' + j + '|' + i;
    let regexp = '.*' + v.replace( /\./g, "\." ) + '.*';
    let timestamp = {
        "gte": "now-" + parseInt( d ) + "d/d",
        "lte": "now/d"
    };
    if ( i === 0 ) {
        timestamp = {
            "gt": "now-1d/d"
        };
    }
    let searchBody = {
        "query": {
            "bool": {
                "must": [ {
                        "regexp": {
                            "message.host": regexp
                        }
                    },
                    {
                        "match": {
                            "message.log_master": "js"
                        }
                    }
                ],
                "filter": [ {
                    "range": {
                        "@timestamp": timestamp
                    }
                } ]
            }
        }
    };
    //15天错误数/类型数/最高错误类型
    if ( i === 2 ) {
        searchBody.aggregations = {
            [ name ]: {
                "terms": {
                    "field": "message.msg.raw"
                }
            }
        };

        searchBody.sort = [ {
            "@timestamp": {
                "order": "desc" //asc正序(默认)    desc倒序
            }
        } ];
    } else if ( i === 3 ) {
        //15天错误脚本数
        searchBody.aggregations = {
            [ name ]: {
                "terms": {
                    "field": "message.targetUrl.raw"
                }
            }
        };

        searchBody.sort = [ {
            "@timestamp": {
                "order": "desc" //asc正序(默认)    desc倒序
            }
        } ];
    }
    return searchBody;
};

module.exports = function ( req, res ) {
    let client = this;
    let itemNum = req.body.size || 10;
    let from = ( req.body.pageNum - 1 ) * itemNum;
    let watchUrl = req.body.watchUrl;
    let search = [];
    let days = [ 0, 7, 15, 15 ];
    let keys = [ 'todayErrorNum', 'weekErrorNum', 'lastFifteenErrorNum', 'scriptErrorNum' ];
    if ( watchUrl ) {
        watchUrl.forEach( ( v, j ) => {
            days.forEach( ( d, i ) => {
                search.push( {
                    index: 'logstash-web_access*'
                } );
                search.push( getSearhBody( v, d, i, j ) );
            } );
        } );
        //console.log(search);
        client.msearch( {
            size: itemNum,
            from: from,
            body: search
        } ).then( results => {
            //console.log(JSON.stringify(results));
            let data = results.responses;
            let result = [];
            let child = {};
            let agg = '';
            let item = '';
            //todayErrorNum => 今日错误数;
            //weekErrorNum => 7日错误数;
            //lastFifteenErrorNum => 15日错误数;
            //scriptErrorNum => 15日报错脚本数;
            //local => 域名;
            //errorType => 15日错误类型数
            //highError => 15日最高错误类型;
            data.forEach( ( v, i ) => {
                if ( v.aggregations ) {
                    if ( i % 4 === 2 ) {
                        agg = v.aggregations;
                        item = Object.keys( agg )[ 0 ];
                        child[ keys[ i % 4 ] ] = v.hits.total;
                        child.local = item.split( '|' )[ 0 ];
                        child.errorType = v.aggregations[ item ].buckets.length;
                        child.highError = child.errorType > 0 ? v.aggregations[ item ].buckets[ 0 ].key : '';
                    } else if ( i % 4 === 3 ) {
                        agg = v.aggregations;
                        item = Object.keys( agg )[ 0 ];
                        child[ keys[ i % 4 ] ] = v.aggregations[ item ].buckets.length;
                    }
                } else {
                    child[ keys[ i % 4 ] ] = v.hits.total;
                }

                if ( i % 4 === 3 && i !== 0 ) {
                    result.push( child );
                    child = {};
                }
            } );
            result = result.filter( ( item ) => {
                return item.lastFifteenErrorNum;
            } );
            res.status( 200 ).json( {
                code: 200,
                message: '获取成功',
                data: result,
                originalData: results
            } );
        }, results => {
            console.log( results );
        } );
    } else {
        res.status( 200 ).json( {
            code: 424,
            message: '参数错误'
        } );
    }
};