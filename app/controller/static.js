'use strict';
const Controller = require('egg').Controller;
const utils = require('../utils');
const debug = utils.common.debug;
const paths = utils.container.get('paths');
const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);
const staticPath = paths.static;

class StaticController extends Controller {

  	async tmallDailyPage() {
    const page = await readFile(path.resolve(staticPath, 'tmallDailyPage.html'));
    this.ctx.body = page.toString('utf8');
  }

}

module.exports = StaticController;
