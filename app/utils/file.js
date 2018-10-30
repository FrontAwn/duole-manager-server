const fs = require("fs");
const path = require("path");
const concat = require("concat-files");
const child_process = require("child_process")
const debug = require('./utils').common.debug

//判断文件或者文件夹是否存在
function isExist(filePath){
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if(err && err.code === 'ENOENT'){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
}

//列出文件夹下所有文件
function listDir(path){
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            //去掉临时文件
            if(data && data.length > 0 && data[0] === '.DS_Store'){
                data.splice(0, 1);
            }

            resolve(data);
        })
    })
}

//获取临时文件列表
async function getChunkList(filePath, folderPath){
    let isFileExit = await isExist(filePath);
    let result = {};

    if(isFileExit){
        result = {
            file: {
                isExists: true,
                name: filePath
            }
        }
    }else{
        //判断对应md5的文件是否存在，为了存放对应文件的分块
        let isFolderExist = await isExist(folderPath);
        let fileList = [];
        // 如果对应md5的文件存在，则这个对应文件夹下所有分块文件
        if(isFolderExist){
            fileList = await listDir(folderPath);
        }
        result = {
            chunkList: fileList
        }
    }
    return result;
}

//判断文件夹是否存在，不存在则新建
function folderIsExists(folderPath){
    return new Promise((resolve, reject) => {
        fs.stat(folderPath, (err, stats) => {
            if(err && err.code === 'ENOENT'){
                child_process.exec("chmod 777 " + path.resolve(folderPath,'../'), () => {
                    child_process.exec("mkdir -p " + folderPath, function(err){
                        if(err){
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    })
                });
            }else{
                resolve(true);
            }        
        })
    })
}

//文件拷贝
function transferFile(sourse, destination){
    return new Promise((resolve, reject) => {
        fs.rename(sourse, destination, err => {
            if(err){
                reject(false)
            }else{
                resolve(true)
            }
        })
    })
}


function deleteFile(sourse) {
    return new Promise((resolve,reject)=>{
        child_process.exec(`rm -rf ${sourse}`,function(err){
            if(err) {
                reject(false)
            } else {
                resolve(true)
            }                
        })
    })
}

//合并临时文件
async function mergeFileChunks(sourceDir, destinationDir, fileName){
    let writeStream = fs.createWriteStream(path.join(destinationDir, fileName));
    let fileList = await listDir(sourceDir);

    for(let i = 0; i < fileList.length; i++){
        fileList[i] = sourceDir + '/' + fileList[i];
    }

    concat(fileList, path.join(destinationDir, fileName), () => {
        console.log('merge done!!!')
    })
}

module.exports = {
    isExist,
    listDir,
    getChunkList,
    folderIsExists,
    transferFile,
    mergeFileChunks,
    deleteFile,
}