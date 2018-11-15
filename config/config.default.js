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

    config.bodyParser = {
      multipart: true,
      formLimit: '300mb',
      jsonLimit: '300mb',
      textLimit: '300mb'
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

    config.redis = {
      clients: {
        'default':{
          port: 6379,          // Redis port
          host: '127.0.0.1',   // Redis host
          password: 'auth',
          db: 0,
        }
      },
    }

    return config;
};
