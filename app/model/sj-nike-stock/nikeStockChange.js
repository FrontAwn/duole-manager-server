module.exports = app=>{

	let { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize

	const tableName = "nike_stock_change"
	
	const NikeStockChange = app.SjNikeStock.define(tableName,{
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

		item_id:{
			type:INTEGER(11).UNSIGNED,
			allowNull:false,
			defaultValue:0,
		},

		price:{
			type:STRING(100),
			allowNull:false,
			defaultValue:'',
		},

		product_id:{
			type:INTEGER(11).UNSIGNED,
			allowNull:false,
			defaultValue:0,
		},

		title:{
			type:STRING(200),
			allowNull:false,
			defaultValue:'',
		},

		size_list:{
			type:STRING(3000),
			allowNull:false,
			defaultValue:'',
		},

		sold_num:{
			type:INTEGER(11).UNSIGNED,
			allowNull:false,
			defaultValue:0,
		},

		sell_date:{
			type:STRING(100),
			allowNull:false,
			defaultValue:'',
		},

		type:{
			type:INTEGER(4).UNSIGNED,
			allowNull:false,
			defaultValue:0,
		},

		update_time:{
			type:STRING(100),
			allowNull:false,
			defaultValue:'',
		},
	},{
		tableName:tableName,
		timestamps: false,
		// indexes:[
		// 	{
	 //      		fields: ['sku', 'create_time'],
		// 	}
		// ]
	})

	return NikeStockChange;

}

