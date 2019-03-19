const Service = require('egg').Service;
const moment = require('moment');
const common = require('../utils').common;
const debug = common.debug;
const container = require('../utils').container;
const excel = require('../utils').excel;

const EXCEPT_SKU = 3;

class DuAppService extends Service {

  constructor(ctx) {
    super(ctx);
    this.RedisDB = this.ctx.app.redis.get('default');
    this.DuappResource = this.ctx.DuappResource;
    this.SelfProductList = this.ctx.DuappResource.SelfProductList;
    this.SelfProductDetailTotal = this.ctx.DuappResource.SelfProductDetailTotal;
    this.NikeProductList = this.ctx.DuappResource.NikeProductList;
  }

  async getSelfProductList(conditions) {
    const res = await this.SelfProductList.findAll(conditions);
    return res;
  }

  async getSelfProductDetail(conditions) {
    const res = await this.SelfProductDetailTotal.findAll(conditions);
    return res;
  }

  async getNikeProductList(conditions) {
    const res = await this.NikeProductList.findAll(conditions);
    return res;
  }
}

module.exports = DuAppService;

