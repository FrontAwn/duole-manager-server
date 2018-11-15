const debug = require('../utils/utils.js').common.debug;
const Container = require('./Container.js')

class Database extends Container{

	constructor(databaseName,origin='mysql') {
		super()
		this.app = Container.get('app')
		this.ctx = Container.get('ctx')
		this[origin] = this.app[origin];
	}

	static addType(type) {
		this.add(type,{})
	}

	static hasType(type) {
		return this.get(type) === null ? false : true
	}

	static instance(databaseName) {
		let databaseType = this.name.toLowerCase()
		if ( !this.hasType(databaseType) ) {
			this.addType(databaseType)
		}
		let databaseContainer = this.get(databaseType)
		if ( !this.has(databaseName,databaseContainer) ) {
			this.add(databaseName,new this(databaseName),databaseContainer)
		}
	}

	static getDatabase(databaseName) {
		let databaseType = this.name.toLowerCase()
		let databaseContainer = this.get(databaseType)
		if ( databaseContainer === null || this.get(databaseName,databaseContainer) === null  ) {
			this.instance(databaseName)
		}
		return this.get(databaseName,databaseContainer)
	}

}

module.exports = Database