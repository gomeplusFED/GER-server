/**
 * @author jingyu
 * @fileoverview api reportSummary
 * @date 2017/12/14;
 */

let utils = require( '../../plugin/utils' );
module.exports = function ( req, res ) {
  let client = this;
  let reqBody = req.body;
  client.search( {
    index: 'log_count',
    type: 'count',
    body: wrapSearchBody( reqBody )
  } ).then( resWrap => {
    res.status( 200 ).json( {
      code: 200,
      message: '成功',
      data: fixResponseData(resWrap.hits.hits)
    } );
  }, results => {
    res.status( 200 ).json( {
      code: 424,
      data: results,
      message: '获取失败'
    } );
  } );
};

function wrapSearchBody(body) {
  const range = body.lastDays ? utils.getTimeRange(body) : {}
  return {
    "size": 186, // 最多返回半年的数据
    "query": {
      "range" : {
        "date" : range
      }
    },
    "sort": [ {
      "date": {
        "order": "asc" //asc正序(默认)    desc倒序
      }
    } ]
  }
}

function fixResponseData(data) {
  const result = [];
  data.forEach(function (item) {
    result.push(item._source);
  });
  return result;
}