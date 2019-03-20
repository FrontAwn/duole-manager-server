module.exports = app => {

  const { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize;
  const tableName = 'sell_product_detail_total';

  const SelfProductDetailTotal = app.DuappResource.define(tableName, {
    id: {
      type: INTEGER(11).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    sku: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },

    price: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },

    product_id: {
      type: INTEGER(11).UNSIGNED,
      allowNull: 0,
      defaultValue: '',
    },

    title: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
    },

    size_list: {
      type: STRING(3000),
      allowNull: false,
      defaultValue: '',
    },

    sold_total: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },

    sold_num: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },

    sold_detail: {
      type: STRING(1000),
      allowNull: false,
      defaultValue: '',
    },

    sold_last_id: {
      type: STRING(300),
      allowNull: false,
      defaultValue: '',
    },

    create_at: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    
    date_num: {
      type: INTEGER(11).UNSIGNED,
      allowNull: 0,
      defaultValue: '',
    },
  }, {
    tableName,
    timestamps: false,
    // indexes:[
    // 	{
	 //      		fields: ['sku', 'create_time'],
    // 	}
    // ]
  });

  return SelfProductDetailTotal;

};

