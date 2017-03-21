/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/15
 */


module.exports = function(req, res){
	let aa = this.search({
		index: 'logstash-web_access*',
		body: {
			/*"size": 5,
			"from": 0,
			"query": {
				"match_all": {}
			},*/  //匹配所有
			/*"size": 5,
			"from": 0,
			"filter": {
				"exists": {
					"field": "message.message"
				}
			}*/   //所有包含message.message的数据

			"size": 5,
			"query": {
				"match_all": {}
			},
			"aggregations": {
		        "message_count": {
					"terms": {
						"field": "log_master"
					}
				}
			}




			// "aggregations": {
			// 	"by_errorType": {
			// 		"terms": {
			// 		// "cardinality": {
			// 			"field": "message",
			// 			"size": 5,/*
			// 			"order": {
			// 				"_count": "desc"  // 排序
			// 			},*/
			// 		}
			// 	}
			// }
		}
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

