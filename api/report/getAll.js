/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/03
 */


module.exports = function(client,req, res){
	let aa = client.msearch({
		//index: 'logstash-web_access*',
		body: [
			{index: 'logstash-web_access*'},
		    {
		    	"query": {
		    		"bool": {
		    			"must":{
		    				"prefix": {
				    			"request_url": "https://m.gomeplus.com"
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
		    	"query": {
		    		"bool": {
		    			"must":{
		    				"prefix": {
				    			"request_url": "https://www.gomeplus.com"
				    		},
				    		"prefix": {
				    			"type": "INF"
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
		   	}
		]
	}).then(results => {
		res.status(200).json(results);
	});
}