module.exports = app=>{

	let { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize
	
	const DuSkuList = app.SjResource.define('du_sku_list',{
		id:{
			type:INTEGER(11).UNSIGNED,
			primaryKey:true,
			autoIncrement:true,
		},
		sku:{
			type:STRING(100),
			allowNull:false,
			defaultValue:'',
		},

		type:{
			type:INTEGER(4).UNSIGNED,
			allowNull:false,
			defaultValue:0,
		},

		state:{
			type:INTEGER(4).UNSIGNED,
			allowNull:false,
			defaultValue:0,
		},

		total:{
			type:INTEGER(4).UNSIGNED,
			allowNull:false,
			defaultValue:0,
		},

		total_name:{
			type:STRING(2000),
			allowNull:false,
			defaultValue:'',
		},

		target_name:{
			type:STRING(200),
			allowNull:false,
			defaultValue:'',
		},

		image:{
			type:STRING(200),
			allowNull:false,
			defaultValue:'',
		},

		offset:{
			type:INTEGER(4).UNSIGNED,
			allowNull:false,
			defaultValue:1,
		},

		except_content:{
			type:STRING(300),
			allowNull:false,
			defaultValue:'',
		},

		create_time:{
			type:STRING(100),
			allowNull:false,
			defaultValue:'',
		},

		update_time:{
			type:STRING(100),
			allowNull:false,
			defaultValue:'',
		},

	},{
		tableName:'du_sku_list',
		timestamps: false,
		// indexes:[
		// 	{
	 //      		fields: ['sku', 'create_time'],
		// 	}
		// ]
	})

	return DuSkuList;

}

