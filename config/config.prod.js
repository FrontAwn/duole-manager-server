'use strict';

module.exports = appInfo => {
    const config = exports = {};

    config.cluster={
      listen: {
        port: 8101,
        // hostname: '192.168.1.121',
        hostname: '127.0.0.1',
      }
    }

    config.sequelize = {
        datasources:[
            {
                dialect: 'mysql', 
                database: 'sj_nike_stock',
                host: '192.168.1.121',
                port: '3306',
                username: 'song',
                password: 'SongAbc12345',
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
                host: '192.168.1.121',
                port: '3306',
                username: 'song',
                password: 'SongAbc12345',
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
