module.exports = app => {

  const { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize;

  const tableName = 'nike_product_list';

  const NikeProductList = app.DuappResource.define(tableName, {
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

  return NikeProductList;

};

