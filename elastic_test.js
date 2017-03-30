/**
 * @author test
 */

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    host: '10.125.137.44:9200',
    log: 'error'
});

// const search = function search(index, body) {
//  return esClient.search({index: index, body: body});
// };

// only for testing purposes
// all calls should be initiated through the module
const test = function test() {
    /*let body = {
        size: 2,
        from: 0,
        query: {
            bool: {
                must: [
                    {
                        match: {
                            'request_params':'err_msg'
                        }
                    }
                ],
                should: [
                    {
                        match: {
                            body: {
                                query: 'Elit nisi fugiat dolore amet',
                                type: 'phrase'
                            }
                        }
                    }
                ],
                must_not: [
                    {
                        range: {
                            year: {
                                lte: 2000,
                                gte: 1990
                            }
                        }
                    }
                ],
                filter: [
                    {
                        range: {
                            "@timestamp": {
                                "gte": '01/01/2017',
                                "lte": 'now',
                                "format": "dd/MM/yyyy||yyyy"
                            }
                        }
                    }
                ]
            }
        }
    };*/
    /*
    let body = {
        size : 2,
        from : 0,
        query : {
            "match": {
                // 'request_params':'err_msg'
                "message.message": {
                    "query": "err_msg",
                    "type": "phrase"
                }
            }
        }
    };*/ // []
    /*let body = {
        size : 2,
        from : 0,
        query : {
            bool: {
                must: [
                    {
                        "match": {
                            "message.message": {
                                "query": "err_msg",
                                "type": "phrase"
                            }
                        }
                    }
                ],
                filter: [
                    {
                        range: {
                            "@timestamp": {
                                "gte": '01/01/2017',
                                "lte": 'now',
                                "format": "dd/MM/yyyy||yyyy"
                            }
                        }
                    }
                ]
            }
            
        }
    };*/
    let body = {
            // 3.1-3.15 err_msg 所有数据
            "size" : 0,
            "from" : 0,
            "query" : {
                "bool": {
                    "must" : [
                        {
                            "regexp": {
                                "request_url": ".*err_msg=.*"
                            }
                        },
                        {
                            "match": {
                                "message.log_master": "js"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": "2017-03-15",
                                    "lte": "2017-03-24"
                                }
                            }
                        }
                    ]
                }
            },
            "aggregations": {
                "aggByReferer": {
                    "terms": {
                        "field": "message.msg.raw"
                    }
                }
            },
            "sort": [
                {
                    "@timestamp": {
                        "order": "desc" //asc正序(默认)    desc倒序
                    }
                }
            ]
        
    };
    //console.log(`retrieving all documents (displaying ${body.size} at a time)...`);
    let res = esClient.search({
        index: 'logstash-pre_adev_app_pc*',
        body: body
    });

    res.then(results => {
        console.log(JSON.stringify(results));
        // console.log(`found ${results.hits.total} items in ${results.took}ms`);
        // let arr = [];
        // results.hits.hits.forEach((hit, index) =>{
        //  //console.log(decodeURIComponent(hit._source.message.message));
        //  arr.push({
        //      'timestamp': hit._source['@timestamp'],
        //      'server_host': hit._source.server_ip,
        //      'server_port': hit._source.server_port,
        //      'id' : hit._source._id,
        //      'index' : hit._source._index,
        //      'ua' : hit._source.user_agent,
        //      'type' : hit._source.type,
        //      'message': decodeURIComponent(hit._source.message.message)
        //      /*今日错误数 7日错误数 15日错误数 错误类型数 报错脚本数 最高错误类型    kibana里面的字段不是很全*/
        //  }); 
        //  // console.log(hit._source);
        // });
        // console.log( arr );
    })
    .catch(console.error);
};

test();
console.log(11111);