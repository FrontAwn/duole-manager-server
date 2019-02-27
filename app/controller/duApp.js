const Controller = require('egg').Controller;
const path = require('path');
const container = require('../utils').container
const moment = require('moment')
const fs = require('fs')
const urlencode = require('urlencode');

class DuAppController extends Controller {

    async saveSkus() {
        const DuappResource = this.ctx.DuappResource
        const SelfProductList =  this.ctx.DuappResource.SelfProductList
        let { skus } = this.ctx.request.body
        let newSkus = JSON.parse(skus)
        let allSkus = []
        let hasSkus = []
        let diffSkus = []
        const createAt = moment().format("YYYY-MM-DD")
        let res = await SelfProductList.findAll({
            raw:true,
            attributes:["sku"],
            where:{
                id:{
                    "$gt":0
                }
            }
        })
        res.forEach(content=>{
            allSkus.push(content.sku)
        })
        newSkus.forEach(sku=>{
            if ( allSkus.includes(sku) ) {
                hasSkus.push(sku)
            } else {
                diffSkus.push({
                    sku,
                    "type":0,
                    "create_at":createAt
                })
            }
        })
        if ( diffSkus.length > 0 ) {
            await DuappResource.transaction(async t=>{
                await SelfProductList.bulkCreate(diffSkus,{transaction:t})
            })    
        }
        this.ctx.body = {
            code:200,
            data:{
                'new':diffSkus.length,
                'exists':hasSkus.length    
            }
        }
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
