/**
 * @author test
 */

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    host: '10.125.137.44:9200',  //线上
    log: 'error'
});
const test = function test() {
    let body = {
           size: 100,
            from: 0,
            index: 'logstash-web_access*',
            body: {
                    "query" : {
                        "function_score" : {
                            "functions": [{"filter":{"term":{"message.msg.raw":"ReferenceError: aa is not defined\n    at http://abc.com:8889/src/test/js/main.js:8:1"}},"weight":1000},{"filter":{"term":{"message.msg.raw":"ReferenceError: bbbbb is not defined\n    at http://abc.com:8080/tests/js/main.js:10:1"}},"weight":999},{"filter":{"term":{"message.msg.raw":"attachEvent is not defined ---------- report from log"}},"weight":998},{"filter":{"term":{"message.msg.raw":"new new this item report from warn"}},"weight":997},{"filter":{"term":{"message.msg.raw":"new new this item report from debug"}},"weight":996},{"filter":{"term":{"message.msg.raw":"new new this item report from info"}},"weight":995}],
                            "score_mode": "first"

                        }
                    }
            }
        
    };
    //console.log(`retrieving all documents (displaying ${body.size} at a time)...`);
    let res = esClient.search({
        index: 'logstash-web_access*',
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