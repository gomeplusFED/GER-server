/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */
var replacePoint = ( str ) => {
    return '.*' + str.replace( /\./g, "\." ) + '.*';
};
var getTimeRange = (reqBody) => {
    //搜索期限
    let lastDays = reqBody.lastDays || 1;
    return lastDays === 1 ? {
            "gt": "now-1d/d"
        } : {
            "gte": "now-" + parseInt( lastDays ) + "d/d",
            "lte": "now/d"
        };
};
var getSearhBody = ( reqBody ) => {
    //搜索域名
    let local = reqBody.local;
    //搜索类型
    let searchType = reqBody.type || '';
    //搜索关键词
    let searchKey = reqBody.keyWord || '';

    let localRegexp = replacePoint( local );
    let mustSearch = [ {
            "regexp": {
                "message.host": localRegexp
            }
        },
        {
            "match": {
                "message.log_master": "js"
            }
        }
    ];
    if ( searchKey ) {
        mustSearch.push( {
            "regexp": {
                [ searchType ]: replacePoint( searchKey )
            }
        } );
    }
    let searchBody = {
        "query": {
            "bool": {
                "must": mustSearch,
                "filter": {
                    "range": {
                        "@timestamp": getTimeRange(reqBody)
                    }
                }
            }
        },
        "aggregations": {
            "type": {
                "terms": {
                    "field": "message.msg.raw"
                }

            }
        },
        "sort": [ {
            "@timestamp": {
                "order": "desc" //asc正序(默认)    desc倒序
            }
        } ]
    };
    return searchBody;
};
module.exports = function ( req, res ) {
    let client = this;
    let reqBody = req.body;
    let items = 5;
    //数据条数
    let itemNum = reqBody.size || items;
    //开始位置
    let from = ( reqBody.pageNum - 1 ) * itemNum;
    //let from = 0;
    let localRegexp = replacePoint( reqBody.local );
    let orderByNumber = reqBody.order === 'type' ? true : false;
    client.search( {
        size: itemNum,
        from: from,
        index: 'logstash-web_access*',
        body: getSearhBody( reqBody )
    } ).then( resWrap => {
        itemNum = resWrap.hits.total;
        client.search( {
            size: itemNum,
            from: from,
            index: 'logstash-web_access*',
            body: getSearhBody( reqBody )
        } ).then( results => {
            let bucketsKeys = [];
            let bucketsCounts = [];

            let errorNumSearch = [];
            results.aggregations.type.buckets.forEach( ( v, i ) => {
                if ( orderByNumber ) {
                    errorNumSearch.push( {
                        "filter": {
                            "term": {
                                "message.msg.raw": v.key
                            }
                        },
                        "weight": 1000 - i
                    } );
                }
                bucketsKeys.push( v.key );
                bucketsCounts.push( v.doc_count );
            } );
            if ( orderByNumber ) {
                client.search( {
                    size: itemNum,
                    from: 0,
                    index: 'logstash-web_access*',
                    body: {
                        "query": {
                            "function_score": {
                                "query": {
                                    "bool": {
                                        "must": [ {
                                            "regexp": {
                                                "message.host": localRegexp
                                                }
                                            },
                                            {
                                                "match": {
                                                    "message.log_master": "js"
                                                }
                                        }],
                                        "filter": {
                                            "range": {
                                                "@timestamp": getTimeRange(reqBody)
                                            }
                                        }
                                    }
                                },
                                "functions": errorNumSearch,
                                "score_mode": "first"

                            }
                        }
                    }
                } ).then( data => {
                    res.status( 200 ).json( {
                        code: 200,
                        message: '成功',
                        data: {
                            results: data.hits.hits,
                            total: data.hits.total,
                            buckets: {
                                keys: bucketsKeys,
                                counts: bucketsCounts
                            },
                            page: {
                                pages: Math.ceil( data.hits.total / items ),
                                currentPage: parseInt(reqBody.pageNum),
                                froms: ( reqBody.pageNum - 1 ) * items
                            }
                        }
                    } );
                }, data => {
                    res.status( 200 ).json( {
                        code: 424,
                        data: data,
                        message: '获取失败'
                    } );
                } );
            } else {
                res.status( 200 ).json( {
                    code: 200,
                    message: '成功',
                    data: {
                        results: results.hits.hits,
                        total: results.hits.total,
                        buckets: {
                            keys: bucketsKeys,
                            counts: bucketsCounts
                        },
                        page: {
                            pages: Math.ceil( results.hits.total / items ),
                            currentPage: parseInt(reqBody.pageNum),
                            froms: ( reqBody.pageNum - 1 ) * items
                        }
                    }
                } );

            }
        }, results => {
            res.status( 200 ).json( {
                code: 424,
                data: results,
                message: '获取失败'
            } );
        } );
    }, results => {
        res.status( 200 ).json( {
            code: 424,
            data: results,
            message: '获取失败'
        } );
    } );
};