const Controller = require('egg').Controller;
const path = require('path');
const container = require('../utils').container
const moment = require('moment')
const fs = require('fs')
const urlencode = require('urlencode');
const excel = require("../utils").excel

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

    async getNeedDumpProductCount() {
        let conditions = {
            raw:true,
            attributes:[[this.ctx.app.Sequelize.fn('COUNT',this.ctx.app.Sequelize.col("id")),'count']],
            where:{
                type:2
            }
        }
        let res = await this.service.duApp.getSelfProductList(conditions)
        this.ctx.body = res[0]["count"]
    }

    async getAlreadyDumpProductConut() {
        let { createAt } = this.ctx.query
        let conditions = {
            raw:true,
            attributes:[[this.ctx.app.Sequelize.fn('COUNT',this.ctx.app.Sequelize.col("id")),'count']],
            where:{
                "create_at":createAt
            }
        }
        let res = await this.service.duApp.getSelfProductDetail(conditions)
        this.ctx.body = res[0]["count"]
    }

    async getAllDumpCreateDateList() {
        let conditions = {
            raw:true,
            attributes:['create_at'],
            where:{
                id:{
                    "$gt":0
                }
            },
            group:"create_at"
        }
        let res = await this.service.duApp.getSelfProductDetail(conditions)
        this.ctx.body = res
    }

    async exportDetails() {
        let query = this.ctx.query
        let exportDate = query["date"] || moment().format("YYYY-MM-DD")
        let details = await this.service.duApp.getSelfProductDetail({
            raw:true,
            where:{
                create_at:exportDate
            }
        })
        let exportDatas = []

        for ( let idx in details ) {
            let detail = details[idx]
            let sizeList = JSON.parse(detail["size_list"])
            for ( let [size,price] of Object.entries(sizeList) ) {
                exportDatas.push({
                    sku:detail['sku'],
                    title:detail['title'],
                    sold_total:detail['sold_total'],
                    size,
                    price
                })
            }
        }
        const paths = container.get('paths')
        let excelFileName = `毒app货号详情${moment(exportDate).format("YYYYMMDD")}.xlsx`
        let excelTemplatePath = `${paths['templates']}/毒app抓取数据_template.xlsx`
        let excelBuffer = await excel.getExcelBuffer(excelTemplatePath,exportDatas)
        excelFileName = urlencode(excelFileName,"UTF-8");
        this.ctx.set({
            'Content-Type': 'application/force-download; charset=utf-8',
            'Content-Disposition': "attachment; filename* = UTF-8''"+excelFileName
        })
        this.ctx.body = excelBuffer;
    }


}


module.exports = DuAppController;
