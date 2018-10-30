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


    return config;
};
