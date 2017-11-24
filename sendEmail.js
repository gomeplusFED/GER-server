let config = require( './config.js' );
let elasticsearch = require( 'elasticsearch' );
let client = new elasticsearch.Client( config.elasticsearch() );
let nodemailer = require('nodemailer');  
let readFile = require('./plugin/readFile');  
let transporter = nodemailer.createTransport({  
    service: '126',  
    auth: {  
        user: 'gome_error_report@126.com',  
        pass: 'ger11693' 
  
    }  
});  
//获取ES DSL语句
function getSearchBody(hostArr){
    let host = hostArr[0];
    let type = hostArr[1] ? hostArr[1] : 'all';
    let regexp = '.*' + host.replace( /\./g, "\." ) + '.*';
    let typeName = host + '^type^' + type;
    let result = {
        "query":
            {
                "bool":{
                    "must":[
                        {
                          "regexp":{
                            "message.host": regexp
                          }
                        },{
                        "match":{
                          "message.log_master":"js"
                          }
                        }
                    ],
                    "filter":[
                        {"range":
                                {
                                "@timestamp":{
                                  "gt":"now-1d/d"
                                }

                            }
                        }
                    ]
                }
            },
        "aggregations":{
            [typeName]:
                {"terms":
                    {"field":"message.msg.raw"}
                }
        },
        "sort":[{"@timestamp":{"order":"desc"}}]
    }
    if(type !== 'all'){
        result.query.bool.must.push({
            "match": {
                "message.projectType": type.toUpperCase()
            }
        });
    }
    return  result;
}
//根据DSL查询数据
function getWatchData(selector, email){
    client.msearch({
        size: 10,
        from: 0,
        body: selector
    }).then(result => {
        sendEmail(result, email);
    }, result => {
        sendEmail();
    });
}
var schedule = require('node-schedule');
 
var j = schedule.scheduleJob('0 0 22 * * *', function(){
    readFile( './user.json', function(err, data){
        if(!err){
            let userList = JSON.parse(data);
            for( let v in userList){
                if(userList[v].openEmail){
                    let searchBody = [];
                    let watchUrls = userList[v].watchUrl.replace( /[\r\n]/g, '^' ).split('^');
                    for(let i = 0, len = watchUrls.length; i < len; i++){
                        if( watchUrls[i].length > 0 ){
                            let watchHost = watchUrls[i].split('|');
                            searchBody.push( {
                                index: 'logstash-web_access*'
                            });
                            searchBody.push(getSearchBody(watchHost));
                        }
                    }
                    getWatchData(searchBody, userList[v].email.replace( /[\r\n]/g, '' ));
                }
            }
        }
    });
});
//邮件主体
function getEmailContent(data) {
    let html = `<h2 style="font:26px/40px '微软雅黑',sans-serif;">`+ dateFormat()  +`前端异常报告</h2>`;
    for (let i = 0, len = data.responses.length; i <len; i++) {
        let keys = [];
        for (let key in data.responses[i].aggregations) {
            keys.push(key);
        }
        html += `<h2 style="font:20px/40px '微软雅黑',sans-serif;">监测域名总览：</h2>
                <table border-collapse="collapse" width="100%"  style="text-align:center;color:#666;font-size:14px;line-height:28px;font-family:'微软雅黑', arial,sans-serif;padding:0;margin:0;border-spacing:0;border:1px #ccc solid;border-style:solid solid none none;">
                    <thead>
                        <tr style="font-size: 16px;line-height: 32px;background:#eee;color:#000;">
                            <td style="width: 17%;border:1px #ccc solid;border-style:none none solid solid ;">监测域名</td>
                            <td style="width: 13%;border:1px #ccc solid;border-style:none none solid solid ;">监测终端</td>
                            <td style="width: 10%;border:1px #ccc solid;border-style:none none solid solid ;">今日错误总数</td>
                            <td style="border:1px #ccc solid;border-style:none none solid solid ;">今日最高错误类型</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="line-height: 24px;">
                            <td style="border:1px #ccc solid;border-style:none none solid solid ;">`+ keys[0].split('^')[0] +`</td>
                            <td style="border:1px #ccc solid;border-style:none none solid solid ;">`+ (keys[0].split('^')[2] === 'all' ? '全部' : keys[0].split('^')[2] ) +`</td>
                            <td style="border:1px #ccc solid;border-style:none none solid solid ;">`+ data.responses[i].hits.total +`</td>
                            <td style="text-align:center;padding:0 20px;word-break:break-all;border:1px #ccc solid;border-style:none none solid solid ;text-align: left;">`+ ( data.responses[i].aggregations[keys[0]].buckets[0] ? decodeURIComponent(data.responses[i].aggregations[keys[0]].buckets[0].key) : '') +`</td>
                        </tr>
                    </tbody>
                </table>`;
        let hits = data.responses[i].hits.hits;
        let listLen = hits.length;
        if( listLen > 0 ){
            html += `<h2 style="font:20px/40px '微软雅黑',sans-serif;">错误列表：</h2>
                    <table border-collapse="collapse" width="100%"  style="text-align:center;color:#666;font-size:14px;line-height:28px;font-family:'微软雅黑',sans-serif;padding:0;margin:0;border-spacing:0;border:1px #ccc solid;border-style:solid solid none none;">
                    <thead>
                        <tr style="font-size: 16px;line-height: 32px;background:#eee;color:#000;">
                            <td style="width:20%;border:1px #ccc solid;border-style:none none solid solid ;">错误链接</td>
                            <td style="width:10%;border:1px #ccc solid;border-style:none none solid solid ;">错误行号</td>
                            <td style="width:10%;border:1px #ccc solid;border-style:none none solid solid ;">错误列号</td>
                            <td style="width:25%;border:1px #ccc solid;border-style:none none solid solid ;">错误文件链接</td>
                            <td style="width:25%;border:1px #ccc solid;border-style:none none solid solid ;">错误信息</td>
                            <td style="width:10%;border:1px #ccc solid;border-style:none none solid solid ;">更多操作</td>
                        </tr>
                    </thead>
                    <tbody>`;

            for( let j = 0; j < listLen; j++){
                html += `<tr style="line-height: 24px;">
                    <td style="border:1px #ccc solid;border-style:none none solid solid ;">
                        <div style="padding: 5px 20px;text-align: left;word-break:break-all;">`+ data.responses[i].hits.hits[j]._source.message.currentUrl +`</div>
                    </td>
                    <td style="border:1px #ccc solid;border-style:none none solid solid ;">`+ data.responses[i].hits.hits[j]._source.message.rowNum +`</td>
                    <td style="border:1px #ccc solid;border-style:none none solid solid ;">`+ data.responses[i].hits.hits[j]._source.message.colNum +`</td>
                    <td style="border:1px #ccc solid;border-style:none none solid solid ;">
                        <div style="padding: 0 20px;text-align: left;word-break:break-all;">`+ data.responses[i].hits.hits[j]._source.message.targetUrl +`</div>
                    </td>
                    <td style="border:1px #ccc solid;border-style:none none solid solid ;">
                        <div style="padding: 3px 20px;text-align: left;word-break:break-all;">`+ decodeURIComponent(data.responses[i].hits.hits[j]._source.message.msg) +`</div>
                    </td>
                    <td style="border:1px #ccc solid;border-style:none none solid solid ;">
                        <a href="http://monitor.pluspc.dev.gomeplus.com/report/detail?id=`+ data.responses[i].hits.hits[j]._id + `&index=`+ data.responses[i].hits.hits[j]._index +`&href=`+ keys[0].split('^')[0] +`" style="color:#666;text-decoration:none;">查看更多</a>
                    </td>
                </tr>`;
            }
            if( data.responses[i].hits.total > 10 ){
                html += `<tr>
                            <td colspan="6" style="text-align: right;border:1px #ccc solid;border-style:none none solid solid ;">
                                <a href="http://monitor.pluspc.dev.gomeplus.com/report/list?href=`+ keys[0].split('^')[0] + `&type=`+ (keys[0].split('^')[2] === 'all' ? 'all' : keys[0].split('^')[2].toUpperCase() ) +`" style="text-decoration:none;margin:0 20px 0 0">查看所有异常</a>
                            </td>
                        </tr>`;
            }
            html += `</tbody>
                    </table>`;
        }
        
    }
    html += `<div style="font:14px/28px '微软雅黑',sans-serif;color:#ff0000">温馨提示：请连接公司内网进行错误列表、错误详情查看！</div>`;
    return html;
}
//日期初始化
function dateFormat(){
    let date = new Date();
    return date.getFullYear() + '-' + (date.getMonth() > 8 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
}
//发送邮件
function sendEmail(data, email){
    let emails = email.split('|');
    for (var i = emails.length - 1; i >= 0; i--) {
        let mailOptions = {  
            from: 'gome_error_report@126.com', // 发送者  
            to: emails[i], // 接受者,可以同时发送多个,以逗号隔开  
            subject: dateFormat() + '前端异常报告', // 标题  
            //text: 'Hello world', // 文本  
            html: getEmailContent(data)   
        };  
        //聚合 data.responses[0].aggregations
        transporter.sendMail(mailOptions, function (err, info) {  
            if (err) {  
              console.log(err);  
              return;  
            }   
        }); 
        
    } 
}
