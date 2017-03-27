/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */


module.exports = function(req, res){
	let itemNum = 10;
	let from = (req.query.pages || 1 - 1) * itemNum;
	let urlArr = req.body.watchUrl;
	console.log(urlArr);
	// console.log(from, itemNum);
	let _this = this;
	let aa = this.msearch({
		// index: 'logstash-web_access*',  // 之前的表
		// index: 'logstash-pre_adev_app_pc*',  // 融合
		body: [
			{index: 'logstash-web_access*'},
		    {
		    	"size": 2,
		    	"query": {
		    		"bool": {
		    			"must":[
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
	   	]
	}).then(results => {
		var data = {};
		data.flag = 1;
		data.buckets = results.responses[0].aggregations.aggByReferer.buckets;
		data.buckets.forEach(function (i, v){
			console.log(i.key, i.doc_count);
			i.key = decodeURIComponent(i.key);
		});
		res.status(200).json(data);
		// res.status(200).json(results);
	});
}

