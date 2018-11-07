'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/test', controller.test.index);
  
  // 处理日报excel保存数据
  router.get('/dailyReport/handleDailyReportFromCurrentStock', controller.dailyReport.handleDailyReportFromCurrentStock);
  // 根据sku获得近4周每周日报现货的数据
  router.get('/dailyReport/getBeforeFrouWeekCurrentStockBySku', controller.dailyReport.getBeforeFrouWeekCurrentStockBySku);

  //导出淘宝店铺商品excel表
  router.get('/taobao/exportTaobaoProductList', controller.taobao.exportTaobaoProductList);

  // 大文件上传操作
  router.get('/file/check_file_exists', controller.file.checkFileExists);
  router.post('/file/upload_file_chunk', controller.file.uploadFileChunk);
  router.get('/file/merge_file_chunks', controller.file.mergeFileChunks);
};
