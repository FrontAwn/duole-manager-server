const Controller = require('egg').Controller;
const path = require('path');
const common = require('../utils').common;
const container = require('../utils').container;
const moment = require('moment');
const fs = require('fs');
const promisify = require("util").promisify
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const urlencode = require('urlencode');
const excel = require('../utils').excel;

class DuController extends Controller {

    async getSellProductList() {
        let { conditions } = this.ctx.query
        conditions = JSON.parse(conditions)
        let res = await this.service.du.getSellProductList(conditions)
        this.ctx.body = res
    }

    async getSellProductDetail() {
        let { conditions } = this.ctx.query
        conditions = JSON.parse(conditions)
        let res = await this.service.du.getSellProductDetail(conditions)
        this.ctx.body = res   
    }


    async updateSellProductList() {
        let { content, where } = this.ctx.query
        content = JSON.parse(content)
        where = JSON.parse(where)
        let res = await this.service.du.updateSellProductList(content,where)
        this.ctx.body = res
    }

    async updateSellProductDetail() {
        let { content, where } = this.ctx.query
        content = JSON.parse(content)
        where = JSON.parse(where)
        let res = await this.service.du.updateSellProductDetail(content,where)
        this.ctx.body = res
    }

    async createSellProductList() {
        let { content } = this.ctx.query
        content = JSON.parse(content)
        let res = null
        if ( Array.isArray(content) ) {
            res = await this.service.du.bulkCreateSellProductList(content)
        } else {
            res = await this.service.du.createSellProductList(content)
        }
        this.ctx.body = res
    }

    async createSellProductDetail() {
        let { content } = this.ctx.query
        content = JSON.parse(content)
        let res = null
        if ( Array.isArray(content) ) {
            res = await this.service.du.bulkCreateSellProductDetail(content)
        } else {
            res = await this.service.du.createSellProductDetail(content)
        }
        this.ctx.body = res
    }

    async deleteSellProductList() {
        let { where } = this.ctx.query
        where = JSON.parse(where)
        let res = await this.service.du.deleteSellProductList(where)
        this.ctx.body = res
    }

    async deleteSellProductDetail() {
        let { where } = this.ctx.query
        where = JSON.parse(where)
        let res = await this.service.du.deleteSellProductDetail(where)
        this.ctx.body = res
    }

    async generateDataExcel() {
        let { createAt } = this.ctx.query
        let soldAt = moment(createAt).subtract(1,'day').format("YYYY-MM-DD")

        let detailDateNum = parseInt(moment(createAt).format("YYYYMMDD"))
        let soldDateNum = parseInt(moment(soldAt).format("YYYYMMDD"))

        let productDetails = await this.service.du.getSellProductDetail({
            attributes:["sku","title","price","size_list","sold_total"],
            where:{
                date_num:detailDateNum
            },
            raw:true
        })

        let productSolds = await this.service.du.getSellProductDetail({
            attributes:["sku","sold_detail","sold_num"],
            where:{
                date_num:soldDateNum
            },
            raw:true
        })

        productSolds = common.indexBy(productSolds,"sku")

        let writeDatas = []

        for ( let [idx,detail] of productDetails.entries() ) {
            let { sku, title, price } = detail
            
            if ( detail["size_list"] === "" ) continue
            let sizeList = JSON.parse(detail["size_list"])  
            let soldTotal = parseInt(detail["sold_total"])
            let soldDetail = null
            let soldNum = null
            if ( productSolds[sku] ) {
                soldDetail = JSON.parse(productSolds[sku]["sold_detail"])
                soldNum = productSolds[sku]["sold_num"]
            }
            for (let [size,num] of Object.entries(sizeList) ) {
                let content = {
                    sku,
                    title,
                    soldTotal,
                    size,
                    price:num,
                }
                if ( soldDetail !== null && soldDetail[size] ) {
                    content["soldDetail"] = soldDetail[size]
                } else {
                    content["soldDetail"] = "--"
                }

                if ( soldNum !== null ) {
                    content["soldNum"] = parseInt(soldNum)
                } else {
                    content["soldNum"] = "--"
                }

                writeDatas.push(content)
            }
        }

        const paths = container.get('paths');
        const excelTemplatePath = `${paths.templates}/毒app抓取数据_template.xlsx`;
        const downloadPath = paths.downloads
        const excelBuffer = await excel.getExcelBuffer(excelTemplatePath, writeDatas);
        await writeFile(`${downloadPath}/毒app数据${detailDateNum}.xlsx`,excelBuffer)
        this.ctx.body = true

    }


    async downloadDataExcel() {
        let { createAt } = this.ctx.query
        let date = parseInt(moment(createAt).format("YYYYMMDD"))
        let filename = `毒app数据${date}.xlsx`
        const paths = container.get('paths');
        const downloadPath = paths.downloads
        let excelBuffer = await readFile(`${downloadPath}/${filename}`)
        filename = urlencode(filename, 'UTF-8');
        this.ctx.set({
            'Content-Type': 'application/force-download; charset=utf-8',
            'Content-Disposition': "attachment; filename* = UTF-8''" + filename,
        });
        this.ctx.body = excelBuffer;
    }

    async deleteDataExcel() {
        
    }

  // async exportDetails() {
  //   const query = this.ctx.query;
  //   const exportDate = query.date || moment().format('YYYY-MM-DD');
  //   const details = await this.service.duApp.getSelfProductDetail({
  //     raw: true,
  //     where: {
  //       create_at: exportDate,
  //     },
  //   });
  //   const exportDatas = [];

  //   for (const idx in details) {
  //     const detail = details[idx];
  //     const sizeList = JSON.parse(detail.size_list);
  //     for (const [ size, price ] of Object.entries(sizeList)) {
  //       exportDatas.push({
  //         sku: detail.sku,
  //         title: detail.title,
  //         sold_total: detail.sold_total,
  //         size,
  //         price,
  //       });
  //     }
  //   }
  //   const paths = container.get('paths');
  //   let excelFileName = `毒app货号详情${moment(exportDate).format('YYYYMMDD')}.xlsx`;
    // const excelTemplatePath = `${paths.templates}/毒app抓取数据_template.xlsx`;
  //   const excelBuffer = await excel.getExcelBuffer(excelTemplatePath, exportDatas);
  //   excelFileName = urlencode(excelFileName, 'UTF-8');
  //   this.ctx.set({
  //     'Content-Type': 'application/force-download; charset=utf-8',
  //     'Content-Disposition': "attachment; filename* = UTF-8''" + excelFileName,
  //   });
  //   this.ctx.body = excelBuffer;
  // }
  

}


module.exports = DuController;
