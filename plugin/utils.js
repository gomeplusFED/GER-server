/**
 * @author zhaodonghong
 * @fileoverview api  getUserList.js
 * @date 2017/03/03
 */
let utils = {
	replacePoint: ( str ) => {
	    return '.*' + str.replace( /\./g, "\." ) + '.*';
	},
	getTimeRange: (reqBody) => {
	    //搜索期限
	    let lastDays = reqBody.lastDays || 1;
	    return lastDays === 1 ? {
	            "gt": "now-1d/d"
	        } : {
	            "gte": "now-" + parseInt( lastDays ) + "d/d",
	            "lte": "now/d"
	        };
	},
	getSearhBody: ( reqBody ) => {
	    //搜索域名
	    let local = reqBody.local;
	    //排序
	    // let order = reqBody.order;
	    //pc/mobile
	    let typeDevice = reqBody.typeDevice;
	    //搜索类型
	    let searchType = reqBody.type || '';
	    //搜索关键词
	    let searchKey = reqBody.keyWord || '';
	    let localRegexp = utils.replacePoint( local );
	    let mustSearch = [ {
	            "regexp": {
	                "message.host": localRegexp
	            }
	        },
	        {
	            "match": {
	                "message.log_master": "js"
	            }
	        }
	    ];
	    if ( searchKey ) {
	        mustSearch.push( {
	            "regexp": {
	                [ searchType ]: utils.replacePoint( searchKey )
	            }
	        } );
	    }
	    if(typeDevice && typeDevice !== 'all'){
	        mustSearch.push( {
	            "match": {
	                "message.projectType": typeDevice
	            }
	        } );
	    }
	    let searchBody = {
	        "query": {
	            "bool": {
	                "must": mustSearch,
	                "filter": {
	                    "range": {
	                        "@timestamp": utils.getTimeRange(reqBody)
	                    }
	                }
	            }
	        },
	        "aggregations": {
	            
	        },
	        "sort": [ {
	            "@timestamp": {
	                "order": "desc" //asc正序(默认)    desc倒序
	            }
	        } ]
	    };
	    if( reqBody.forms ){
	    	let lastDays = reqBody.lastDays || 1;
	    	let interval = lastDays > 1 ? 'day' : 'hour';
	    	searchBody.aggregations.forms = {
								                "date_histogram": {
								                    "field": "@timestamp",
								                    "interval": interval
								                }

								            };
	    }else{
	    	searchBody.aggregations.type = {
								                "terms": {
								                    "field": "message.msg.raw"
								                }

								            };
	    }
	    return searchBody;
	}
}
module.exports = utils;