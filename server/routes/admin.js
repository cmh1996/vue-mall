const router = require('koa-router')();
const userAdmin = require('../controllers/userAdmin');
const msgAdmin = require('../controllers/msgAdmin');
const orderAdmin = require('../controllers/orderAdmin');
const goodsAdmin = require('../controllers/goodsAdmin');


//登录
router.post('/api/admin/login', userAdmin.login);

//查询所有用户
router.get('/api/admin/allUser', userAdmin.getAllUser);

//删除指定用户
router.delete('/api/admin/deleteUser', userAdmin.deleteUser);

//搜索用户
router.get('/api/admin/searchUser', userAdmin.searchUser);

//修改密码
router.post('/api/admin/changePwd', userAdmin.changePwd);

//查询未回复信息
router.get('/api/admin/noReplyMsg', msgAdmin.getNoReplyMsg);

//查询已回复信息
router.get('/api/admin/repliedMsg', msgAdmin.getRepliedMsg);

//回复信息
router.post('/api/admin/reply', msgAdmin.reply);

//获取订单s
router.get('/api/admin/orders', orderAdmin.getOrders);

//获取订单一些可供修改的信息
router.get('/api/admin/order', orderAdmin.getOrder);

//修改订单
router.post('/api/admin/changeOrder', orderAdmin.changeOrder);

//删除订单
router.delete('/api/admin/deleteOrder', orderAdmin.deleteOrder);

//得到类目
router.get('/api/admin/getType', goodsAdmin.getType);

//得到商品
router.get('/api/admin/getGoodsByType', goodsAdmin.getGoodsByType);

//增加类目
router.post('/api/admin/addType', goodsAdmin.addType);

//得到商品
router.get('/api/admin/getGoodsInfo', goodsAdmin.getGoodsInfo);

//增加商品
router.post('/api/admin/addGoods', goodsAdmin.addGoods);

//增加规格
router.post('/api/admin/addSpec', goodsAdmin.addSpec);

//删除规格
router.post('/api/admin/deleteSpec', goodsAdmin.deleteSpec);

//更新商品信息
router.post('/api/admin/updateGoods', goodsAdmin.updateGoods);

//删除商品
router.delete('/api/admin/deleteGoods', goodsAdmin.deleteGoods);

module.exports = router;