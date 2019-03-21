'use strict';

module.exports = app => {
  const { router, controller } = app;

  // 日报
  router.get('/daily/handleExistingTable', controller.daily.handleExistingTable); // 处理日报“现货表”并保存数据
  router.get('/daily/getExistingLsByWeek', controller.daily.getExistingLsByWeek); // 得到4周日报数据
  router.get('/daily/getExistingExtraBySkus', controller.daily.getExistingExtraBySkus);


  // 毒app
  router.get('/du/getSellProductList',controller.du.getSellProductList)
  router.get('/du/getSellProductDetail',controller.du.getSellProductDetail)
  router.get('/du/updateSellProductList',controller.du.updateSellProductList)
  router.get('/du/updateSellProductDetail',controller.du.updateSellProductDetail)
  router.get('/du/createSellProductList',controller.du.createSellProductList)
  router.get('/du/createSellProductDetail',controller.du.createSellProductDetail)
  router.get('/du/deleteSellProductList',controller.du.deleteSellProductList)
  router.get('/du/deleteSellProductDetail',controller.du.deleteSellProductDetail)

  // nike官网
  router.get('/nike/getChangeList', controller.nike.getChangeList);
  router.get('/nike/getSkuInfo', controller.nike.getSkuInfo);
  router.get('/nike/execGenerateStockCommand', controller.nike.execGenerateStockCommand);
  router.get('/nike/downloadStockExcelFile', controller.nike.downloadStockExcelFile);


  // tmall
  router.get("/tmall/writeCookie",controller.tmall.writeCookie);
  router.get("/tmall/cleanCookie",controller.tmall.cleanCookie);
  router.get("/tmall/truncateTable",controller.tmall.truncateTable)
  router.post("/tmall/saveSkuDetails",controller.tmall.saveSkuDetails)

  // 文件上传
  router.get('/upload/getExistChunks', controller.upload.getExistChunks);
  router.post('/upload/writeChunks', controller.upload.writeChunks);
  router.get('/upload/mergeChunks', controller.upload.mergeChunks);


  // 静态页面
  router.get('/static/tmallDailyPage', controller.static.tmallDailyPage);

};
