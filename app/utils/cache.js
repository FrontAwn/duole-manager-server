const path = require('path')

var cache = {
	datas:{
		'__HOME__':path.resolve(__dirname,'../../'),
		'__APP__':path.resolve(__dirname,'../'),
		'__CONTROLLER__':path.resolve(__dirname,'../controller'),
		'__SERVICE__':path.resolve(__dirname,'../service'),
		'__UTILS__':path.resolve(__dirname,'../utils'),
		'__UPLOADS__':path.resolve(__dirname,'../../uploads'),
		'__DOWNLOADS__':path.resolve(__dirname,'../../downloads'),
		'__TEMPLATES__':path.resolve(__dirname,'../../templates'),
	},

	setItem:function(idx,item,force=false){
		if ( this.datas[idx] && !force ) {
			return false
		}
		this.datas[idx] = item
		return true	
	},

	getItem:function(idx){
		if ( this.datas[idx] ) {
			return this.datas[idx];
		} else {
			return null
		}
	}

}

module.exports = cache;










