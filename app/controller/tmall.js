const Controller = require('egg').Controller;
const urlencode = require('urlencode');
const excel = require('../utils').excel;


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
		let body = ""

		function end() {
			console.log(body)
		}

		this.ctx.req.on("data",chunk=>{
			body += chunk
		})
		this.ctx.req.on("end",end)
	}


}

module.exports = TmallController