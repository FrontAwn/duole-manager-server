var cache = require('./cache.js');
var index = 0;

function debug(body,sign=null) {
	var ctx = cache.getItem('ctx');
	var query = ctx.query;
	if( sign === null ) {
		sign = index
		index += 1;
	}

	if( cache.getItem('debugContent') === null ) {
		cache.setItem('debugContent',{})
	}

	var contents = cache.getItem('debugContent');
	contents[sign] = body
	cache.setItem('debugContent',contents)

	if( query.hasOwnProperty('debug') ) {
		ctx.body = contents;
	}
}

function success(data,msg='success',code=200) {
	var ctx = cache.getItem('ctx');
	var query = ctx.query;
	if( !query.hasOwnProperty('debug') ) {
		ctx.body = {data,msg,code};
	}
}

function error(data,msg="failed",code=400) {
	var ctx = cache.getItem('ctx');
	var query = ctx.query;
	if( !query.hasOwnProperty('debug') ) {
		ctx.body = {data,msg,code};
	}
}


exports.common = {
	debug,
	success,
	error
}

