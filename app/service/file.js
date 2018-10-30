const Service = require('egg').Service;
const File = require('../utils/file.js')
const Cache = require('../utils/cache.js')
const path = require('path')

class FileService extends Service {

	async checkFileExists(filename,fileMD5) {
		let UploadPath = Cache.getItem('__UPLOADS__');
		let fileRealPath = path.join(UploadPath,filename)
		let fileRealMd5Path = path.join(UploadPath,fileMD5)
		return await File.getChunkList(fileRealPath,fileRealMd5Path);

	}

	async uploadFileChunk(fileSource,fileMD5,currentChunkIdx) {
		var UploadPath = path.join(Cache.getItem('__UPLOADS__'),fileMD5);

		var isExist = await File.folderIsExists(UploadPath)

		var destinationFile = path.join(UploadPath,currentChunkIdx)
		var sourceFile = fileSource[0].path

		var transferStatus = await File.transferFile(sourceFile,destinationFile)

		if (transferStatus) {
			await File.deleteFile(sourceFile)
		}

		return transferStatus
	}

	async mergeFileChunks(fileName,fileMD5) {
		var fileChunkDir = path.join(Cache.getItem('__UPLOADS__'),fileMD5);
		var fileDestinationDir = Cache.getItem('__UPLOADS__');
		await File.mergeFileChunks(fileChunkDir,fileDestinationDir,fileName);
		var realPath = path.join(fileDestinationDir,fileName);
		return realPath
	}

}

module.exports = FileService


