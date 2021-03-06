'use strict';

const env = "remote"

module.exports = appInfo => {
  const config = exports = {};

  if ( env === "local" ) {
    config.sequelize = {
      datasources: [
        {
          dialect: 'mysql',
          database: 'sj-resource',
          host: 'localhost',
          port: '3306',
          username: 'root',
          password: '123456',
          delegate: 'SjResource',
          baseDir: 'model/sj-resource',
          define: {
            timestamps: false,
            freezeTableName: true,
          },
        },

        {
          dialect: 'mysql',
          database: 'daily-resource',
          host: 'localhost',
          port: '3306',
          username: 'root',
          password: '123456',
          delegate: 'DailyResource',
          baseDir: 'model/daily-resource',
          define: {
            timestamps: false,
            freezeTableName: true,
          },
        },

        {
          dialect: 'mysql',
          database: 'duapp-resource',
          host: 'localhost',
          port: '3306',
          username: 'root',
          password: '123456',
          delegate: 'DuappResource',
          baseDir: 'model/duapp-resource',
          define: {
            timestamps: false,
            freezeTableName: true,
          },
        },
      ],
    };


    config.redis = {
      clients: {
        default: {
          port: 6379,
          host: '127.0.0.1',
          password: 'auth',
          db: 0,
        },
      },
    };
  }

  if ( env === "remote" ) {
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

              {
                  dialect: 'mysql',
                  database: 'daily-resource',
                  host: '192.168.1.121',
                  port: '3306',
                  username: 'song',
                  password: 'SongAbc12345',
                  delegate: 'DailyResource',
                  baseDir:'model/daily-resource',
                  define: {
                      timestamps:false,
                      freezeTableName: true,
                  },
              },

              {
                  dialect: 'mysql',
                  database: 'duapp-resource',
                  host: '192.168.1.121',
                  port: '3306',
                  username: 'song',
                  password: 'SongAbc12345',
                  delegate: 'DuappResource',
                  baseDir:'model/duapp-resource',
                  define: {
                      timestamps:false,
                      freezeTableName: true,
                  },
              },
          ]
      }


      config.redis = {
        clients: {
          'default':{
            port: 6379,
            host: '192.168.1.121',
            password: 'auth',
            db: 0,
          }
        },
      }
  }

  
  return config;
};
