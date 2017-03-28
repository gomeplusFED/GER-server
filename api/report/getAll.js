/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */


module.exports = function(req, res){
	// console.log(from, itemNum);
	let client = this;
	let itemNum = req.body.size || 10;
	let from = (req.body.pageNum - 1) * itemNum; 
	let watchUrl = req.body.watchUrl;
	console.log(watchUrl);
	let search = [];
	let days = [1, 7, 15];
	if( watchUrl ){
		watchUrl.forEach(v=>{
			days.forEach(d=>{
				search.push({index: 'logstash-web_access*'});
				search.push({"query" : {
								"bool": {
									"must" : [
										{
											"regexp": {
								    			"request_url": ".*gomeplus.*"
								    		}
										},
										{
											"match": {
								    			"project_name": "gomeo2o_pc"
								    		}
										},
										{
					    					"range": {
												"@timestamp": {"gt": "now-" + d + "d/d"}
						    				}
						    			}
									]
					    		}
							},
				    		"aggregations": {
				    			"aggByReferer": {
									"terms": {
										"field": "message.log_master.raw"
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
				});
			});
			
		});

		client.msearch({
			size: 0,
			from: 0,
			body: search
		}).then(results => {
			let buckets = [];
			/*results.responses.forEach((v, index)=>{
				index % 2 ? v.aggregations.aggByReferer.buckets[0].domain = watchUrl[1] : v.aggregations.aggByReferer.buckets[0].domain = watchUrl[0];
				buckets.push(v.aggregations.aggByReferer.buckets[0]);
			});*/
			let data = {};
			data.flag = 1;
			// console.log(buckets);
			for(let i = 0; i < buckets.length; i += 3 ){
				data.buckets.push({
					"day1" : buckets[i].doc_count,
					"day7" : buckets[i + 1].doc_count,
					"day15" : buckets[i + 2].doc_count,
					"maxLength" : buckets[i + 2].doc_count,
					"maxError" : buckets[i + 2].key,
					"domain" : buckets[i + 2].domain
				});
			}
			console.log(data.buckets);
			// res.status(200).json(data);
			res.status(200).json(results);
		});
	}else{
		res.status(200).json({
			code: 424,
			message: '参数错误'
		})
	}
}

