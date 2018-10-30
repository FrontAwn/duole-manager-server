const Service = require('egg').Service
var debug = require('../utils/utils').common.debug;
var moment = require('moment')
var mysql = require('../utils/mysql')
var date = require('../utils/date.js')


class DailyReportService extends Service {

	constructor(ctx) {
		super(ctx)
		this.DailyReportDB = mysql.get('daily_report');
	}


	async getCurrentStockBeforeWeekByNum(num,sku=null) {
		var dates = date.getBeforeWeekByNum(num)
		var wheres = {}
		for( let i in dates ) {
			let date = dates[i]
			wheres[i] = {
				'where':{
					'sku':{
						'equals':sku
					},
					'total':{
						'greaterThen':0
					},
					'create_time':{
						'between':[date['sTime'],date['eTime']]
					}	
				}
			}
		}

		var datas = {}
		await this.DailyReportDB.scope(async conn=>{
			for (let i in wheres) {
				let conditions = wheres[i]
				datas[i] = await this.DailyReportDB.finds('daily_report_current_stock',conditions,conn);
			}
		})
		return datas;

	}


	// 日报“现货”表存储
	async handleDailyReportFromCurrentStock(workboot,replaceStatus=true,createTime=null) {
		await this.DailyReportDB.scope(async conn=>{

			var datas = workboot.buildedDatas;
			var length = datas.length;
			var chunkNumber = 1000;
			if ( createTime === null || createTime === "null" ) {
				createTime = moment().format("YYYY-MM-DD HH:mm:ss")	
			} else {
				createTime = moment(createTime).format("YYYY-MM-DD HH:mm:ss")
			}
			var updateTime = moment().format("YYYY-MM-DD HH:mm:ss")
			if ( replaceStatus ) {
				await this.DailyReportDB.remove(
					'daily_report_current_stock',
					{
						'create_time':{
							'like': `${moment().format("YYYY-MM-DD")}%`,
						}
					},conn)	
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

				await this.DailyReportDB.insertAll('daily_report_current_stock',chunks,conn);
			    length = datas.length;
		    }

		})

		console.log('save done');
		return {"status":"success"};
	}



}

module.exports = DailyReportService










