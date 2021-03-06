const Service = require('egg').Service;
const path = require('path');
const debug = require('../utils').common.debug;
const promisify = require('util').promisify;
const exec = require('child_process').exec;
const cmd = promisify(exec);

class NikeService extends Service {

  constructor(ctx) {
    super(ctx);
    this.redis = this.ctx.app.redis.get('default');
  }

  async getCookie() {
    let cookieStr = '';
    try {
      let cookieArrStr = await this.redis.get('https://www.nike.net');
      if (cookieArrStr) {
			  cookieArrStr = JSON.parse(cookieArrStr);
      }

      const cookieArr = cookieArrStr;
      const cookieKVArr = [];
      cookieArr.forEach(cookie => {
			  cookieKVArr.push(`${cookie.name}=${cookie.value}`);
      });

      cookieStr = cookieKVArr.join('; ');
    } catch (e) {
      throw new Error('无效的cookie');
    }
    // debug(cookieStr,'cookieStr')
    return cookieStr;
  }

  async getHeader() {
    const cookieStr = await this.getCookie();

    const headerStr = `-H 'Connection: keep-alive' -H 'Cache-Control: max-age=0' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6,es;q=0.5,zh-TW;q=0.4,mt;q=0.3' -H 'Cookie: ${cookieStr}'`;
    // debug(headerStr,'headerStr')
    return headerStr;
  }

  async getRealTimeStockBySku(sku) {
    const num = 3;
    let datas = null;
    let tryTimes = 0;
    for (let i = 0; i < num; i++) {
      try {
        const header = await this.getHeader();
        const url = 'https://aoavailability.nike.net/availability/v1/sales/9800/availability?productIds=' + sku;
        const curl = `curl '${url}' ${header} --compressed`;
        const response = await cmd(curl, { maxBuffer: 200 * 1024 * 10240 });
        datas = JSON.parse(response.stdout);
        break;
      } catch (e) {
        tryTimes += 1;
        console.log(e);
        console.log('retry:' + tryTimes);
      }
    }
    return datas;
  }

  async getInfoBySku(sku) {
    try {
      const res = await this.redis.get('nikeweb_skuStockInfo:' + sku);
      return JSON.parse(res);
    } catch (e) {
      return [];
    }
  }

}

module.exports = NikeService;

