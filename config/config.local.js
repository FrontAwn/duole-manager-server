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

      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    };  


    config.cluster={
      listen: {
        port: 8101,
        hostname: '192.168.1.121',
        // hostname: '127.0.0.1',
      }
    }

    return config;
};
