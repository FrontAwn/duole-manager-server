module.exports = app=>{

	let { STRING, DOUBLE, DATE, INTEGER, TEXT } = app.Sequelize

	const tableName = "nike_stock_change"
	
	const NikeStockChange = app.SjNikeStock.define(tableName,{
		id:{
			type:INTEGER(11).UNSIGNED,
			primaryKey:true,
			autoIncrement:true,
		},

		sku:{
			type:STRING(100),
			allowNull:true,
			defaultValue:'',
		},

		type:{
			type:STRING(20),
			allowNull:true,
			defaultValue:'',
		},

		skuType:{
			type:STRING(6),
			allowNull:true,
			defaultValue:'',
		},

		stock:{
			type:STRING(500),
			allowNull:true,
			defaultValue:'',
		},

		stockChange:{
			type:STRING(500),
			allowNull:true,
		},

		realTimeStock:{
			type:STRING(500),
			allowNull:true,
		},

		md5:{
			type:STRING(100),
			allowNull:true,
			defaultValue:'',
		},

		createdAt:{
			type:STRING(100),
			allowNull:false,
			defaultValue:'',
		},

		updateAt:{
			type:DATE,
			allowNull:false,
			defaultValue:0,
		},

		update_time:{
			type:DATE,
			allowNull:false,
			defaultValue:'',
		},

		content:{
			type:TEXT,
			allowNull:false,
			defaultValue:'',
		},

		status:{
			type:INTEGER(2),
			allowNull:true,
			defaultValue:0,
		},

		orderScore:{
			type:INTEGER(10),
			allowNull:true,
			defaultValue:0,
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

