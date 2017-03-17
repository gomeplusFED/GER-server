/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/15
 */


module.exports = function(req, res){
	let aa = this.msearch({
		// index: 'logstash-web_access*',
		body :[{
			"size": 5,
			"query": {
				"match_all": {}
			},
			"aggregations": {
				"by_errorType": {
					"terms": {
					// "cardinality": {
						"field": "message",
						"size": 5,/*
						"order": {
							"_count": "desc"  // 排序
						},*/
					}
				}
			},
			// "aggregations" : {
			//    "by_type" : {
			//        "terms" : {
			//            "script" : {
			//                // "file": "my_script",
			//                "params": {
			//                    "field": "message.message"
			//                }
			//            }
			//        }
			//    }
			//}
		 	// "aggregations" : {
		  	//    "by_type" : {
		  	//        "terms" : {
		  	//            "script" : "doc['message'].value"
		  	//        }
		  	//    }
		  	//}
		}]
	}).then(results => {
		res.status(200).json(results);
		/*var arr = [];
		for(var i = 0;i < results.responses[0].hits.hits.length; i++){
			arr.push({
				'type' : results.responses[0].hits.hits[i]._source.type,
				'@timestamp' : results.responses[0].hits.hits[i]._source["@timestamp"]
			});
		}
		var json = {};
		json.responses = arr;
		res.status(200).json(json);*/
	});
}

