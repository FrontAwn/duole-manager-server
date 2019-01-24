const container = require('./container.js')
const common = require('./common.js');
const folder = require('./folder.js')
const excel = {}

const promisify = require("util").promisify
const fs = require('fs')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const xlsx = require('xlsx');
const ejsexcel = require('ejsexcel')
const arrayExt = require('lodash/array');


excel.getExcelBuffer = async (tmpPath,datas)=>{
	let templatesIsExists = await folder.isExists(tmpPath)
	if ( !templatesIsExists ) {
    	throw new Error(`Excel模版文件不存在:${tmpPath}`);
    } else {
        let templateBuffer = await readFile(tmpPath);
        let excelBuffer = await ejsexcel.renderExcel(templateBuffer, datas)
        return excelBuffer;
    }
}


excel.writeExcel = async (tmpPath,distPath,datas)=>{
	let excelBuffer = await excel.getExcelBuffer(tmpPath,datas)
	await writeFile(distPath,excelBuffer)
}

excel.readExcel = async (excelPath,sheetName,config) =>{

	let wookboot = xlsx.readFile(excelPath);
	let sheetNames = wookboot.SheetNames;
	let sheets = wookboot.Sheets;
	let sheetIndex = sheetNames.findIndex((currentSheetName,i)=>{
		return currentSheetName == sheetName
	})
	if (sheetIndex === -1) throw new Error('没有找到对应表格')
	let sheet = sheets[sheetNames[sheetIndex]]
	sheet = xlsx.utils.sheet_to_json(sheet)

	let res = []


	for( let i in sheet ) {
		let cell = sheet[i]
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

	let datas = JSON.parse(JSON.stringify(res))

	if ( Object.keys(datas[0]).length !== Object.keys(config).length ) {
		throw new Error('数据列表头与配置文件字段不相符')
	}

	return datas

}



module.exports = excel