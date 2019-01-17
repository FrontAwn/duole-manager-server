const Service = require('egg').Service
var debug = require('../utils/utils').common.debug;
var moment = require('moment')
var date = require('../utils/date.js')

class DailyReportService extends Service {

	constructor(ctx) {
		super(ctx)
		this.DailyReportModel = this.ctx.SjResource.DailyReportCurrentStock
		this.SjResourceDB = this.ctx.SjResource
		this.RedisDB = this.ctx.app.redis.get('default')
	}

	// 根据周来筛选日报现货数据信息
	async getCurrentStockBeforeWeekByNum(num,sku=null) {

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
			datas[i] = await this.DailyReportModel.findAll({
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
	async handleDailyReportFromCurrentStock(workboot,replaceStatus=true,createTime=null) {


		// 开始分析excel数据

		await this.SjResourceDB.transaction(async t=>{

			var datas = workboot.buildedDatas;
			var length = datas.length;
			var chunkNumber = 1000;
			if ( createTime === null || createTime === "null" ) {
				createTime = moment().format("YYYY-MM-DD HH:mm:ss")	
			} else {
				createTime = moment(createTime).format("YYYY-MM-DD HH:mm:ss")
			}
			var updateTime = moment().format("YYYY-MM-DD HH:mm:ss")

			// 删除当天重复的日报数据
			if ( replaceStatus ) {
				await this.DailyReportModel.destroy({
					where:{
						'create_time':{
							"$like": `${moment().format("YYYY-MM-DD")}%`
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
		    			sortedDatas[k] = chunks[i][k]
		    		})
		    		chunks[i] = sortedDatas
		    		chunks[i]['cost_info'] = JSON.stringify(chunks[i]['cost_info'])
		    		chunks[i]['distribution_info'] = JSON.stringify(chunks[i]['distribution_info'])
		    	}
				await this.DailyReportModel.bulkCreate(chunks,{
					transaction:t
				})
			    length = datas.length;
		    }
		})

		// 缓存日报最新日期
		var redisKey = `DaliyReportCurrentStockBySkuCreateTime`
		var lastTime = await this.DailyReportModel.findOne({
			attributes:['create_time'],
			where:{
				'id':{
					'$gt':0
				}
			},
			order:[['create_time',"DESC"]],
		})
		await this.RedisDB.set(redisKey,lastTime['create_time']);
		return {"status":"success"};
		
	}



}

module.exports = DailyReportService










