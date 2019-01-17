'use strict';

exports.multipart = {
	enable:false,
	package:'egg-multipart'
}

exports.onerror = {
    enable: true,
    package: 'egg-onerror',
}

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.bodyParser = {
  enable: true,
  package: 'body-parser',
}

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
}
