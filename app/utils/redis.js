const debug = require('./utils.js').common.debug;
const Database = require('../core/Database.js')

class Redis extends Database{

	constructor(databaseName) {
		super(databaseName,'redis')
		this.db = this.redis.get(databaseName)
	}

	getOriginal() {
		return this.db
	}

}


module.exports = Redis;

