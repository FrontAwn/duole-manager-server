const Controller = require('egg').Controller;
var common = require('../utils/utils').common
var ejsexcel = require('ejsexcel')
var fs = require('fs')
var mysql = require('../utils/mysql')
var cache = require('../utils/cache')
var moment = require('moment')

class TaobaoController extends Controller {

	// 导出淘宝店铺商品列表
	async exportTaobaoProductList() {
		var self = this
		var SjResourceDB = mysql.get('sj_resource');
		var templatePath = cache.getItem('__TEMPLATES__');
		var downloadPath = cache.getItem('__DOWNLOADS__');
		var taobaoProductListTemplate = templatePath+'/淘宝商品列表_template.xlsx'
		var taobaoProductListExcelFile = `${downloadPath}/淘宝商品列表_${moment().format('YYYY-MM-DD HH-mm-ss')}.xlsx`
		var product = []
		var products = []
		await SjResourceDB.scope(async conn=>{
			product = await SjResourceDB.finds('taobao_product',{
				'where':{'id':{greaterThen:0}}
			},conn)

			products = await SjResourceDB.finds('taobao_products',{
				'where':{'id':{greaterThen:0}}
			},conn)
		})
		var res = {product,products}
		const excelModel = fs.readFileSync(taobaoProductListTemplate);
		try {
			var buildedExcelBuffer = await ejsexcel.renderExcel(excelModel,res)
			fs.writeFileSync(taobaoProductListExcelFile,buildedExcelBuffer)
			common.success({'file':taobaoProductListExcelFile})
		} catch(e) {
			throw new Error(e)
		}
	}

}


module.exports = TaobaoController