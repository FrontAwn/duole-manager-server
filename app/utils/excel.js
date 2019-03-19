const container = require('./container.js');
const common = require('./common.js');
const folder = require('./folder.js');
const excel = {};

const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const xlsx = require('xlsx');
const ejsexcel = require('ejsexcel');
const arrayExt = require('lodash/array');


excel.getExcelBuffer = async (tmpPath, datas) => {
  const templatesIsExists = await folder.isExists(tmpPath);
  if (!templatesIsExists) {
    	throw new Error(`Excel模版文件不存在:${tmpPath}`);
  } else {
    const templateBuffer = await readFile(tmpPath);
    const excelBuffer = await ejsexcel.renderExcel(templateBuffer, datas);
    return excelBuffer;
  }
};


excel.writeExcel = async (tmpPath, distPath, datas) => {
  const excelBuffer = await excel.getExcelBuffer(tmpPath, datas);
  await writeFile(distPath, excelBuffer);
};

excel.readExcel = async (excelPath, sheetName, config) => {

  const wookboot = xlsx.readFile(excelPath);
  const sheetNames = wookboot.SheetNames;
  const sheets = wookboot.Sheets;
  const sheetIndex = sheetNames.findIndex((currentSheetName, i) => {
    return currentSheetName == sheetName;
  });
  if (sheetIndex === -1) throw new Error('没有找到对应表格');
  let sheet = sheets[sheetNames[sheetIndex]];
  sheet = xlsx.utils.sheet_to_json(sheet);

  const res = [];


  for (const i in sheet) {
    const cell = sheet[i];
    const cellKeys = Object.keys(cell);
    const configKeys = Object.keys(config);
    const differenceKeys = arrayExt.difference(configKeys, cellKeys);
    differenceKeys.forEach((v, i) => {
      cell[v] = 'IS_NULL';
    });
    const buildCell = {};
    for (const k in cell) {
      buildCell[config[k]] = cell[k];
    }
    res.push(buildCell);
  }

  const datas = JSON.parse(JSON.stringify(res));

  if (Object.keys(datas[0]).length !== Object.keys(config).length) {
    throw new Error('数据列表头与配置文件字段不相符');
  }

  return datas;

};


module.exports = excel;
