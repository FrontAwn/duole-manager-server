const Controller = require('egg').Controller;
const utils = require("../utils")
const moment = require("moment")
const debug = utils.common.debug
const date = utils.date

class DailyController extends Controller {

  // 处理日报excal“现货”表数据保存到数据库
  async handleExistingTable() {
        let query = this.ctx.query
        let status = await this.service.daily.handleExistingTable(query);
        this.ctx.body = {
          status:true,
          msg:"数据保存成功!"
        }
  }

  // 得到近4周每周的现货日报数据
  async getExistingLsByWeek() {
    let datas = {}
    let {sku} = this.ctx.query
    datas = await this.service.daily.getExistingLsByWeek(4,sku);
    this.ctx.body = {
      data:datas
    }
  }

  // 得到近1周每天的 "速捷，汉俊，格林岛" 的信息
  async getExistingExtraBySkus() {
    let {skus} = this.ctx.query
    skus = JSON.parse(skus)
    let redis = this.ctx.app.redis.get('default')
    let lastDate = await redis.get("DaliyReportCurrentStockBySkuCreateTime")
    let dateInfo = date.getBeforeWeekByNum(1,lastDate)["1-week"]
    let startDate = moment(dateInfo['start']).format("YYYY-MM-DD HH:mm:ss")
    let endDate = moment(dateInfo['end']).format("YYYY-MM-DD HH:mm:ss")
    let datas = await this.service.api.finds({
        db:"DailyResource",
        table:"DailyAmount",
        attrs:[
            'sku',
            'brand_price',
            'maori_rate',
            'sj_info',
            'hj_info',
            'gld_info',
            'cost_info',
            'distribution_info',
            'create_time',
        ],
        where:{
            "sku":{
                "$in":skus,
            },
            "create_time":{
                "$between":[startDate,endDate]
            }
        },
        order:[["create_time","DESC"]]
    })
    this.ctx.body = {
        data:datas,
        last:dateInfo['end']
    }
  }

}


module.exports = DailyController;
