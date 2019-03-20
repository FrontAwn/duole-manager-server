module.exports = app => {

  const { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize;

  const tableName = 'tmall_sj_sku';

  const TmallSjSku = app.SjResource.define(tableName, {
    id: {
      type: INTEGER(11).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    item_id: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    sku: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },
    title: {
      type: STRING(300),
      allowNull: false,
      defaultValue: '',
    },
    stock: {
      type: INTEGER(11).UNSIGNED,
      allowNull: 0,
      defaultValue: '',
    },
    size_list: {
      type: STRING(3000),
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

  return TmallSjSku;

};

