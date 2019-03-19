const Controller = require('egg').Controller;
const path = require('path');
const container = require('../utils').container;
const moment = require('moment');
const fs = require('fs');
const urlencode = require('urlencode');
const excel = require('../utils').excel;

class DuAppController extends Controller {

  async saveSkus() {
    const DuappResource = this.ctx.DuappResource;
    const SelfProductList = this.ctx.DuappResource.SelfProductList;
    const { skus } = this.ctx.request.body;
    const newSkus = JSON.parse(skus);
    const allSkus = [];
    const hasSkus = [];
    const diffSkus = [];
    const createAt = moment().format('YYYY-MM-DD');
    const res = await SelfProductList.findAll({
      raw: true,
      attributes: [ 'sku' ],
      where: {
        id: {
          $gt: 0,
        },
      },
    });
    res.forEach(content => {
      allSkus.push(content.sku);
    });
    newSkus.forEach(sku => {
      if (allSkus.includes(sku)) {
        hasSkus.push(sku);
      } else {
        diffSkus.push({
          sku,
          type: 0,
          create_at: createAt,
        });
      }
    });
    if (diffSkus.length > 0) {
      await DuappResource.transaction(async t => {
        await SelfProductList.bulkCreate(diffSkus, { transaction: t });
      });
    }
    this.ctx.body = {
      code: 200,
      data: {
        new: diffSkus.length,
        exists: hasSkus.length,
      },
    };
  }

  async getNeedDumpProductCount() {
    const conditions = {
      raw: true,
      attributes: [[ this.ctx.app.Sequelize.fn('COUNT', this.ctx.app.Sequelize.col('id')), 'count' ]],
      where: {
        type: 2,
      },
    };
    const res = await this.service.duApp.getSelfProductList(conditions);
    this.ctx.body = res[0].count;
  }

  async getAlreadyDumpProductConut() {
    const { createAt } = this.ctx.query;
    const conditions = {
      raw: true,
      attributes: [[ this.ctx.app.Sequelize.fn('COUNT', this.ctx.app.Sequelize.col('id')), 'count' ]],
      where: {
        create_at: createAt,
      },
    };
    const res = await this.service.duApp.getSelfProductDetail(conditions);
    this.ctx.body = res[0].count;
  }

  async getAllDumpCreateDateList() {
    const conditions = {
      raw: true,
      attributes: [ 'create_at' ],
      where: {
        id: {
          $gt: 0,
        },
      },
      group: 'create_at',
    };
    const res = await this.service.duApp.getSelfProductDetail(conditions);
    this.ctx.body = res;
  }

  async exportDetails() {
    const query = this.ctx.query;
    const exportDate = query.date || moment().format('YYYY-MM-DD');
    const details = await this.service.duApp.getSelfProductDetail({
      raw: true,
      where: {
        create_at: exportDate,
      },
    });
    const exportDatas = [];

    for (const idx in details) {
      const detail = details[idx];
      const sizeList = JSON.parse(detail.size_list);
      for (const [ size, price ] of Object.entries(sizeList)) {
        exportDatas.push({
          sku: detail.sku,
          title: detail.title,
          sold_total: detail.sold_total,
          size,
          price,
        });
      }
    }
    const paths = container.get('paths');
    let excelFileName = `毒app货号详情${moment(exportDate).format('YYYYMMDD')}.xlsx`;
    const excelTemplatePath = `${paths.templates}/毒app抓取数据_template.xlsx`;
    const excelBuffer = await excel.getExcelBuffer(excelTemplatePath, exportDatas);
    excelFileName = urlencode(excelFileName, 'UTF-8');
    this.ctx.set({
      'Content-Type': 'application/force-download; charset=utf-8',
      'Content-Disposition': "attachment; filename* = UTF-8''" + excelFileName,
    });
    this.ctx.body = excelBuffer;
  }


}


module.exports = DuAppController;
