'use strict';

module.exports = appInfo => {
    const config = exports = {};

    config.mysql = {
      clients: {

        sj_resource: {
          host: "192.168.1.121",
          port: '3306',
          user: "song",
          password: "SongAbc12345",
          database: "sj-resource",
        }, 
               
      },
      default: {

      },

      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    };  

    config.cluster={
      listen: {
        port: 8101,
        // hostname: '192.168.1.121',
        hostname: '127.0.0.1',
      }
    }


    config.sequelize = {
        datasources:[
            // {
            //     dialect: 'mysql', 
            //     database: 'existing-stock',
            //     host: '192.168.1.121',
            //     port: '3306',
            //     username: 'song',
            //     password: 'SongAbc12345',
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
