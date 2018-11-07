'use strict';
const Controller = require('egg').Controller;
const debug = require('../utils/utils').common.debug
const DateFunc = require('../utils/date.js')
var mysql = require('../utils/mysql.js');
var date = require('../utils/date.js')

class TestController extends Controller {

  	async index() {
         // var dates = date.getBeforeWeekByNum(4,'2018-10-24');
         // debug(dates,'dates');
         this.ctx.body = "test response"
  	}
    
}

module.exports = TestController;
