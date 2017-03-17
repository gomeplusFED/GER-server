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
		   	}
		]
	}).then(results => {
		res.status(200).json(results);
	});
}

