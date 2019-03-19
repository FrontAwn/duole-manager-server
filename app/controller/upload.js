const Controller = require('egg').Controller;
const path = require('path');
const utils = require('../utils');
const child_process = require('child_process');
const promisify = require('util').promisify;
const exec = promisify(child_process.exec);
const debug = utils.common.debug;
const folder = utils.folder;
const paths = utils.container.get('paths');
const concat = require('concat-files');
const mergeFile = promisify(concat);


class UploadController extends Controller {

  async getExistChunks() {
    let { files } = this.ctx.query;
    files = JSON.parse(files);
    const uploadPath = paths.uploads;
    const chunks = {};

    for (const [ md5, file ] of Object.entries(files)) {
      const fileFullPath = path.resolve(uploadPath, file.name);
      const fileMd5Dir = path.resolve(uploadPath, md5);

      const fileExists = await folder.isExists(fileFullPath);
      const fileMd5DirExists = await folder.isExists(fileMd5Dir);

      let fileChunks = [];

      if (fileExists) {
        await exec(`rm -rf ${fileFullPath}`);
      }

      if (fileMd5DirExists) {
        fileChunks = await folder.getDirFiles(fileMd5Dir);
      } else {
        await exec(`mkdir -p ${fileMd5Dir}`);
      }

      chunks[md5] = fileChunks;

    }

    this.ctx.body = chunks;
  }

  async writeChunks() {
    const { chunk, idx, md5 } = this.ctx.request.body;
    const tmpPath = chunk[0].path;
    const uploadPath = paths.uploads;
    const chunkPath = `${uploadPath}/${md5}/${idx}`;
    const transferStatus = await folder.transferFile(tmpPath, chunkPath);
    if (transferStatus) {
      await folder.deleteFile(tmpPath);
    }
    this.ctx.body = {
      status: true,
    };
  }

  async mergeChunks() {
    const { name, md5 } = this.ctx.query;
    const uploadPath = paths.uploads;
    const md5Path = `${uploadPath}/${md5}`;
    const md5Exists = await folder.isExists(md5Path);
    if (!md5Exists) {
      this.ctx.body = {
        status: false,
        msg: `没有找到md5路径:${md5Path}`,
      };
    } else {
      const filePath = `${uploadPath}/${name}`;
      const chunks = await folder.getDirFiles(md5Path);
      for (let idx = 0; idx < chunks.length; idx++) {
        chunks[idx] = `${md5Path}/${chunks[idx]}`;
      }
      await mergeFile(chunks, filePath);
      this.ctx.body = {
        status: true,
        msg: `${filePath}`,
      };
    }
  }

}


module.exports = UploadController;
