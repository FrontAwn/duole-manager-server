var xlsx = require('xlsx');
var debug = require('./utils').common.debug
var arrayExt = require('lodash/array');

class XlsxParser {

	constructor(filePath=null,sheetName=null) {
		this.wookboot = null
		this.sheet = null
		try {
			this.wookboot = xlsx.readFile(filePath);
			this.readStatus = 'success'
			this.sheetNames = this.wookboot.SheetNames;
			this.sheets = this.wookboot.Sheets;
			this.changeSheet(sheetName);
		} catch(e) {
			this.readStatus = 'error'
		}

	}

	changeSheet(sheetName=null) {
		if( sheetName === null ) return 
		var sheetIndex = this.sheetNames.findIndex((v,i)=>{
			return v == sheetName
		})
		if( sheetIndex !== -1 ) {
			this.sheet = this.sheets[this.sheetNames[sheetIndex]]
			this.sheet = xlsx.utils.sheet_to_json(this.sheet);
		} else {
			throw new Error('没有找到对应表格')
		}
	}

	loadConfig(config=null) {

		if( this.sheet === null || config === null ) {
			throw new Error('当前没有选中表格或配置文件为空')
		}

		var res = []
		for( let i in this.sheet ) {
			let cell = this.sheet[i]
			let cellKeys = Object.keys(cell)
			let configKeys = Object.keys(config)
			let differenceKeys = arrayExt.difference(configKeys,cellKeys);
			differenceKeys.forEach((v,i)=>{
				cell[v] = 'IS_NULL'
			})
			let buildCell = {}
			for(let k in cell) {
				buildCell[config[k]] = cell[k]
			}
			res.push(buildCell)
		}

		this.buildedDatas = JSON.parse(JSON.stringify(res))

		if ( Object.keys(this.buildedDatas[0]).length !== Object.keys(config).length ) {
			throw new Error('数据列表头与配置文件字段不相符')
		}

		return res
	}


}

module.exports = XlsxParser;

