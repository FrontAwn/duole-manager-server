'use strict';
const Controller = require('egg').Controller;
const debug = require('../utils/utils').common.debug
const DateFunc = require('../utils/date.js')
var date = require('../utils/date.js')

class TestController extends Controller {

  	async index() {
        // const RedisDB = redis.getDatabase('default').getOriginal();
        // await RedisDB.hmset('cyf',{'name':'cyf','age':24,'job':'developer'})
        // await RedisDB.del('cyf')
        // let obj = await RedisDB.hgetall('cyf')
        // debug(obj,'obj')
        // const status = await RedisDB.exists('cyf');
        // debug(status,'status')
        // let keys = await RedisDB.keys('*')
        // debug(Object.getOwnPropertyNames(RedisDB),'keys')

        // var res = await this.ctx.app.Test.ExistingStock.findAll()
        // var res = await this.ctx.app.SjResourceModel.DailyReportCurrentStock.findById(30);
        // var res = await this.ctx.app.SjResourceModel.DailyReportCurrentStock.findAndCountAll({
        //   offset:0,
        //   limit:10
        // });
        // let sequelize = this.ctx.app.Sequelize
        // var datas = []
        // var sqlQuery = ''
        // this.ctx.dbRouter();
        // await this.ctx.app.SjResource.transaction(async conn=>{
        //       var res = await this.ctx.app.SjResource.DailyReportCurrentStock.findAll({
        //               where:{
        //                   sku:'908978-001',
        //                   create_time:{
        //                       $between:['2018-10-01 00:00:00','2018-11-01 23:59:59']
        //                   },
        //                   total:{
        //                       $gt:0
        //                   }
        //               },
        //               raw: true,
        //               transaction:conn,
        //               logging:function(sql){sqlQuery=sql}
        //             });
        //       datas = res
        // })
        // debug(sqlQuery,'sqlQuery')
        // debug(datas,'datas')
        // console.log(this.ctx.app.Sequelize);
        var ExistingStock = await this.ctx.SequelizeExtra.instance(this.ctx.app.ExistingStock);

        // await ExistingStock.segmentation();
    } 
    
}

module.exports = TestController;
