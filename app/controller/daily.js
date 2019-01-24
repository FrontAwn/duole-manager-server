const Controller = require('egg').Controller;

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


}


module.exports = DailyController;
