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
				    			"request_url": "https://www.gomeplus.com",
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

