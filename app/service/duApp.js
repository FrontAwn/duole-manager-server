const Service = require('egg').Service
var debug = require('../utils/utils').common.debug;
var moment = require('moment')
var redis = require('../utils/redis')
var Common = require('../core/Common')

const EXCEPT_SKU = 3

class DuAppService extends Service {

	constructor(ctx) {
		super(ctx)
		this.RedisDB = redis.getDatabase('default').getOriginal()
		this.DuSkusModel = this.ctx.SjResource.DuSkus;
		this.DuSkuDetailModel = this.ctx.SjResource.DuSkuDetail;
	}


	async getAllSkus(attrs='*') {

		let conditions = {
			raw:true,
			where:{
				id:{
					$gt:0
				}
			}
		}

		if ( attrs !== '*' ) {
			conditions['attributes'] = attrs
		}		

		return await this.DuSkusModel.findAll(conditions)
		
	}

	async getAllDetails () {
		let conditions = {
			raw:true,
			where:{
				id:{
					$gt:0
				}
			}
		}
		return await this.DuSkuDetailModel.findAll(conditions)
	}

	async getSkuByState(state,attrs='*') {

		let conditions = {
			raw:true,
			where:{
				id:{
					$gt:0
				},
				state,
			},
		}

		if ( attrs !== '*' ) {
			conditions['attributes'] = attrs
		}

		return await this.DuSkusModel.findAll(conditions)

	}


	async updateSkus(skus) {

		let datas = await this.getAllSkus(['sku']);

		let totalSkus = [] 

		datas.forEach((data,idx)=>{
			totalSkus.push(data['sku'])			
		})

		let newSkusCount = 0

		let skusByIndex = Common.indexBy(skus,'sku');

		let newSkus = []

		let existsSkus = []

		totalSkus.forEach((sku,idx)=>{
			if ( skusByIndex.hasOwnProperty(sku) ) {
				existsSkus.push(skusByIndex[sku])
				Reflect.deleteProperty(skusByIndex,sku)
			}
		})

		newSkus = Object.values(skusByIndex)

		if ( newSkus.length !== 0 ) {
			await this.ctx.SjResource.transaction(async t=>{
				let res = await this.DuSkusModel.bulkCreate(newSkus,{transaction:t})
				newSkusCount = res.length;
			})
		}

		let existsSkusCount = existsSkus.length

		// debug(newSkusCount,'newSkusCount')
		// debug(existsSkusCount,'existsSkusCount')

		return {newSkusCount,existsSkusCount};
	}

	async updateSkuTargetName(sku,targetName) {
		let updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
		let conditions = {
			'target_name':targetName,
			'update_time':updateTime,
		}
		let updateCount = 0
		await this.ctx.SjResource.transaction(async t=>{
			let res = await this.DuSkusModel.update(conditions,{
				where:{
					sku:sku,
				},
				transaction:t,
			})
			updateCount = res[0];
		})

		return updateCount;
	}

	async updateSkuState(sku,state) {
		let updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
		let conditions = {
			'state':state,
			'update_time':updateTime,
		}
		let updateCount = 0
		await this.ctx.SjResource.transaction(async t=>{
			let res = await this.DuSkusModel.update(conditions,{
				where:{
					sku:sku,
				},
				transaction:t,
			})
			updateCount = res[0];
		})

		return updateCount;

	}


	async updateSkuOffset(sku,offset) {
		let updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
		let conditions = {
			'offset':offset,
			'update_time':updateTime,
		}
		let updateCount = 0
		await this.ctx.SjResource.transaction(async t=>{
			let res = await this.DuSkusModel.update(conditions,{
				where:{
					sku:sku,
				},
				transaction:t,
			})
			updateCount = res[0];
		})

		return updateCount;
	}

	async updateSkuExceptContent(sku,exceptContent) {
		let updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
		let conditions = {
			'except_content':exceptContent,
			'update_time':updateTime,
		}
		let updateCount = 0
		await this.ctx.SjResource.transaction(async t=>{
			let res = await this.DuSkusModel.update(conditions,{
				where:{
					sku:sku,
				},
				transaction:t,
			})
			updateCount = res[0];
		})

		return updateCount;

	}

}

module.exports = DuAppService;










