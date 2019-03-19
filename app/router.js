'use strict';

module.exports = app => {
  const { router, controller } = app;

  // 日报
  router.get('/daily/handleExistingTable', controller.daily.handleExistingTable); // 处理日报“现货表”并保存数据
  router.get('/daily/getExistingLsByWeek', controller.daily.getExistingLsByWeek); // 得到4周日报数据
  router.get('/daily/getExistingExtraBySkus', controller.daily.getExistingExtraBySkus);


  // 毒app
  router.post('/duApp/saveSkus', controller.duApp.saveSkus); // 存储duapp货号
  router.get('/duApp/getNeedDumpProductCount', controller.duApp.getNeedDumpProductCount);
  router.get('/duApp/getAlreadyDumpProductConut', controller.duApp.getAlreadyDumpProductConut);
  router.get('/duApp/getAllDumpCreateDateList', controller.duApp.getAllDumpCreateDateList);
  router.get('/duApp/exportDetails', controller.duApp.exportDetails);


  // nike官网
  router.get('/nike/getChangeList', controller.nike.getChangeList);
  router.get('/nike/getSkuInfo', controller.nike.getSkuInfo);
  router.get('/nike/execGenerateStockCommand', controller.nike.execGenerateStockCommand);
  router.get('/nike/downloadStockExcelFile', controller.nike.downloadStockExcelFile);


  // 文件上传
  router.get('/upload/getExistChunks', controller.upload.getExistChunks);
  router.post('/upload/writeChunks', controller.upload.writeChunks);
  router.get('/upload/mergeChunks', controller.upload.mergeChunks);


  // 静态页面
  router.get('/static/tmallDailyPage', controller.static.tmallDailyPage);

};
