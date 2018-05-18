/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */
let LRUCache = require('secondary-cache/lib/lru-cache');
let cache = LRUCache(1000);

var getSearhBody = function(v, d, i, j, type) {

  let regexp = '.*' + v.replace(/\./g, "\.") + '.*';
  let timestamp = {
    "gte": "now-" + parseInt(d) + "d/d",
    "lte": "now/d"
  };
  if (i === 0) {
    timestamp = {
      "gt": "now-1d/d"
    };
  }
  let searchBody = {
    "query": {
      "bool": {
        "must": [{
          "regexp": {
            "message.host": regexp
          }
        }, {
          "match": {
            "message.log_master": "js"
          }
        }],
        "filter": [{
          "range": {
            "@timestamp": timestamp
          }
        }]
      }
    }
  };
  //判断是否过滤pc/mobile
  if (type !== 'ALL') {
    searchBody.query.bool.must.push({
      "match": {
        "message.projectType": type
      }
    });
  }
  return searchBody;
};

module.exports = function(req, res) {
  let client = this;
  let itemNum = req.body.size || 10;
  let from = (req.body.page - 1) * itemNum;
  let watchUrl = req.body.watchUrl;
  let search = [];
  let days = [0, 7];
  let keys = ['todayErrorNum', 'weekErrorNum'];
  if (watchUrl) {
    console.log(watchUrl);
    watchUrl.forEach((v, j) => {
      days.forEach((d, i) => {
        search.push({
          index: 'logstash-web_access*'
        });
        search.push(getSearhBody(v.www, d, i, j, v.type.toUpperCase()));
      });
    });
    var searchkey = {
      size: itemNum,
      from: from,
      body: search
    };
    var key = JSON.stringify(searchkey);
    if (cache.has(key)) {
      var data = cache.get(key);
      res.status(200).json({
        code: 200,
        message: '获取成功',
        data: data.result,
        originalData: data.results
      });
      return;
    }
    client.msearch(searchkey).then(results => {
      let data = results.responses;
      let result = [];
      var child = {};
      data.forEach((v, i) => {
        var keyIndex = i % 2;
        var name = keys[keyIndex];
        var key = Math.floor(i / 2);
        child.local = watchUrl[key].www;
        child.type = watchUrl[key].type.toUpperCase();
        child[name] = v.hits ? v.hits.total : 0;
        if (keyIndex === 1) {
          result.push(child);
          child = {};
        }
      });
      cache.set(key, {
        result: result,
        results: results
      }, 1000 * 60 * 10);
      res.status(200).json({
        code: 200,
        message: '获取成功',
        data: result,
        originalData: results
      });
    }, results => {
      res.status(200).json({
        code: 424,
        message: '获取失败',
        originalData: results
      });
    });
  } else {
    res.status(200).json({
      code: 424,
      message: '参数错误'
    });
  }
};
