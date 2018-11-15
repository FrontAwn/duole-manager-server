var debug = require('./app/utils/utils').common.debug
var mysql = require('./app/utils/mysql.js')
var redis = require('./app/utils/redis.js')
var path = require('path')
var Container = require('./app/core/Container.js')

module.exports = app => {
	var home = __dirname;
	Container.add('app',app)

	var paths = Container.add('paths',{})
	Container.add('home',home,paths)
	Container.add('uploads',path.join(home,'/uploads'),paths)
	Container.add('downloads',path.join(home,'/downloads'),paths)
	Container.add('templates',path.join(home,'/templates'),paths)
	Container.add('app',path.join(home,'/app'),paths)
	Container.add('controller',path.join(home,'/app/controller'),paths)
	Container.add('service',path.join(home,'/app/service'),paths)
	Container.add('utils',path.join(home,'/app/utils'),paths)
	Container.add('middleware',path.join(home,'/app/middleware'),paths)
	Container.add('public',path.join(home,'/app/public'),paths)
	Container.add('core',path.join(home,'/app/core'),paths)
	Container.add('extend',path.join(home,'/app/extend'),paths)
	Container.add('schedule',path.join(home,'/app/schedule'),paths)

	mysql.instance('sj_resource');
	redis.instance('default');

	// app.once('server', server => {

	// });

	app.on('error', (err, ctx) => {
		ctx.body = err;
	});

	app.on('request', ctx => {
	  	Container.add('ctx',ctx)
	});

	app.on('response', async ctx => {
		debug(Object.keys(Container.list()),'ContainerList')
		debug(Object.keys(Container.get('mysql')),'MysqlList')
		debug(Object.keys(Container.get('redis')),'RedisList')
		debug(Container.get('paths'),'PathList')
	});

};
 