const router = require('koa-router')();
const goods = require('../controllers/goods');

//得到不同类目的商品
router.get('/api/mall/getGoodsByType', goods.getGoodsByType);

//得到商品详情页信息
router.get('/api/mall/getGoodsInfo', goods.getGoodsInfo);

//获得商品详情页问答区数据
router.get('/api/mall/getGoodsMsg', goods.getGoodsMsg);

//提问商品
router.post('/api/mall/askGoodsMsg', goods.askGoodsMsg);

//加入购物车或立即购买
router.post('/api/mall/addOrder', goods.addOrder);

//获得用户订单
router.get('/api/mall/getOrderByState', goods.getOrderByState);

//删除订单
router.delete('/api/mall/deleteOrder', goods.deleteOrder);

//确认付款
router.get('/api/mall/pay', goods.pay);

//确认收货
router.get('/api/mall/confirmReceive', goods.confirmReceive);

//购物车结算
router.post('/api/mall/settleAccounts', goods.settleAccounts);

//发送评价
router.post('/api/mall/sendComment', goods.sendComment);

//得到商品评价
router.get('/api/mall/getGoodsComment', goods.getGoodsComment);

//关键词搜索商品
router.get('/api/mall/searchGoods', goods.searchGoods);

module.exports = router;
