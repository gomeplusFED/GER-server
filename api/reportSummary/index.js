/**
 * @author jingyu
 * @fileoverview api reportSummary
 * @date 2017/12/14
 */
var reportSummary = require( './reportSummary' );

module.exports = [
  {
    router: '/reportSummary/getSummary',
    type: 'post',
    apiToDo: reportSummary
  }
];