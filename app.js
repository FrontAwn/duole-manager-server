var cache = require('./app/utils/cache.js');
var mysql = require('./app/utils/mysql.js')

module.exports = app => {
	cache.setItem('app',app,true);
	mysql.instance('sj_resource');
	
	app.once('server', server => {

	});

	app.on('error', (err, ctx) => {
		ctx.body = err;
	});

	app.on('request', ctx => {
	  	cache.setItem('ctx',ctx,true);
	});

	app.on('response', async ctx => {

	});

};
 