/**
* @author test
*/

const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    // host: '10.125.137.44:9200',  //线上
	host: '10.69.205.21:9201',
	log: 'error'
});

const test = function test() {
	let body = {
			"size" : 0,
			"from" : 0,
			"query" : {
				// match_all :{}
				"bool": {
					"must" : [
						{
							"regexp": {
				    			"request_url": ".*h5\.gomeplus.*"
				    		}
						},
						/*{
							"match": {
				    			"message.log_master": "js"
				    		}
						},	*/
						{
	    					"range": {
		    					"@timestamp": {
									"gte": "2017-03-22",
									"lte": "2017-03-25"
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
		
	}
	let res = esClient.search({
		index: 'logstash-pre_adev_app_pc*',
		// index: 'logstash-web_access*',
		body: body
	});

	res.then(results => {	
		//console.log(JSON.stringify(results));
		console.log('------------  total : ' + results.hits.total );
		console.log('------------  agg   total : ' + results.aggregations.aggByReferer.sum_other_doc_count );
		results.aggregations.aggByReferer.buckets.forEach(v=>{
			console.log('key 是  ' + v.key + ' , 个数是' + v.doc_count );
		});
	})
	.catch(console.error);
};

test();