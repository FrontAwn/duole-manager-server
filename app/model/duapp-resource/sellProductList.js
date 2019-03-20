module.exports = app => {

  const { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize;

  const tableName = 'sell_product_list';

  const SelfProductList = app.DuappResource.define(tableName, {
    id: {
      type: INTEGER(11).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    title: {
      type: STRING(300),
      allowNull: false,
      defaultValue: '',
    },
    url: {
      type: STRING(500),
      allowNull: false,
      defaultValue: '',
    },
    sku: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: INTEGER(5).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
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

  return SelfProductList;

};

