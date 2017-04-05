/**
 * @author test
 */

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    //host: '10.125.137.44:9200', //线上
    host: '127.0.0.1:9200', //线上
    log: 'error'
});

function test() {
    let body = {
        index: 'logstash-web_access*',
        body: {
            query: {
                match: {
                    project_name: "JS"
                }
            }
        }
    };
    //console.log(`retrieving all documents (displaying ${body.size} at a time)...`);
    //let res = esClient.search(body);
    esClient.indices.putSettings({
        index:'logstash-web_access2017.04.05', 
        body: {
            "logs": {
                "properties": {
                    "@timestamp": {
                        "type": "date",
                        "format": "yyyy-MM-dd"
                    }
                }
            }
        }
    }, (err, res) => {
        console.log(err, res);
    });
    //res.then(results => {
    //      console.log(JSON.stringify(results));
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
    //           })
    //           .catch(console.error);
}

test();
