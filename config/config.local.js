'use strict';

module.exports = appInfo => {
    const config = exports = {};

    config.sequelize = {
        datasources:[
            {
                dialect: 'mysql', 
                database: 'sj_nike_stock',
                host: 'localhost',
                port: '3306',
                username: 'root',
                password: '123456',
                delegate: 'SjNikeStock',
                baseDir:'model/sj-nike-stock',
                define: {
                    timestamps:false,
                    freezeTableName: true,
                },
            },

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
