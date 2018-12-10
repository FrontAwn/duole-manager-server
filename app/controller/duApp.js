const Controller = require('egg').Controller;
const path = require('path');
const common = require('../utils/utils').common
const container = require('../core/Container.js')
const file = require('../core/File.js')
const moment = require('moment')
const ejsexcel = require('ejsexcel');
const fs = require('fs')
const urlencode = require('urlencode');

class DuAppController extends Controller {

    async saveSkus() {

        let query = this.ctx.query;
        let {skus} = query
        skus = JSON.parse(skus);
        let timer = moment().format('YYYY-MM-DD HH:mm:ss');
        let targetSkus = [];
        skus.forEach((sku,idx)=>{
            let data = {sku,'create_time':timer}
            targetSkus.push(data)
        })
        
        let skusCountDetail = await this.service.duApp.updateSkus(targetSkus)

        common.success({
            'new':skusCountDetail['newSkusCount'],
            'exists':skusCountDetail['existsSkusCount']
        })

    }

    async getAllSkus() {
        let datas = await this.service.duApp.getAllSkus();
        common.success({datas})
    }

    async getAllDetails() {
        let datas = await this.service.duApp.getAllDetails();
        common.success({datas})   
    }

    async getExceptSkus() {
        let {state} = this.ctx.query;
        let datas = await this.service.duApp.getSkuByState(state);
        common.success({datas})
    }

    async saveSkuTargetName() {
        let query = this.ctx.query;
        let {sku,targetName} = query
        let count = await this.service.duApp.updateSkuTargetName(sku,targetName)
        if ( count === 1 ) {
            common.success({'status':'更新成功'})
        } else {
            common.error({'status':'更新失败'})
        }
    }

    async saveSkuState() {
        let query = this.ctx.query;
        let {sku,state} = query
        let count = await this.service.duApp.updateSkuState(sku,state)
        if ( count === 1 ) {
            common.success({'status':'更新成功'})
        } else {
            common.error({'status':'更新失败'})
        }
    }

    async saveSkuOffset() {
        let query = this.ctx.query;
        let {sku,offset} = query
        let count = await this.service.duApp.updateSkuOffset(sku,offset)
        if ( count === 1 ) {
            common.success({'status':'更新成功'})
        } else {
            common.error({'status':'更新失败'})
        }
    }

    async saveExceptContent() {
        let query = this.ctx.query;
        let {sku,exceptContent} = query
        let count = await this.service.duApp.updateSkuExceptContent(sku,exceptContent)
        if ( count === 1 ) {
            common.success({'status':'更新成功'})
        } else {
            common.error({'status':'更新失败'})
        }
    }


    async exportDetails() {
        console.log(this.ctx.request)
        let datas = await this.service.duApp.getAllDetails();
        let result = []
        for ( let idx in datas ) {
            let data = datas[idx]
            let sizeList = JSON.parse(data['size_list'])
            for ( let size in sizeList ) {
                let details = sizeList[size]
                let price = "--"
                if ( details['price'] ) {
                    price = details['price']
                }
                result.push({
                    'sku':data['sku'],
                    'title':data['title'],
                    'size':size,
                    'price':price,
                })
            }
        }

        let timer = moment().format('YYYYMMDD');
        let resultName = `毒app${timer}.xlsx`
        let downloadPath = container.get('paths')['downloads']
        let resultFile = downloadPath+'/duapp/'+resultName

        let templatePath = container.get('paths')['templates']
        let tamplateName = '毒app抓取数据_template.xlsx'
        let templateFile = templatePath+'/'+tamplateName
        let templatesIsExists = await file.isExists(templateFile)
        if ( !templatesIsExists ) {
            common.error({'status':'excel模版文件不存在'})
        } else {
            const template = fs.readFileSync(templateFile);
            let resultBuffer = await ejsexcel.renderExcel(template,result)
            fs.writeFileSync(resultFile,resultBuffer)

            let downloadFileName = urlencode(resultName,"UTF-8");
            this.ctx.set({
                'Content-Type': 'application/force-download; charset=utf-8',
                'Content-Disposition': "attachment; filename* = UTF-8''"+downloadFileName,
            })
            this.ctx.body = resultBuffer;
        }
    }

}


module.exports = DuAppController;
