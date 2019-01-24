const Service = require('egg').Service
var moment = require('moment')
const date = require('../utils').date
const excel = require("../utils").excel
const debug = require("../utils").common.debug
const folder = require('../utils').folder
const dailyConfig = require("../config/daily.config.js")

class DailyService extends Service {

	constructor(ctx) {
		super(ctx)
		this.DailyResourceDB = this.ctx.DailyResource
		this.DailyAmountModel = this.ctx.DailyResource.DailyAmount
		this.RedisDB = this.ctx.app.redis.get('default')
	}

	// 根据周来筛选日报现货数据信息
	async getExistingLsByWeek(num,sku=null) {

		var lastDate = await this.RedisDB.get('DaliyReportCurrentStockBySkuCreateTime');

		var redisKey = `DaliyReportCurrentStockBySku:${sku}`

		// 判断缓存
		var cacheIsExists = await this.RedisDB.exists(redisKey)
		if( cacheIsExists ) {
			var cacheLastDate = await this.RedisDB.hget(redisKey,'lastDate')
			if( Object.is(cacheLastDate,lastDate) ) {
				debug('cache','status')
				debug(redisKey,'cacheKey')
				debug(lastDate,'mysql截止时间')
				debug(cacheLastDate,'redis截止时间')
				let res = await this.RedisDB.hget(redisKey,'datas')
				return JSON.parse(res)
			}
		}

		// 缓存匹配失败，进行mysql查询
		var dates = date.getBeforeWeekByNum(num,lastDate)
		var wheres = {}
		for( let i in dates ) {
			let date = dates[i]
			wheres[i] = {
				'sku':sku,
				'create_time':{
					'$between':[date['sTime'],date['eTime']]
				},
				'total':{
					'$gt':0
				},
			}
		}

		var datas = {}
		datas['lastDate'] = moment(lastDate).format('YYYY-MM-DD');

		for (let i in wheres) { 
			let where = wheres[i]
			datas[i] = await this.DailyAmountModel.findAll({
				raw:true,
				attributes:['total','maori','brand_price','retail','retail_price','cost_info'],
				where,
			})
		}
		debug(redisKey,'needCacheKey')
		debug('disk','status')

		// 缓存储存
		let dataCacheStrings = JSON.stringify(datas);
		await this.RedisDB.hmset(redisKey,{
			'lastDate':lastDate,
			'datas': dataCacheStrings
		});

		return datas;

	}


	// 日报“现货”表存储
	async handleExistingTable(query) {
		if ( !query['filePath'] ) {
			throw new Error("[Service handleExistingTable]:没有找到要读取的文件路径")
		}
		let filePath = query['filePath']
		let createTime = query['createTime'] || null 
		let replace = query['replace'] || true
		let excelExists = await folder.isExists(filePath)
		if (!excelExists) {
			throw new Error(`[Service handleExistingTable]:${filePath} 不存在`)
		}
		let datas = await excel.readExcel(filePath,"现货",dailyConfig)
		var length = datas.length;
		var chunkNumber = 1000;
		if ( createTime === null || createTime === "null" ) {
			createTime = moment().format("YYYY-MM-DD HH:mm:ss")	
		} else {
			createTime = moment(createTime).format("YYYY-MM-DD HH:mm:ss")
		}
		var updateTime = moment().format("YYYY-MM-DD HH:mm:ss")

		// 开始分析excel数据
		await this.DailyResourceDB.transaction(async t=>{

			// 覆盖已有的日报数据
			if ( replace ) {
				await this.DailyAmountModel.destroy({
					where:{
						'create_time':{
							"$like": `${moment(createTime).format("YYYY-MM-DD")}%`
						}
					},
					transaction:t
				})
			}

			while ( length > 0 ) {
		    	var chunks = datas.splice(0,chunkNumber);

		    	for( let i in chunks) {
		    		chunks[i]['cost_info'] = {}
		    		chunks[i]['distribution_info'] = {}
		    		chunks[i]['sj_info'] = {}
		    		chunks[i]['hj_info'] = {}
		    		chunks[i]['gld_info'] = {}
		    		chunks[i]['type'] = 1
		    		chunks[i]['create_time'] = createTime
		    		chunks[i]['update_time'] = updateTime

					if ( chunks[i]['total'] === 'IS_NULL' ) {
		    			chunks[i]['total'] = 0
					}

					if( chunks[i]['brand_price'] === 'IS_NULL' ) {
		    			chunks[i]['brand_price'] = 0;
		    		}

		    		if( chunks[i]['retail'] === 'IS_NULL' ) {
		    			chunks[i]['retail'] = 0;
		    		}

		    		if( chunks[i]['amount_count'] === 'IS_NULL' ) {
		    			chunks[i]['amount_count'] = 0;
		    		}

		    		if( chunks[i]['maori'] === 'IS_NULL' ) {
		    			chunks[i]['maori'] = 0
		    		}

		    		if( chunks[i]['maori_rate'] === 'IS_NULL' ) {
		    			chunks[i]['maori_rate'] = 0.00
		    		} else {
		    			chunks[i]['maori_rate'] = chunks[i]['maori_rate'].toFixed(2)
		    		}

		    		if( chunks[i]['distribution_maori_rate'] === 'IS_NULL' ) {
		    			chunks[i]['distribution_maori_rate'] = 0.00
		    		} else {
		    			chunks[i]['distribution_maori_rate'] = chunks[i]['distribution_maori_rate'].toFixed(2)
		    		}

		    		
		    		let sortedKeys = Object.keys(chunks[i]).sort()
		    		let sortedDatas = {}
		    		sortedKeys.forEach((k,idx)=>{
	    				if(k.indexOf('cost') !== -1 && k.indexOf('cost_info') === -1) {
		    				chunks[i]['cost_info'][k] = chunks[i][k]
		    				delete chunks[i][k]
		    			}
		    			if(k.indexOf('distribution') !== -1 && k.indexOf('distribution_info') === -1) {
		    				chunks[i]['distribution_info'][k] = chunks[i][k]
		    				delete chunks[i][k]
		    			}
		    			if(k.indexOf('sj') !== -1 && k.indexOf('sj_info') === -1) {
		    				chunks[i]['sj_info'][k] = chunks[i][k]
		    				delete chunks[i][k]
		    			}
		    			if(k.indexOf('hj') !== -1 && k.indexOf('hj_info') === -1) {
		    				chunks[i]['hj_info'][k] = chunks[i][k]
		    				delete chunks[i][k]
		    			}
		    			if(k.indexOf('gld') !== -1 && k.indexOf('gld_info') === -1) {
		    				chunks[i]['gld_info'][k] = chunks[i][k]
		    				delete chunks[i][k]
		    			}
		    			sortedDatas[k] = chunks[i][k]
		    		})
		    		chunks[i] = sortedDatas
		    		chunks[i]['cost_info'] = JSON.stringify(chunks[i]['cost_info'])
		    		chunks[i]['distribution_info'] = JSON.stringify(chunks[i]['distribution_info'])
		    		chunks[i]['sj_info'] = JSON.stringify(chunks[i]['sj_info'])
		    		chunks[i]['hj_info'] = JSON.stringify(chunks[i]['hj_info'])
		    		chunks[i]['gld_info'] = JSON.stringify(chunks[i]['gld_info'])
		    	}
				await this.DailyAmountModel.bulkCreate(chunks,{
					transaction:t
				})
			    length = datas.length;
		    }
		})

		// 缓存日报最新日期
		var redisKey = `DaliyReportCurrentStockBySkuCreateTime`
		var lastTime = await this.DailyAmountModel.findOne({
			attributes:['create_time'],
			where:{
				'id':{
					'$gt':0
				}
			},
			order:[['create_time',"DESC"]],
		})
		await this.RedisDB.set(redisKey,lastTime['create_time']);
		return true;
	}



}

module.exports = DailyService










