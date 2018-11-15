const Container = require('../core/Container');
var index = 0;

function debug(body,sign=null) {
	var ctx = Container.get('ctx')
	var query = ctx.query;
	if( sign === null ) {
		sign = index
		index += 1;
	}

	if( Container.get('debugContent') === null ) {
		Container.add('debugContent',{})
	}

	var contents = Container.get('debugContent');
	contents[sign] = body
	Container.add('debugContent',contents)

	if( query.hasOwnProperty('debug') ) {
		ctx.body = contents;
	}
}

function success(data,msg='success',code=200) {
	var ctx = Container.get('ctx');
	var query = ctx.query;
	if( !query.hasOwnProperty('debug') ) {
		ctx.body = {data,msg,code};
	}
}

function error(data,msg="failed",code=400) {
	var ctx = Container.get('ctx');
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

