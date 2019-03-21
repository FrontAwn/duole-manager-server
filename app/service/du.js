const Service = require('egg').Service;
const moment = require('moment');
const common = require('../utils').common;
const debug = common.debug;
const container = require('../utils').container;
const excel = require('../utils').excel;

class DuService extends Service {

  constructor(ctx) {
    super(ctx);
    this.RedisDB = this.ctx.app.redis.get('default');
    this.DuappResource = this.ctx.DuappResource;
    this.SellProductList = this.ctx.DuappResource.SellProductList;
    this.SellProductDetailTotal = this.ctx.DuappResource.SellProductDetailTotal;
  }

  async getSellProductList(conditions) {
    const res = await this.SellProductList.findAll(conditions);
    return res;
  }

  async getSellProductDetail(conditions) {
    const res = await this.SellProductDetailTotal.findAll(conditions);
    return res;
  }

  async updateSellProductList(content,where) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductList.update(content,{
        where:where,
        transaction:t
      })
    })
    return res
  }

  async updateSellProductDetail(content,where) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductDetailTotal.update(content,{
        where:where,
        transaction:t
      })
    })
    return res
  }

  async createSellProductList(content) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductList.create(content,{
        transaction:t
      })
    })
    return res
  }

  async createSellProductDetail(content) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductDetailTotal.create(content,{
        transaction:t
      })
    })
    return res
  }
  
  async bulkCreateSellProductList(content) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductList.bulkCreate(content,{
        transaction:t
      })
    })
    return res
  }

  async bulkCreateSellProductDetail(content) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductDetailTotal.bulkCreate(content,{
        transaction:t
      })
    })
    return res
  }

  async deleteSellProductList(where) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductList.destroy({
        where,
        transaction:t
      })
    })
    return res 
  }

  async deleteSellProductDetail(where) {
    let res = null
    await this.DuappResource.transaction(async t=>{
      res = await this.SellProductDetailTotal.destroy({
        where,
        transaction:t
      })
    })
    return res 
  }

}

module.exports = DuService;

