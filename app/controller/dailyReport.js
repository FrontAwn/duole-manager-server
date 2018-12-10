const Controller = require('egg').Controller;
const path = require('path');
var common = require('../utils/utils').common
var xlsxParse = require('../utils/xlsxParse.js');
var existingStockConfig = require('../config/excel/existing.stock.js')

class DailyReportController extends Controller {

  // 处理日报“现货”表数据
  async handleDailyReportFromCurrentStock() {
  	const { filePath, selectDate, replaceStatus } = this.ctx.query
    const workboot = new xlsxParse(filePath,'现货');
    workboot.loadConfig(existingStockConfig);
    var insertRes = await this.service.dailyReport.handleDailyReportFromCurrentStock(workboot,replaceStatus,selectDate);
    if( insertRes.status === 'success' ) {
    	common.success({status:'ok'});
    } else {
    	common.error({status:'err'});
    }
  }

  // 得到近4周每周的现货日报数据
  async getBeforeFrouWeekCurrentStockBySku() {
    let datas = {}
    let {sku} = this.ctx.query
    datas = await this.service.dailyReport.getCurrentStockBeforeWeekByNum(4,sku);
    common.debug(datas,'datas')
    common.success(datas);
  }


}


module.exports = DailyReportController;
