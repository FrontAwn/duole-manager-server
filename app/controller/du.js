const Controller = require('egg').Controller;
const path = require('path');
const container = require('../utils').container;
const moment = require('moment');
const fs = require('fs');
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
  //   const excelTemplatePath = `${paths.templates}/毒app抓取数据_template.xlsx`;
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
