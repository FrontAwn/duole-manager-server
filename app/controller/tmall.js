const Controller = require('egg').Controller;
const urlencode = require('urlencode');
const excel = require('../utils').excel;
const common = require("../utils").common

class TmallController extends Controller { 

	constructor(ctx) {
		super(ctx);
		this.RedisDB = this.ctx.app.redis.get('default');
		this.SjResource = this.ctx.SjResource;
		this.TmallSjSku = this.ctx.SjResource.TmallSjSku;
	}

	async writeCookie() {
		let { cookie } = this.ctx.query
		await this.RedisDB.set("/tmall/sj/cookie",cookie)
		this.ctx.body = true
	}

	async cleanCookie() {
		await this.RedisDB.del("/tmall/sj/cookie")
		this.ctx.body = true
	}

	async truncateTable() {
		await this.SjResource.transaction(async t=>{
			await this.TmallSjSku.truncate({transaction:t})
		})
		this.ctx.body = true
	}

	async saveSkuDetails() {
		let body = Object.values(this.ctx.request.body)[0]
		body = body.replace(/[\r\n]/g,"@@@@@")
		body = body.split("@@@@@").filter(content=>{
			return content !== ""
		})
		let [key,datas] = body
		datas = JSON.parse(datas)
		let chunks = common.getChunks(datas)
		for ( let [idx,chunk] of chunks.entries() ) {
			await this.SjResource.transaction(async t=>{
				await this.TmallSjSku.bulkCreate(chunk,{transaction:t})
			})
		}
		this.ctx.body = true
	}


}

module.exports = TmallController