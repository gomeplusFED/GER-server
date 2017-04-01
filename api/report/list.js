/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */
var replacePoint = ( str ) => {
    return '.*' + str.replace( /\./g, "\." ) + '.*';
};
var getSearhBody = ( reqBody ) => {
	//搜索域名
	let local = reqBody.local;
	//搜索期限
	let lastDays = reqBody.lastDays || 1;
	//搜索类型
	let searchType = reqBody.type || '';
	//搜索关键词
	let searchKey = reqBody.keyWord || '';
	
	let localRegexp = replacePoint( local );
	let mustSearch = [{
						"regexp": {
			    			"message.host": localRegexp
			    		}
					},
					{
						"match": {
			    			"message.log_master": "js"
			    		}
					}];
	if( searchKey ){
		mustSearch.push({
			"regexp": {
				[searchType]: replacePoint( searchKey )
			}
		});
	}
	let timestamp = {
						"gte": "now-"+ parseInt(lastDays) +"d/d",
						"lte": "now/d"
					};
	if( lastDays === 1 ){
		timestamp = {
						"gt": "now-1d/d"
					};
	}
	let searchBody = {
		"query": {
			"bool": {
				"must": mustSearch,
				"filter":{
                    "range": {
                        "@timestamp": timestamp
                    }
                }
            }
        },
        "aggregations": {
            "type": {
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
    };
    return searchBody;
};
module.exports = function(req, res){
	let client = this;
	let reqBody = req.body;
	//数据条数
	let itemNum = reqBody.size || 20;
	//开始位置
	let from = (reqBody.pageNum - 1) * itemNum; 
	let localRegexp = replacePoint( reqBody.local );
	let orderByNumber = reqBody.order === 'type' ? true : false; 
	client.search({
		size: itemNum,
		from: from,
		index: 'logstash-web_access*',
		body: getSearhBody(reqBody)
	}).then(results => {
		let bucketsKeys = [];
		let bucketsCounts = [];

		let errorNumSearch = [];
		results.aggregations.type.buckets.forEach((v,i)=>{
			if( orderByNumber ){
				errorNumSearch.push({
	          		"filter": { "term": { "message.msg.raw": v.key }}, 
	          		"weight": 1000-i
	        	});
			}
			bucketsKeys.push(v.key);
			bucketsCounts.push(v.doc_count);
		});
		if( orderByNumber ){
			client.search({
				size: itemNum,
				from: 0,
				index: 'logstash-web_access*',
				body: {
					    "query" : {
					        "function_score" : {
						        "query": {
						    		"bool": {
						    			"must": [{

                                        "regexp": {
                                            "message.host": localRegexp
                                        }
                                    } ]
                                }
                            },
                            "functions": errorNumSearch,
                            "score_mode": "first"

                        }
                    }
                }
            } ).then( data => {
                res.status( 200 ).json( {
                    code: 200,
                    message: '成功',
                    data: {
                        results: data.hits.hits,
                    	total: data.hits.total,
                        buckets: {
                            keys: bucketsKeys,
                            counts: bucketsCounts
                        },
                        page: {
                            pages: Math.ceil( data.hits.total / itemNum ),
                            currentPage: reqBody.pageNum
                        }
                    }
                } );
            }, data => {
                res.status( 200 ).json( {
                    code: 424,
                    data: data,
                    message: '获取失败'
                } );
            } );
        } else {
            res.status( 200 ).json( {
                code: 200,
                message: '成功',
                data: {
                    results: results.hits.hits,
                    total: results.hits.total,
                    buckets: {
                        keys: bucketsKeys,
                        counts: bucketsCounts
                    },
                    page: {
                        pages: Math.ceil( results.hits.total / itemNum ),
                        currentPage: reqBody.pageNum
                    }
                }
            } );

        }
    }, results => {
        res.status( 200 ).json( {
            code: 424,
            data: results,
            message: '获取失败'
        } );
    } );
};