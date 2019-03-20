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
    await this.DuappResource.transaction(async t=>{
      await this.SellProductList.update(content,{
        where:where,
        transaction:t
      })
    })
  }

  async updateSellProductDetail(content,where) {
    await this.DuappResource.transaction(async t=>{
      await this.SellProductDetailTotal.update(content,{
        where:where,
        transaction:t
      })
    })
  }

  async createSellProductList(content) {
    await this.DuappResource.transaction(async t=>{
      await this.SellProductList.create(content,{
        transaction:t
      })
    })

  }

  async createSellProductDetail(content) {
    await this.DuappResource.transaction(async t=>{
      await this.SellProductDetailTotal.create(content,{
        transaction:t
      })
    })
  }
  
}

module.exports = DuService;

