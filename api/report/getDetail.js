/**
 * @author zhaodonghong
 * @fileoverview api report/getAll.js
 * @date 2017/03/03
 */
module.exports = function ( req, res ) {
    let client = this;
    client.search( {
        size: 10,
        from: 0,
        index: req.body.index,
        body: {
            "filter": {
                "terms": {
                    "_id": [ req.body.id ]
                }
            }
        }
    } ).then( results => {
        res.status( 200 ).json( {
            code: 200,
            message: '获取成功',
            data: results.hits.hits[ 0 ]._source
        } );
    }, results => {
        res.status( 200 ).json( {
            code: 200,
            message: '失败',
            data: results
        } );
    } );
};