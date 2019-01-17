const Container = require('./Container')


class Common extends Container{

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


	// 字符串数字转换真正的数字 例如:1w=10000,1q=1000
	static stringNumberFormat(stringNumber) {
		if ( typeof stringNumber === 'number' ) return stringNumber;
		if ( stringNumber.includes('w') || stringNumber.includes('W') ) {
			return parseInt(stringNumber) * 10000;
		}
		if ( stringNumber.includes('q') || stringNumber.includes('Q') ) {
			return parseInt(stringNumber) * 1000;
		}
		return parseInt(stringNumber);
	}

	// 把一个大的数组根据chunkSize分割成多个小数组
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

	// 字符串第一个字母变为大写
	static toUpperByFirstChar(targetString) {
		if ( typeof targetString !== 'string' ) {
			throw new Error('Common:toUpperByHeadChar; 参数必须是字符串类型');
		}
		let stringHead = targetString[0]
		let stringRest = targetString.slice(1);
		stringHead = stringHead.toUpperCase()
		return stringHead + stringRest
	}

	static awaitTime(time) {
		return new Promise((resolve,reject)=>{
			setTimeout(()=>{
				resolve(true)
			},time)
		})
	}

}

module.exports = Common;