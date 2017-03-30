/**
 * @author zhaodonghong
 * @fileoverview api report/test.js
 * @date 2017/03/22
 */

// const fs = require('fs');
// const path = require('path');

module.exports = function ( req, res ) {
    // let data = fs.readFileSync(path.resolve(__dirname,'../../plugin/user.json'),'utf-8');

    // let urlArr = JSON.parse(data.toString())[req.session.userName].watchUrl.split('\n');
    let urlArr = req.body.watchUrl;
    console.log( urlArr );
    // urlArr = ['h5.gomeplus','gomeplus'];
    /*urlArr.forEach(v=>{
    	v = v.replace('.', '\.');
    	console.log(v);
    });*/
    this.msearch( {
        body: [ {
                index: 'logstash-web_access*'
            },
            {
                "size": 2,
                "query": {
                    "bool": {
                        "must": [ {
                                "regexp": {
                                    "request_url": ".*" + 'aa' + ".*"
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
                "sort": [ {
                    "@timestamp": {
                        "order": "desc" //asc正序(默认)    desc倒序
                    }
                } ]
            }
        ]
    } ).then( results => {
        var data = {};
        data.flag = 1;
        data.buckets = results.responses[ 0 ].aggregations.aggByReferer.buckets;
        data.buckets.forEach( function ( i ) {
            i.key = decodeURIComponent( i.key );
            console.log( i.key, i.doc_count );
        } );
        res.status( 200 ).json( results );
    } );
};


/*module.exports = function(req, res){
	let aa = this.msearch({ //this => client
		body: [
			{index: 'logstash-web_access*'},
		    {
		    	"size": 2,
		    	"query": {
		    		"bool": {
		    			"must":[
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
		    			"must":[
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
			    					"@timestamp": {"gt": "now-7d/d"}
			    				}
			    			}
						]
		    		}
		    	}
		   	},
			{index: 'logstash-web_access*'},
		   	{
		    	"size": 22,
		    	"query": {
		    		"bool": {
		    			"must":[
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
			    					"@timestamp": {"gt": "now-90d/d"}
			    				}
			    			}
						]
		    		}
		    	}
		   	},
			{index: 'logstash-web_access*'},
		   	{
				"size" : 0,
				"from" : 0,
				"query" : {
					"bool": {
						"must" : [
							{
								"regexp": {
					    			"request_params": "err_msg=*"
					    		}
							},
							{
								"match": {
					    			"project_name": "JS"
					    		}
							},
						],
		    			"filter": [
		    				{
		    					"range": {
			    					"@timestamp": {"gt": "now-90d/d"}
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
		]
	}).then(results => {
		res.status(200).json(results);
	});
}*/



/*module.exports = function(req, res){
	let itemNum = 10;
	let from = (req.query.pages || 1 - 1) * itemNum;
	console.log(from, itemNum);
	let aa = this.search({
		index: 'logstash-web_access*',
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
		// res.status(200).json(results);
		// var arr = [];
		// for(var i = 0;i < results.responses[0].hits.hits.length; i++){
		// 	arr.push({
		// 		'type' : results.responses[0].hits.hits[i]._source.type,
		// 		'@timestamp' : results.responses[0].hits.hits[i]._source["@timestamp"]
		// 	});
		// }
		// var json = {};
		// json.responses = arr;
		// res.status(200).json(json);
		var data = {};
		data.flag = 1;
		data.buckets = results.aggregations.aggByReferer.buckets;
		res.status(200).json(data);
	});
}*/



/*module.exports = function(req, res){
	let itemNum = 10;
	let from = (req.query.pages || 1 - 1) * itemNum;
	console.log(from, itemNum);
	let aa = this.search({
		index: 'logstash-pre_adev_app_pc*',
		body: {
			"size" : 2, //itemNum
			"from" : from,
			"query" : {
				"bool": {
					"must" : [
						{
							"regexp": {
				    			"request_url": ".*err_msg=.*"
				    		}
						},
						// {
						// 	"match": {
				  //   			"project_name": "JS"
				  //   		}
						// },
						{
	    					"range": {
								"@timestamp": {"gt": "now-1d/d"}
		    				}
		    			}
					]
	    		}
			},
			,
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
		res.status(200).json(results);
	});
}*/