const Service = require('egg').Service
var debug = require('../utils/utils').common.debug;
var moment = require('moment')
var redis = require('../utils/redis')
var Common = require('../core/Common')
const Container = require('../core/Container.js');
const Excel = require('../core/Excel.js');

const EXCEPT_SKU = 3

class DuAppService extends Service {

	constructor(ctx) {
		super(ctx)
		this.RedisDB = redis.getDatabase('default').getOriginal()
		this.DuSkusModel = this.ctx.SjResource.DuSkus;
		this.DuSkuDetailModel = this.ctx.SjResource.DuSkuDetail;
	}

	async updateSkus(skus) {
		let datas = await this.DuSkusModel.findAll({
			raw:true,
			attributes:['sku'],
			where:{
				id:{
					"$gt":0
				}
			}
		})

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

	
	async exportDetails(conditions) {
		let res = await this.DuSkuDetailModel.findAll({
			raw:true,
			where:conditions
		})

		if ( res.length === 0 ) {
			throw new Error('没有搜索到数据库结果')
			return false;
		}

		let datas = []
        for ( let idx in res ) {
            let data = res[idx]
            let sizeList = JSON.parse(data['size_list'])
            for ( let size in sizeList ) {
                let details = sizeList[size]
                let price = "--"
                if ( details['price'] ) {
                    price = details['price']
                }
                datas.push({
                    'sku':data['sku'],
                    'title':data['title'],
                    'size':size,
                    'price':price,
                    'sold_num':data['sold_num'],
                })
            }
        }
        let templatePath = Container.get('paths')['templates']
        let tamplateName = '毒app抓取数据_template.xlsx'
        let templateFile = templatePath+'/'+tamplateName
        let excelBuffer = await Excel.getRenderExcelBuffer(templateFile,datas)
        return excelBuffer;
	}

}

module.exports = DuAppService;










