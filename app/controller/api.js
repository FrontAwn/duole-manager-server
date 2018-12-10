const Controller = require('egg').Controller;
const path = require('path');
var common = require('../utils/utils').common
var moment = require('moment')

class ApiController extends Controller {

    async query () {

        // let {db,table,attributes,where} = this.ctx.query

    }

    async update () {
        let {db,table,content,where} = this.ctx.query
        let database = this.ctx[db]
        let model = this.ctx[db][table]
        let updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        content = JSON.parse(content)
        where = JSON.parse(where)
        content['update_time'] = updateTime;
        let count = 0
        await database.transaction(async t=>{
            let res = await model.update(content,{
                where,
                transaction:t
            })
            count = res.length
        })
        if ( count === 1 ) {
            common.success({'status':'更新成功'})
        } else {
            common.error({'status':'更新失败'})
        }
    }

    async insert () {

    }

    async inserAll () {

    }

}


module.exports = ApiController;
