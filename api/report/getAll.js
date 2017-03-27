/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */
var getSearhBody = function(v, d, i, j){
	let regexp = '.*' + v.replace(/\./g,"\.") + '.*';
	let timestamp = {
						"gte": "now-"+ d +"d/d",
						"lte": "now/d"
					}
	if( i === 0 ){
		timestamp = {
						"gt": "now-1d/d"
					}
	}
	let test = 'test' + j + '|' + i;
	let searchBody = {
					"query" : {
						"bool": {
							"must" : [
								{
									"regexp": {
						    			"request_url": regexp
						    		}
								},
								{
									"match": {
						    			"project_name": "gomeo2o_pc"
						    		}
								},
								{
			    					"range": {
				    					"@timestamp": timestamp
				    				}
				    			}
							]
			    		}
					}
		};

	/*if(i === 2 ){
		searchBody ={
					"query" : {
						"bool": {
							"must" : [
								{
									"regexp": {
						    			"request_url": regexp
						    		}
								},
								{
									"match": {
						    			"project_name": "gomeo2o_pc"
						    		}
								},
								{
			    					"range": {
				    					"@timestamp": timestamp
				    				}
				    			}
							]
			    		}
					},
		    		"aggregations": {
		    			[test]: {
							"terms": {
								"field": "lbs_ip.raw"
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
	}else{
		searchBody = {
					"query" : {
						"bool": {
							"must" : [
								{
									"regexp": {
						    			"request_url": regexp
						    		}
								},
								{
									"match": {
						    			"project_name": "gomeo2o_pc"
						    		}
								},
								{
			    					"range": {
				    					"@timestamp": timestamp
				    				}
				    			}
							]
			    		}
					}
		}
	}*/
	return searchBody;
}

module.exports = function(req, res){
	let client = this;
	let itemNum = req.body.size || 10;
	let from = (req.body.pageNum - 1) * itemNum; 
	let watchUrl = req.body.watchUrl;
	let search = [];
	let days = [0, 7, 15];
	if( watchUrl ){
		watchUrl.forEach((v, j)=>{
			days.forEach((d, i)=>{

				search.push({index: 'logstash-web_access*'});
				search.push(getSearhBody(v, d, i, j));
			});
		});
		client.msearch({
			size: 0,
			from: 0,
			body: search
		}).then(results => {
			/*var data = {};
			data.flag = 1;
			console.log(results)
			data.buckets = results.aggregations.aggByReferer.buckets;
			data.buckets.forEach(function (i, v){
				console.log(i.key, i.doc_count);
			});*/
			
			let data = results.responses;
			let result = {};


			let key = '';
			let keyChild = '';
			data.forEach(v=>{
				key = Object.keys(v.aggregations)[0];
				keyChild = key.replace('test', '').split('|');
				if( result[keyChild[0]]  ){
					result[keyChild[0]][keyChild[1]] = {
						conut: v.aggregations[key].buckets[0].doc_count,
						key: v.aggregations[key].buckets[0].key
					}
				}else{
					result[keyChild[0]] = {
						[keyChild[1]] : {
							conut: v.aggregations[key].buckets[0].doc_count,
							key: v.aggregations[key].buckets[0].key
						}
					}
				}
			});
			console.log(JSON.stringify(result))
			res.status(200).json(results);

			
			// res.status(200).json(results);
		});
	}else{
		res.status(200).json({
			code: 424,
			message: '参数错误'
		})
	}
	/*let _this = this;
	let aa = this.search({
		index: 'logstash-web_access*',  //h5
		// index: 'logstash-pre_adev_app_pc*',  //融合
		body: {
			// 3.1-3.15 err_msg 所有数据
			"size" : itemNum,
			"from" : from,
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
				    			"project_name": "JS"
				    		}
						},
						{
	    					"range": {
		    					"@timestamp": {
									"gte": "2017-03-01",
									"lte": "2017-03-15"
								}
		    				}
		    			}
					]
	    		}
			},
    		"aggregations": {
    			"aggByReferer": {
					"terms": {
						"field": "referer.raw"
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
	}).then(results => {
		var data = {};
		data.flag = 1;
		data.buckets = results.aggregations.aggByReferer.buckets;
		data.buckets.forEach(function (i, v){
			console.log(i.key, i.doc_count);
		});
		res.status(200).json(data);
		// res.status(200).json(results);
	});*/
}

