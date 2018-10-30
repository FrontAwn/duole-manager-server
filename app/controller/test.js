'use strict';
const Controller = require('egg').Controller;
const debug = require('../utils/utils').common.debug
const DateFunc = require('../utils/date.js')
var mysql = require('../utils/mysql.js');
var date = require('../utils/date.js')

class TestController extends Controller {

  	async index() {
         // date.getBeforeFourWeek();
         // debug('aa','aa')   
  	}
    
}

module.exports = TestController;
