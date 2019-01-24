const container = require("./container")
const common = {}

var index = 0;

common.debug = (body,sign=null)=>{
	var ctx = container.get('ctx')
	var query = ctx.query;
	if( sign === null ) {
		sign = index
		index += 1;
	}

	if( container.get('debugContent') === null ) {
		container.add('debugContent',{})
	}

	var contents = container.get('debugContent');
	contents[sign] = body
	container.add('debugContent',contents)

	if( query.hasOwnProperty('debug') ) {
		ctx.body = contents;
	}

}

common.deepCopy = (obj)=>{
	return JSON.parse(JSON.stringify(obj))
}

// 判断字符串是否是绝对路径
common.isAbsolutePath = path => {
	if ( path[0] === '/' ) {
		return true
	} else {
		return false
	}
}

// 参数强制转换成数组接受
common.paramToArray = param => {
	var res = []
	if (Array.isArray(param)) {
		res = param
	} else {
		res = [param]
	}
	return res;
}


// 字符串数字转换真正的数字 例如:1w=10000,1q=1000
common.stringNumberFormat = (stringNumber) => {
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
common.getChunks = (datas=[],chunkSize=100)=>{
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

common.indexBy = (datas,index='id')=>{
	if ( typeof datas !== 'object' && Array.isArray(datas) ) {
		throw new Error('Common:indexBy; datas参数格式必须是array或object');
	}
	let res = {}
	if ( typeof datas === 'object' && !Array.isArray(datas) ) {
		if ( !datas.hasOwnProperty(index) ) {
			throw new Error('Common:indexBy; index参数不包含在datas中');
		}
		res[datas[index]] = datas;
		return common.deepCopy(res)
	}

	datas.forEach((data,idx)=>{
		if ( !data.hasOwnProperty(index) ) {
			throw new Error('Common:indexBy; index参数不包含在datas中');
		}
		res[data[index]] = data
	})
	return common.deepCopy(res);
}

// 字符串第一个字母变为大写
common.upperToFirst = (targetString)=>{
	if ( typeof targetString !== 'string' ) {
		throw new Error('Common:toUpperByHeadChar; 参数必须是字符串类型');
	}
	let stringHead = targetString[0]
	let stringRest = targetString.slice(1);
	stringHead = stringHead.toUpperCase()
	return stringHead + stringRest
}

// 等待函数
common.awaitTime = (time) => {
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve(true)
		},time)
	})
}

module.exports = common

