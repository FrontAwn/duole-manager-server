const Controller = require('egg').Controller;
const promisify = require("util").promisify
const fs = require("fs")
const child_process = require("child_process")
const execFile = promisify(child_process.execFile)
const exec = promisify(child_process.exec)
const readFile = promisify(fs.readFile);
const urlencode = require('urlencode');
const moment = require("moment")
const spawn = child_process.spawn;


class NikeController extends Controller {

	async getChangeList() {
		let ls = await this.service.api.finds(this.ctx.query);
		let count = await this.service.api.count(this.ctx.query);
		this.ctx.body = {
			count,
			ls
		}
	}

	async getSkuInfo() {
		let {sku} = this.ctx.query;
		let allsizes = {}
  		let sizes = {}
		let info = await this.service.nike.getInfoBySku(sku)
		let stock = await this.service.nike.getRealTimeStockBySku(sku);

		if (stock.length > 0) {

			allsizes = stock[0].productAvailabilities
			if (allsizes && allsizes.length > 0) allsizes = allsizes[0]
			if (allsizes.availabilities) allsizes = allsizes.availabilities
			console.log('allsizes:',allsizes)

			if (allsizes) {

				allsizes.forEach((it) => {
					if (it.date > (+ new Date())) {

					} else {
						sizes = {}
						it.sizes.forEach((ob) => {
							sizes[`${ob.code}`] = ob.quantity
						})
					}
				})	 
			} else {

			}
		}

		if (info && info.length > 0) info = info[0]

		info.languages.forEach((it) => {
			if(it.locale.language.toUpperCase() === 'ZH'){

				for(const k in it){
					info[k] = it[k]
				}
			}
		})
		delete info.languages

		this.ctx.body = {
			sizes,
		    batches: allsizes,
		    info,		
		}
		
	}


	// 执行导出nike官网库存命令 node /node/duole-erp-cli/nikeToXls.js
	async execGenerateStockCommand() {
		let filePath = "/node/duole-erp-cli"
		let fileName = "nikeToXls.js"
		let res = await exec(`cd ${filePath} && node ${fileName}`,{
			maxBuffer:200*1024*1024
		})
		this.ctx.body = true
	}

	// 把已经导出的nike库存下载到本地
	async downloadStockExcelFile() {
		let stockFile = `/node/duole-erp-cli/excel/output/库存.xlsx`
		let excelBuffer = await readFile(stockFile)	
		let currentDayDate = moment().format('YYYYMMDD');
		let excelName = `Nike库存${currentDayDate}.xlsx`
		let downloadFileName = urlencode(excelName,"UTF-8");
        this.ctx.set({
            'Content-Type': 'application/force-download; charset=utf-8',
            'Content-Disposition': "attachment; filename* = UTF-8''"+downloadFileName,
        })
        this.ctx.body = excelBuffer;
	}

}

module.exports = NikeController