const Service = require('egg').Service
var mysql = require('../utils/mysql')

class TestService extends Service {

	constructor(ctx) { 
		super(ctx)
		this.TestDB = mysql.get('test')
	}

	async processOne() {
		await this.TestDB.scope(async conn=>{
			conn.insert('user',{
				name:'one',
				age:0
			})
		})
	}


	async processTwo() {
		await this.TestDB.scope(async conn=>{
			conn.insert('user',{
				name:'two',
				age:1
			})
		})
	}


}


module.exports = TestService