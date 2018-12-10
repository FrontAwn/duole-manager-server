const fs = require('fs')
const Container = require('./Container')

class File extends Container {

	static isExists(filePath) {
		return new Promise((resolve,reject)=>{
			fs.access(filePath, fs.constants.F_OK, (err) => {
				if (!err) {
					resolve(true)
				} else {
					resolve(false)
				}
			});
		})
	}

	static addSuffix(path) {
		if ( path.lastIndexOf('.js') !== 0 ) {
			return path + '.js'
		}
		return path
	}

	static addPrefix(path,prefix='/') {
		if ( prefix === '/' && path[0] !== '/' ) {
			return '/' + path;
		}

		return prefix + path
	}

}

module.exports = File;