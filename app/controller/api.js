const Controller = require('egg').Controller;
const path = require('path');
var moment = require('moment')

class ApiController extends Controller {

    async finds () {
        let query = this.ctx.query;
        let db = this.ctx[query['db']] || this.ctx.SjResource
        if ( !query.hasOwnProperty('table') || !db[query['table']] ) {
            throw new Error(`参数table不能为空，或者当前数据库没有对应table，请确认table的准确`)
            return;
        }
        let model = db[query['table']]
        let conditions = {}
        conditions['where'] = query.hasOwnProperty('where') ? JSON.parse(query['where']) : {id:{'$gt':0}}
        conditions['attributes'] = query.hasOwnProperty('attrs') ? JSON.parse(query['attrs']) : ['*']
        conditions['raw'] = true
        if ( query['order'] ) conditions['order'] = JSON.parse(query['order']);
        if ( query['group'] ) conditions['group'] = query['group']
        if ( query['page'] || query['length'] ) {
            let page = query['page'] || 1
            let length = query['length'] || 10000
            let limit = parseInt(length)
            let offset = (parseInt(page) - 1) * length;
            conditions['offset'] = offset
            conditions['limit'] = limit
        }

        let res = await model.findAll(conditions)
        this.ctx.body = {data:res}
    }

    async count () {

        let query = this.ctx.query;
        let db = this.ctx[query['db']] || this.ctx.SjResource
        if ( !query.hasOwnProperty('table') || !db[query['table']] ) {
            throw new Error(`参数table不能为空，或者当前数据库没有对应table，请确认table的准确`)
            return;
        }
        let model = db[query['table']]
        let attr = query['attrs'] || "*"
        let conditions = {}
        conditions['where'] = query.hasOwnProperty('where') ? JSON.parse(query['where']) : {id:{'$gt':0}}
        conditions['attributes'] = [
            [
                this.ctx.app.Sequelize.fn('COUNT',this.ctx.app.Sequelize.col(attr)),
                'count'
            ]
        ]
        conditions['raw'] = true
        let res = await model.findOne(conditions)
        this.ctx.body = {data:res['count']}


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
            this.ctx.body = {data:{'status':'更新成功'}}
        } else {
            this.ctx.body = {data:{'status':'更新失败'}}
        }
    }

    // async create () {

    // }

    // async delete () {
        
    // }

}


module.exports = ApiController;
