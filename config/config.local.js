'use strict';

module.exports = appInfo => {
    const config = exports = {};

    config.mysql = {
      clients: {

        sj_resource: {
          host: 'localhost',
          port: '3306',
          user: 'root',
          password: '123456',
          database: 'sj-resource',
        }, 
               
      },

      default: {

      },
      app: true,
      agent: false,
    };  


    config.sequelize = {
        datasources:[
            // {
            //     dialect: 'mysql', 
            //     database: 'existing-stock',
            //     host: 'localhost',
            //     port: '3306',
            //     username: 'root',
            //     password: '123456',
            //     delegate: 'ExistingStock',
            //     baseDir:'model/existing-stock',
            //     define: {
            //         timestamps:false,
            //         freezeTableName: true,
            //     },
            // },

            {
                dialect: 'mysql', 
                database: 'sj-resource',
                host: 'localhost',
                port: '3306',
                username: 'root',
                password: '123456',
                delegate: 'SjResource',
                baseDir:'model/sj-resource',
                define: {
                    timestamps:false,
                    freezeTableName: true,
                },
            },
        ]
    }

    return config;
};
