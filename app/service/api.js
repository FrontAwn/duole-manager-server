const Service = require('egg').Service;
const moment = require('moment');

class ApiService extends Service {

  async finds(query) {

    if (!query.hasOwnProperty('db')) {
      throw new Error('参数db不能为空，请传入对应数据库名称');
      return;
    }

    const db = this.ctx[query.db];

    if (!query.hasOwnProperty('table') || !db[query.table]) {
      throw new Error('参数table不能为空，或者当前数据库没有对应table，请确认table的准确');
      return;
    }
    const model = db[query.table];
    const conditions = {};
    conditions.where = query.hasOwnProperty('where') ? query.where : { id: { $gt: 0 } };
    conditions.attributes = query.hasOwnProperty('attrs') ? query.attrs : [ '*' ];
    conditions.raw = true;
    if (query.order) conditions.order = query.order;
    if (query.group) conditions.group = query.group;
    if (query.page || query.length) {
      const page = query.page || 1;
      const length = query.length || 10000;
      const limit = parseInt(length);
      const offset = (parseInt(page) - 1) * length;
      conditions.offset = offset;
      conditions.limit = limit;
    }

    const res = await model.findAll(conditions);
    return res;

  }

  async count(query) {

    if (!query.hasOwnProperty('db')) {
      throw new Error('参数db不能为空，请传入对应数据库名称');
      return;
    }

    const db = this.ctx[query.db];

    if (!query.hasOwnProperty('table') || !db[query.table]) {
      throw new Error('参数table不能为空，或者当前数据库没有对应table，请确认table的准确');
      return;
    }
    const model = db[query.table];
    // let attr = query['attrs'] ? JSON.parse(query['attrs']) : "*";
    const attr = '*';
    const conditions = {};
    conditions.where = query.hasOwnProperty('where') ? query.where : { id: { $gt: 0 } };
    conditions.attributes = [
      [
        this.ctx.app.Sequelize.fn('COUNT', this.ctx.app.Sequelize.col(attr)),
        'count',
      ],
    ];
    conditions.raw = true;
    const res = await model.findOne(conditions);

    return res.count;

  }


  async update(query) {
    let { db, table, content, where } = query;
    const database = this.ctx[db];
    const model = this.ctx[db][table];
    const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    content = JSON.parse(content);
    where = JSON.parse(where);
    content.update_time = updateTime;
    let count = 0;
    await database.transaction(async t => {
      const res = await model.update(content, {
        where,
        transaction: t,
      });
      count = res.length;
    });
    if (count === 1) {
      return true;
    }
    return false;

  }


  async create(query) {

  }

  async delete(query) {

  }

}

module.exports = ApiService;

