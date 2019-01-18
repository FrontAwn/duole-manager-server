const Controller = require('egg').Controller;
const common = require('../utils/utils').common
const promisify = require("util").promisify
const fs = require("fs")
const child_process = require("child_process")
const execFile = promisify(child_process.execFile)
const exec = promisify(child_process.exec)
const readFile = promisify(fs.readFile);
const urlencode = require('urlencode');
const moment = require("moment")

class NikeController extends Controller {

	async getChangeList() {

	}

	async getSkuInfo() {
		await this.service.nike.getHeader();
	}

	async exportStock() {
		await exec("node /node/duole-erp-cli/nikeToXls.js",{maxBuffer:200*1024*1024})
		let excelBuffer = await readFile("/node/duole-erp-cli-local/excel/output/库存.xlsx")
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