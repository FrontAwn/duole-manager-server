module.exports = app => {

  const { STRING, DOUBLE, DATE, INTEGER } = app.Sequelize;

  const tableName = 'daily_amount';

  const DailyReportCurrentStock = app.DailyResource.define(tableName, {
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
    num: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },

    name: {
      type: STRING(100),
      allowNull: false,
      defaultValue: '',
    },

    total: {
      type: INTEGER(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    cost_info: {
      type: STRING(1000),
      allowNull: false,
      defaultValue: '',
    },

    distribution_info: {
      type: STRING(1000),
      allowNull: false,
      defaultValue: '',
    },

    brand_price: {
      type: DOUBLE(8, 2).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    // 零售销量
    retail: {
      type: INTEGER(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    // 零售总额度
    retail_price: {
      type: DOUBLE(8, 2),
      allowNull: false,
      defaultValue: 0,
    },


    // 总销量(分销+零售)
    amount_count: {
      type: INTEGER(8).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    // 零售毛利
    maori: {
      type: STRING(50),
      allowNull: false,
      defaultValue: 0,
    },

    // 零售毛利率
    maori_rate: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
    },

    type: {
      type: INTEGER(4).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    sj_info: {
      type: STRING(1000),
      allowNull: false,
      defaultValue: '',
    },

    hj_info: {
      type: STRING(1000),
      allowNull: false,
      defaultValue: '',
    },

    gld_info: {
      type: STRING(1000),
      allowNull: false,
      defaultValue: '',
    },

    create_time: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
    },

    update_time: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    tableName,
    timestamps: false,
    indexes: [
      {
        name: 'sku_and_create_time',
	      		fields: [ 'sku', 'create_time' ],
      },
    ],
  });

  return DailyReportCurrentStock;

};

