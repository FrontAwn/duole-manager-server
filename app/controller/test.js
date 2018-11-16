'use strict';
const Controller = require('egg').Controller;
const debug = require('../utils/utils').common.debug
const DateFunc = require('../utils/date.js')
var date = require('../utils/date.js')
var mysql = require('../utils/mysql.js')
var redis = require('../utils/redis.js')

class TestController extends Controller {

  	async index() {
  		const RedisDB = redis.getDatabase('default').getOriginal();
  		// await RedisDB.hmset('cyf',{'name':'cyf','age':24,'job':'developer'})
  		// await RedisDB.del('cyf')
  		// let obj = await RedisDB.hgetall('cyf')
  		// debug(obj,'obj')
  		// const status = await RedisDB.exists('cyf');
  		// debug(status,'status')
  		// let keys = await RedisDB.keys('*')
  		// debug(Object.getOwnPropertyNames(RedisDB),'keys')
  	}
    
}

module.exports = TestController;
