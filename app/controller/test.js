'use strict';
const Controller = require('egg').Controller;
const debug = require('../utils/utils').common.debug
const DateFunc = require('../utils/date.js')
var date = require('../utils/date.js')
var mysql = require('../utils/mysql.js')
var redis = require('../utils/redis.js')

class TestController extends Controller {

  	async index() {
         // var redis = this.ctx.app.redis
         // var cyf = await redis.hgetall('cyf')
   //       let SJ_Database = mysql.getDatabase('sj_resource')
   //       await SJ_Database.scope(async conn=>{
			// let datas = await SJ_Database.finds('daily_report_current_stock',{
			// 	'where':{
			// 		'id':{
			// 			'equals':300,
			// 		}
			// 	}
			// },conn) 
			// debug(datas,'datas');
   //       })
  	}
    
}

module.exports = TestController;
