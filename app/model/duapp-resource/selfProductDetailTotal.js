module.exports = app => {

  const { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize;
  const tableName = 'self_product_detail_total';

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

    item_id: {
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
      type: STRING(100),
      allowNull: false,
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

    sold_today_num: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },

    sold_detail: {
      type: STRING(1000),
      allowNull: false,
      defaultValue: '',
    },

    sell_date: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    create_at: {
      type: STRING(100),
      allowNull: false,
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

