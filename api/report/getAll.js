/**
 * @author zhaodonghong
 * @fileoverview api report/add.js
 * @date 2017/03/03
 */


module.exports = function(client,req, res){
	let aa = client.search({
		index: 'logstash-web_access*',
		body: {
		    from: 0,
		    query: {
		    	//9255357
		    	//9255499
		    	//"range" :{ "request_time" :{ "gte" :"2017-03-09" }}
		      	//prefix: {'request_url': 'https://m.'}
		      	range: {
		      		"request_url": {
		      			lt: "2017-03-08"
		      		}
		      	}
		    }
		}
	}).then(results => {
		res.status(200).json(results);
	});
}