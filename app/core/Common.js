
const Container = require('./Container')

class Common extends Container {

	static deepCopy(obj) {
		return JSON.parse(JSON.stringify(obj))
	}

	// 判断字符串是否是绝对路径
	static isAbsolutePath(path) {
		if ( path[0] === '/' ) {
			return true
		} else {
			return false
		}
	}

	static paramToArray(param) {
		var res = []
		if (Array.isArray(param)) {
			res = param
		} else {
			res = [param]
		}
		return res;
	}

	static sliceArrayList(datas=[],chunkSize=100) {
		let dataSize = datas.length
		if ( !Array.isArray(datas) ) {
			throw new Error('Common:sliceBigDatas; 数据格式必须是array');
		}
		if ( dataSize === 0 ) return []
		if ( dataSize <= chunkSize ) return [datas]

		let chunkNum = Math.ceil(dataSize/chunkSize)

		let chunks = []

		for(let i=0; i<chunkNum; i++) {
			let start = i * chunkSize
			let expectEnd = (i+1) * chunkSize;
			let end = dataSize < expectEnd ? dataSize : expectEnd
			let dataChunk = datas.slice(start,end);
			chunks.push(dataChunk);
		}

		return chunks;
	}

	static indexBy(datas,index='id') {
		if ( typeof datas !== 'object' && Array.isArray(datas) ) {
			throw new Error('Common:indexBy; datas参数格式必须是array或object');
		}
		let res = {}
		if ( typeof datas === 'object' && !Array.isArray(datas) ) {
			if ( !datas.hasOwnProperty(index) ) {
				throw new Error('Common:indexBy; index参数不包含在datas中');
			}
			res[datas[index]] = datas;
			return this.deepCopy(res)
		}

		datas.forEach((data,idx)=>{
			if ( !data.hasOwnProperty(index) ) {
				throw new Error('Common:indexBy; index参数不包含在datas中');
			}
			res[data[index]] = data
		})
		return this.deepCopy(res);
	}

}

module.exports = Common;