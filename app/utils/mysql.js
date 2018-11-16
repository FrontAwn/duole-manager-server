const Database = require('../core/Database.js')
const debug = require('./utils').common.debug;

class Mysql extends Database {

	constructor(databaseName) {
		super(databaseName,'mysql')
		this.db = this.mysql.get(databaseName);
		this.conn = null
	}

	getOriginal() {
		return this.db;
	}

	setConnect(conn) {
		if ( this.conn === null ) {
			this.conn = conn
		}
	}

	async getConnect() {
		this.conn = await this.db.beginTransaction();
		return this.conn;
	}


	async scope(statement) {
		return await this.db.beginTransactionScope(statement,this.ctx);
	}


	async insertAll(tableName,datas,conn=null) {
		var columns = null
		var values = null
		if ( conn !== null ) {
			this.conn = conn
		}
		var datas = JSON.parse(JSON.stringify(datas));
		if( datas.hasOwnProperty('columns') && datas.hasOwnProperty('values') ) {
			columns = datas['columns'].join(',')
			values = datas['values']
		} else {
			columns = (Object.keys(datas[0])).join(',')
			values = [];
			for (let i in datas) {
				let val = datas[i]
				values.push(Object.values(val))
			}
		}

		let sql = `insert into ${tableName} (${(this.conn.escape(columns)).replace(/\'/g, "")}) values ${this.conn.escape(values)}`;
		var res = await this.conn.query(sql)
		return res;
	}


	async remove(tableName,conditions,conn=null) {
		if ( conn !== null ) {
			this.conn = conn
		}

		if( !tableName ) {
			throw new Error('remove函数请传入tableName')
		}

		if( !conditions || typeof conditions !== 'object' || Array.isArray(conditions) ) {
			throw new Error('remove函数删除条件异常')
		}

		var where = this.getWhere(conditions)
		let sql = `delete from ${tableName} ${where}`
		var res = await this.conn.query(sql)
		return res;
	}

	async modify(tableName,options,conditions,conn=null) {

		if ( conn !== null ) {
			this.conn = conn
		}

		if( !tableName ) {
			throw new Error('modify函数请传入tableName')
		}

		if( !conditions || typeof conditions !== 'object' || Array.isArray(conditions) ) {
			throw new Error('remove函数删除条件异常')
		}

		options = this.conn.escape(options)

		var where = this.getWhere(conditions)

		// sql

	}


	async finds(tableName,conditions,conn=null) {
		if( conn !== null ) {
			this.conn = conn
		}

		if( !tableName ) {
			throw new Error('finds函数请传入tableName')
		}

		if( conditions.hasOwnProperty('columns') && !Array.isArray(conditions['columns']) ) {
			throw new Error('finds函数columns属性需要array类型传入')
		}

		var sql = [];

		var columns = "*"

		if( conditions.hasOwnProperty('columns') ) {
			// conditions['columns'].join(",").split(',')
			columns = conditions['columns'].join(",");
		}

		if ( Array.isArray(tableName) ) {
			tableName = tableName.join(',')
		}

		sql.push(`SELECT ${columns} FROM ${tableName}`)

		if( conditions.hasOwnProperty('where') ) {
			sql.push(this.getWhere(conditions['where']))
		}

		if( conditions.hasOwnProperty('child') ) {
			if ( Array.isArray(conditions['child']) ) {
				conditions['child'] = conditions['child'].join(' ');
			}
			sql.push(conditions['child'])
		}

		if( conditions.hasOwnProperty('limit') ) {
			var page = 0
			var length = 9999
			if (conditions['limit'].hasOwnProperty('length')) {
				length = conditions['limit']['length']
			}

			if (conditions['limit'].hasOwnProperty('page')) {
				page = (parseInt(conditions['limit']['page'])-1)*length
			}
			sql.push(`limit ${page},${length}`)
		}

		sql = sql.join(' ');
		debug(sql)
		var res = await this.conn.query(sql);
		return res;

	}


	async get(tableName,conditions,conn=null) {
		conditions['limit'] = {
			'page':1,
			'length':1
		}
		var res = await this.finds(tableName,conditions,conn)
		return res[0]
	}




	getWhere(conditions,conn=null) {

		if ( conn !== null ) {
			this.conn = conn
		}

		if (typeof conditions !== 'object') {
			throw new Error('getWhere函数参数请传入键值对object类型')
		}

		if (Object.keys(conditions).length === 0) {
			return ''
		}

		var where = []

		for (var attribute in conditions) {
			let values = conditions[attribute];
			if ( values.hasOwnProperty('equals') ) {
				where.push(`${attribute}=${this.conn.escape(values['equals'])}`);
			}
			if( values.hasOwnProperty('notEquals') ) {
				where.push(`${attribute}!=${this.conn.escape(values['notEquals'])}`);
			}
			if( values.hasOwnProperty('greaterThen') ) {
				where.push(`${attribute}>${this.conn.escape(values['greaterThen'])}`);
			}
			if( values.hasOwnProperty('lessThen') ) {
				where.push(`${attribute}<${this.conn.escape(values['lessThen'])}`);
			}
			if( values.hasOwnProperty('in') ) {
				if ( !Array.isArray(values['in']) ) {
					throw new Error('in属性必须为Array类型')
				}
				values['in'] = values['in'].join(",").split(',')
				where.push(`${attribute} in (${this.conn.escape(values['in'])})`)
			}
			if( values.hasOwnProperty('notIn') ) {
				if ( !Array.isArray(values['notIn']) ) {
					throw new Error('notIn属性必须为Array类型')
				}
				values['notIn'] = values['in'].join(",").split(',')
				where.push(`${attribute} not in (${this.conn.escape(values['notIn'])})`)
			}
			if( values.hasOwnProperty('between') ) {
				if ( !Array.isArray(values['between']) ) {
					throw new Error('between属性必须为Array类型')
				}
				values['between'] = values['between'].slice(0,2);
				let betweenScope = (this.conn.escape(values['between'])).split(',');
				where.push(`${attribute} between ${betweenScope[0]} and ${betweenScope[1]}`)
			}

			if( values.hasOwnProperty('notBetween') ) {
				if ( !Array.isArray(values['notBetween']) ) {
					throw new Error('notBetween属性必须为Array类型')
				}
				values['notBetween'] = values['notBetween'].slice(0,2);
				let betweenScope = (this.conn.escape(values['notBetween'])).split(',');
				where.push(`${attribute} not between ${betweenScope[0]} and ${betweenScope[1]}`)
			}

			if( values.hasOwnProperty('like') ) {
				where.push(`${attribute} like ${this.conn.escape(values['like'])}`)	
			}

			if ( values.hasOwnProperty('isNull') ) {
				if ( values['isNull'] ) {
					where.push(`${attribute} is null`)
				} else {
					where.push(`${attribute} not null`)
				}
			}

		}

		where = 'where ' + where.join(' AND ');

		return where;
	}


}

module.exports = Mysql;









