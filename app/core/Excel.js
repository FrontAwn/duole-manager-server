const Container = require('./Container')
const Common = require('./Common');
const File = require('./File')

const fs = require('fs')
const xlsx = require('xlsx');
const ejsexcel = require('ejsexcel')


class Excel extends Container{

	static async getRenderExcelBuffer(templatePath,datas) {
		let templatesIsExists = await File.isExists(templatePath)

        if ( !templatesIsExists ) {
        	throw new Error(`Excel模版文件不存在:${templatePath}`);
        } else {
            let templateBuffer = fs.readFileSync(templatePath);
            return ejsexcel.renderExcel(templateBuffer, datas)
    	}
	}

}

module.exports = Excel