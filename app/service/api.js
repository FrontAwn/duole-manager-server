const Service = require('egg').Service
var debug = require('../utils/utils').common.debug;
var moment = require('moment')
var redis = require('../utils/redis')
var Common = require('../core/Common')


class ApiService extends Service {

	constructor(ctx) {
		super(ctx)
		this.RedisDB = redis.getDatabase('default').getOriginal()
	}

	async finds(params) {

        let db = this.ctx[params['db']] || this.ctx.SjResource
        if ( !params.hasOwnProperty('table') || !db[params['table']] ) {
            throw new Error(`参数table不能为空，或者当前数据库没有对应table，请确认table的准确`)
            return;
        }
        let model = db[params['table']]
        let conditions = {}
        conditions['where'] = params.hasOwnProperty('where') ? params['where'] : {id:{'$gt':0}}
        conditions['attributes'] = params.hasOwnProperty('attrs') ? params['attrs'] : ['*']
        conditions['raw'] = true
        if ( params['order'] ) conditions['order'] = params['order']
        if ( params['group'] ) conditions['group'] = params['group']
        if ( params['page'] || params['length'] ) {
            let page = params['page'] || 1
            let length = params['length'] || 10000
            let limit = parseInt(length)
            let offset = (parseInt(page) - 1) * length;
            conditions['offset'] = offset
            conditions['limit'] = limit
        }

        let res = await model.findAll(conditions)
        return res

	}

	async count(params) {
        let db = this.ctx[params['db']] || this.ctx.SjResource
        if ( !params.hasOwnProperty('table') || !db[params['table']] ) {
            throw new Error(`参数table不能为空，或者当前数据库没有对应table，请确认table的准确`)
            return;
        }
        let model = db[params['table']]
        let attr = params['attrs'] || "*"
        let conditions = {}
        conditions['where'] = params.hasOwnProperty('where') ? params['where'] : {id:{'$gt':0}}
        conditions['attributes'] = [
            [
                this.ctx.app.Sequelize.fn('COUNT',this.ctx.app.Sequelize.col(attr)),
                'count'
            ]
        ]
        conditions['raw'] = true
        let res = await model.findOne(conditions)
		return res;
	}

	async update(params) {

	}

	async delete(params) {

	}

	async create(params) {

	}
	
}

module.exports = ApiService;










