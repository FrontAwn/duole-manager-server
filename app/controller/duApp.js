const Controller = require('egg').Controller;
const path = require('path');
const common = require('../utils/utils').common
const container = require('../core/Container.js')
const file = require('../core/File.js')
const moment = require('moment')
const ejsexcel = require('ejsexcel');
const fs = require('fs')
const urlencode = require('urlencode');

class DuAppController extends Controller {

    async saveSkus() {
        let {skus} = this.ctx.request.body
        skus = JSON.parse(skus)
        let timer = moment().format('YYYY-MM-DD HH:mm:ss');
        let targetSkus = [];
        skus.forEach((sku,idx)=>{
            let data = {sku,'create_time':timer}
            targetSkus.push(data)
        })
        
        let skusCountDetail = await this.service.duApp.updateSkus(targetSkus)

        common.success({
            'new':skusCountDetail['newSkusCount'],
            'exists':skusCountDetail['existsSkusCount']
        })

    }

    async exportCurrentDayDetails() {
        let currentDayDate = moment().format('YYYY-MM-DD');
        let condition = {
            'update_time':currentDayDate
        }
        let excelBuffer = await this.service.duApp.exportDetails(condition);
        let downloadTimer = moment(currentDayDate).format('YYYYMMDD');
        let excelName = `毒app${downloadTimer}.xlsx`
        let downloadPath = container.get('paths')['downloads']
        let excelFile = downloadPath+'/duapp/'+excelName
        fs.writeFileSync(excelFile,excelBuffer)
        let downloadFileName = urlencode(excelName,"UTF-8");
        this.ctx.set({
            'Content-Type': 'application/force-download; charset=utf-8',
            'Content-Disposition': "attachment; filename* = UTF-8''"+downloadFileName,
        })
        this.ctx.body = excelBuffer;
    }

    async exportHistoryDetails() {
        let {date} = this.ctx.query
        let condition = {
            'update_time':date
        }
        let excelBuffer = await this.service.duApp.exportDetails(condition);
        let downloadTimer = moment(date).format('YYYYMMDD');
        let excelName = `毒app${downloadTimer}.xlsx`
        let downloadPath = container.get('paths')['downloads']
        let excelFile = downloadPath+'/duapp/'+excelName
        fs.writeFileSync(excelFile,excelBuffer)
        let downloadFileName = urlencode(excelName,"UTF-8");
        this.ctx.set({
            'Content-Type': 'application/force-download; charset=utf-8',
            'Content-Disposition': "attachment; filename* = UTF-8''"+downloadFileName,
        })
        this.ctx.body = excelBuffer;
    }


}


module.exports = DuAppController;
