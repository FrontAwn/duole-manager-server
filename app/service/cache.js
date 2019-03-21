const Service = require('egg').Service;
const moment = require('moment');
const common = require('../utils').common;

class CacheService extends Service {

    constructor(ctx) {
        super(ctx);
        this.redis = this.ctx.app.redis.get('default');
    }

    async getKey(key) {
        let res = await this.redis.get(key)
        return res
    }

    async setKey(key,value) {
        await this.redis.set(key,value)
    }

    async delKey(key) {
        await this.redis.del(key)
    }

    async getMap(key,hasKey) {
        let res = await this.redis.hget(key,hasKey)
        return res
    }

    async setMap(key,hasKey,value) {
        await this.redis.hset(key,hasKey,value)
    }

    async delMap(key,hasKey) {
        await this.redis.hdel(key,hasKey)
    }

    async cleanMap(key) {
        await this.delKey(key)
    }

    async pushQueue(key,value) {
        await this.redis.rpush(key,value)
    }

    async popQueue(key) {
        let res = await this.redis.lpop(key)
        return res;
    }

    async lenQueue(key) {
        let len = await this.redis.llen(key)
        return len
    }

    async delQueue(key) {
        await this.delKey(key)
    }
}

module.exports = CacheService;

