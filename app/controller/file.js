const Controller = require('egg').Controller;
var common = require('../utils/utils').common

class FileController extends Controller {

	async checkFileExists() {
		let { filename , fileMD5 } = this.ctx.query
		let res = await this.service.file.checkFileExists(filename,fileMD5)
		common.success(res);
	}

	async uploadFileChunk() {
		var {
			fileSource,
			fileMD5,
			currentChunkIdx,
		} = this.ctx.request.body

		var transferStatus = await this.service.file.uploadFileChunk(fileSource,fileMD5,currentChunkIdx)

		transferStatus ? common.success({'status':'success'}) : common.success({'status':'failed'});

	}

	async mergeFileChunks() {
		var {
			fileName,
			fileMD5
		} = this.ctx.query

		var realPath = await this.service.file.mergeFileChunks(fileName,fileMD5);
		common.success({realPath});
	}

}






module.exports = FileController