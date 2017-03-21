/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/03
 */


module.exports = function(req, res){
	let aa = this.msearch({ //this => client
		//index: 'logstash-web_access*',
		body: [
			{index: 'logstash-web_access*'},
		    {
		    	"size": 2,
		    	"query": {
		    		"bool": {
		    			"must":{
		    				"regexp": {
				    			"request_url": ".*gomeplus.com.*"
				    		}
		    			},
		    			"filter": [
		    				{
		    					"range": {
			    					"@timestamp": {"gt": "now-1d/d"}
			    				}
			    			}
		    			]
		    		}
		    	}
		   	},
			{index: 'logstash-web_access*'},
		   	{
		    	"size": 2,
		    	"query": {
		    		"bool": {
		    			"must":{
		    				"regexp": {
				    			"request_url": ".*gomeplus.com.*",
				    			// "type": "INF"
				    		}
		    			},
		    			"filter": [
		    				{
		    					"range": {
			    					"@timestamp": {"gt": "now-7d/d"}
			    				}
			    			}
		    			]
		    		}
		    	}
		   	},
			{index: 'logstash-web_access*'},
		   	{
		    	"size": 2,
		    	"query": {
		    		"bool": {
		    			"must":{
		    				"regexp": {
				    			"request_url": ".*gomeplus.com.*"
				    		}
		    			},
		    			"filter": [
		    				{
		    					"range": {
			    					"@timestamp": {"gt": "now-15d/d"}
			    				}
			    			}
		    			]
		    		}
		    	}
		   	},
			{index: 'logstash-web_access*'},
			// 匹配所有request_params 是err_msg 参数的
		   	{
				"size" : 2,
				"from" : 0,
				"query" : {
					"match": {
						'request_params':'err_msg'
					}
				}
			},
			{index: 'logstash-web_access*'},
			// 匹配所有request_params是以err_msg开头 必须有message.message 参数 90天之内的
		   	{
				"size" : 2,
				"from" : 0,
				"query" : {
					"bool": {
						"must" : [
							{
								"regexp": {
					    			"request_params": "err_msg=*"
					    		}
							}
						],
		    			"filter": [
		    				{
		    					"range": {
			    					"@timestamp": {"gt": "now-90d/d"}
			    				}
			    			},
			    			{
				    			"exists": {
									"field": "message.message"
								}
							}
		    			]
		    		}
				}
			}
		]
	}).then(results => {
		res.status(200).json(results);
	});
}

