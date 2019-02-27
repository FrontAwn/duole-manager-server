const Service = require('egg').Service
var moment = require('moment')
var common = require('../utils').common
var debug = common.debug
const container = require('../utils').container
const excel = require('../utils').excel;

const EXCEPT_SKU = 3

class DuAppService extends Service {

	constructor(ctx) {
		super(ctx)
		this.RedisDB = this.ctx.app.redis.get('default')
		this.DuSkusModel = this.ctx.SjResource.DuSkus;
		this.DuSkuDetailModel = this.ctx.SjResource.DuSkuDetail;
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
        let templatePath = container.get('paths')['templates']
        let tamplateName = '毒app抓取数据_template.xlsx'
        let templateFile = templatePath+'/'+tamplateName
        let excelBuffer = await excel.getExcelBuffer(templateFile,datas)
        return excelBuffer;
	}

}

module.exports = DuAppService;










