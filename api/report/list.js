/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */

let utils = require( '../../plugin/utils' );
module.exports = function ( req, res ) {
    let client = this;
    let reqBody = req.body;
    //数据条数
    let itemNum = reqBody.size || 10;
    //开始位置
    let from = ( reqBody.pageNum - 1 ) * itemNum;
    let localRegexp = utils.replacePoint( reqBody.local );
    let typeDevice = reqBody.typeDevice;
    let orderByNumber = reqBody.order === 'type' ? true : false;

    client.search( {
        size: itemNum,
        from: from,
        index: 'logstash-web_access*',
        body: utils.getSearhBody( reqBody, typeDevice )
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
                from: from,
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
                                        }
                                    ],
                                    "filter": {
                                        "range": {
                                            "@timestamp": utils.getTimeRange( reqBody )
                                        }
                                    }
                                }
                            },
                            "functions": errorNumSearch,
                            "score_mode": "first",
                            "boost_mode": "replace"

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
                            pages: Math.ceil( data.hits.total / itemNum ),
                            currentPage: parseInt( reqBody.pageNum ),
                            froms: ( reqBody.pageNum - 1 ) * itemNum
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
                        pages: Math.ceil( results.hits.total / itemNum ),
                        currentPage: parseInt( reqBody.pageNum ),
                        froms: ( reqBody.pageNum - 1 ) * itemNum
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
};