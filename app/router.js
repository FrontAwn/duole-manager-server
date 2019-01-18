'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/test', controller.test.index);

  router.get('/api/update',controller.api.update)
  router.get('/api/finds',controller.api.finds)
  router.get('/api/count',controller.api.count)
  router.get('/api/create',controller.api.create)
  router.get('/api/delete',controller.api.delete)

  // 处理日报excel保存数据
  router.get('/dailyReport/handleDailyReportFromCurrentStock', controller.dailyReport.handleDailyReportFromCurrentStock);
  // 根据sku获得近4周每周日报现货的数据
  router.get('/dailyReport/getBeforeFrouWeekCurrentStockBySku', controller.dailyReport.getBeforeFrouWeekCurrentStockBySku);


  //导出淘宝店铺商品excel表
  router.get('/taobao/exportTaobaoProductList', controller.taobao.exportTaobaoProductList);

  //毒app du_sku_list
  router.post('/duApp/saveSkus',controller.duApp.saveSkus);
  //导出毒app抓取的数据
  router.get('/duApp/exportCurrentDayDetails',controller.duApp.exportCurrentDayDetails)
  router.get('/duApp/exportHistoryDetails',controller.duApp.exportHistoryDetails)

  // www.nike.net
  router.get('/nike/getChangeList',controller.nike.getChangeList)
  router.get('/nike/getSkuInfo',controller.nike.getSkuInfo)
  router.get('/nike/execGenerateStockCommand',controller.nike.execGenerateStockCommand)
  router.get('/nike/downloadStockExcelFile',controller.nike.downloadStockExcelFile)
  
  


  // 大文件上传操作
  router.get('/file/check_file_exists', controller.file.checkFileExists);
  router.post('/file/upload_file_chunk', controller.file.uploadFileChunk);
  router.get('/file/merge_file_chunks', controller.file.mergeFileChunks);


};
