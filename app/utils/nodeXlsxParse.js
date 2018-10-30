const xlsx = require('node-xlsx');
var arrayExt = require('lodash/array');
var debug = require('./utils.js').debug

class nodeXlsxParse {

    constructor(filePath = '', sheetName = null) {
        this.resource = {};
        this.sheet = null
        try {
          const datas = xlsx.parse(filePath);
          this.readStatus = 'success';
          for (const i in datas) {
            const data = datas[i];
            this.resource['' + data.name] = data;
          }
          this.getSheet(sheetName);
        } catch (e) {
          this.resource = {};
          this.readStatus = 'error';
          return;
        }
    }

    getSheet(sheetName = null) {
        if (sheetName !== null && this.resource[sheetName]) {
            this.sheet = this.resource[sheetName];
            this.sheet['titles'] = this.sheet.data[0]
            this.sheet.data.shift();
            this.sheet['columnCount'] = this.sheet['titles'].length
            this.sheet['rowCount'] = this.sheet.data.length
        }
    }

    loadConfig(config = null) {
        if (this.sheet === null || config === null) {
            throw new Error('请传入excel title config')
        } 
        if( this.sheet['titles'].length !== Object.keys(config).length ) {
            throw new Error('config参数和当天titles数量不匹配')
        }
        this.sheet['columns'] = []
        for(let i in this.sheet['titles']) {
            let title = this.sheet['titles'][i]
            if ( config[title] ) {
                this.sheet['columns'].push(config[title]);
            }
        }
        let res = []
        for(let i in this.sheet.data) {
            let cell = this.sheet.data[i]
            let buildCell = arrayExt.zipObject(this.sheet['columns'],cell);
            // let buildCellKeys = Object.keys(buildCell)
            // let differenceKeys = arrayExt.difference(this.sheet['columns'],buildCellKeys)
              res.push(buildCell);
        }
        this.sheet.data = res
    }

}


module.exports = nodeXlsxParse;
