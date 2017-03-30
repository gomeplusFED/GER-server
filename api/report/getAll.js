/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */
var getSearhBody = function(v, d, i, j){

	let name = v + '|' + j + '|' + i;
	let regexp = '.*' + v.replace(/\./g,"\.") + '.*';
	let timestamp = {
						"gte": "now-"+ parseInt(d) +"d/d",
						"lte": "now/d"
					}
	if( i === 0 ){
		timestamp = {
						"gt": "now-1d/d"
					}
	}
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
								}
							],
							"filter": [
								{
									"range": {
										"@timestamp": timestamp
									}
								}
							]
			    		}
					}
		};
	//15天错误数/类型数/最高错误类型
	if(i === 2 ){
		searchBody.aggregations = {
					    			[name]: {
										"terms": {
											"field": "lbs_ip.raw"
										}
									}
					    		};

		searchBody.sort =[
							{
								"@timestamp": {
									"order": "desc" //asc正序(默认)    desc倒序
								}
							}
						];
	}else if( i === 3){
		//15天错误脚本数
		searchBody.aggregations = {
					    			[name]: {
										"terms": {
											"field": "client_ip.raw"
										}
									}
					    		};

		searchBody.sort =[
							{
								"@timestamp": {
									"order": "desc" //asc正序(默认)    desc倒序
								}
							}
						];
	}
	return searchBody;
};

module.exports = function(req, res){
	let client = this;
	let itemNum = req.body.size || 10;
	let from = (req.body.pageNum - 1) * itemNum; 
	let watchUrl = req.body.watchUrl;
	let search = [];
	let days = [0, 7, 15, 15];
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
			
			
			let data = results.responses;
			let result = [];
			let child = {};
			let agg = '';
			let key = '';
			//number0 => 今日错误数;
			//number1 => 7日错误数;
			//number2 => 15日错误数;
			//number3 => 15日报错脚本数;
			//local => 域名;
			//errorType => 15日错误类型数
			//highError => 15日最高错误类型;
			data.forEach((v, i)=>{
				if( v.aggregations ){
					if( i % 4 === 2 ){
						agg = v.aggregations;
						key = Object.keys(agg)[0];
						child['number2'] = v.hits.total;
						child['local'] = key.split('|')[0];
						child['errorType'] = v.aggregations[key].buckets.length;
						child['highError'] = v.aggregations[key].buckets[0].key;
					}else if( i % 4 === 3 ){
						agg = v.aggregations;
						key = Object.keys(agg)[0];
						child['number3'] = v.aggregations[key].buckets.length
					}
				}else{
					child[ 'number' + i%4] = v.hits.total;
				}

				if( i % 4 === 3 && i !== 0){
					result.push(child);
					child = {};
				}
			});
			res.status(200).json({
				code: 200,
				message: '获取成功',
				data: result
			});
		});
	}else{
		res.status(200).json({
			code: 424,
			message: '参数错误'
		});
	}
};