const fs = require('fs');
const path = require('path');
const concat = require('concat-files');
const child_process = require('child_process');

const folder = {};
// 判断文件或者文件夹是否存在

folder.isExists = filePath => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, err => {
      if (!err) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

folder.addSuffix = path => {
  if (path.lastIndexOf('.js') !== 0) {
    return path + '.js';
  }
  return path;
};

folder.addPrefix = (path, prefix = '/') => {
  if (prefix === '/' && path[0] !== '/') {
    return '/' + path;
  }

  return prefix + path;
};

folder.getDirFiles = path => {
  return new Promise((res, rej) => {
    fs.readdir(path, (err, data) => {
      if (data && data.length > 0 && data[0] === '.DS_Store') {
        data.splice(0, 1);
      }
      res(data);
    });
  });
};


// 移动文件拷贝
folder.transferFile = (sourse, destination) => {
  return new Promise((resolve, reject) => {
    fs.rename(sourse, destination, err => {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

// 删除文件
folder.deleteFile = sourse => {
  return new Promise((resolve, reject) => {
    child_process.exec(`rm -rf ${sourse}`, function(err) {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = folder;

