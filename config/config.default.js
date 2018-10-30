'use strict';

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1539670894789_8745';

    // add your config here
    config.middleware = ['betterbody'];

    config.betterbody = {
      fields: 'body'
    }


    // config.multipart = {
    //     fileSize: '100mb',
    //     mode:'stream'
    // };

    config.bodyParser = {
      multipart: true,
      formLimit: '300mb',
      jsonLimit: '300mb',
      textLimit: '300mb'
    };



    config.mysql = {
      clients: {

        test: {
          host: 'localhost',
          port: '3306',
          user: 'root',
          password: '123456',
          database: 'test',
        },

        daily_report: {
          host: 'localhost',
          port: '3306',
          user: 'root',
          password: '123456',
          database: 'daily_report',
        }, 
               
      },
      default: {

      },

      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    };  


    config.security = {
      csrf: {
        enable: false,
        ignoreJSON: true
      },
      domainWhiteList: ['*']
    };

    config.cors = {
      origin:'*',
      allowMethods: 'GET,POST'
    };


    return config;
};
