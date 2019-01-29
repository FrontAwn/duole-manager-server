var path = require('path')
var container = require("./app/utils").container

module.exports = app => {
	var home = __dirname;
	
	container.add('app',app)
	container.add('sequelizeClass',app.Sequelize);

	// 设置默认路径
	var paths = container.add('paths',{})
	container.add('home',home,paths)
	container.add('uploads',path.join(home,'/uploads'),paths)
	container.add('downloads',path.join(home,'/downloads'),paths)
	container.add('templates',path.join(home,'/templates'),paths)
	container.add('app',path.join(home,'/app'),paths)
	container.add('controller',path.join(home,'/app/controller'),paths)
	container.add('service',path.join(home,'/app/service'),paths)
	container.add('utils',path.join(home,'/app/utils'),paths)
	container.add('middleware',path.join(home,'/app/middleware'),paths)
	container.add('public',path.join(home,'/app/public'),paths)
	container.add('static',path.join(home,'/app/static'),paths)
	container.add('core',path.join(home,'/app/core'),paths)
	container.add('extend',path.join(home,'/app/extend'),paths)
	container.add('schedule',path.join(home,'/app/schedule'),paths)

	app.on('error', (err, ctx) => {
		ctx.body = err;
	});

	app.on('request', ctx => {
	  	container.add('ctx',ctx)
	});

	app.on('response', async ctx => {
		
	});

};
 