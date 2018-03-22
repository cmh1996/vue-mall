const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const OrderModel = sequelize.define('order',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	userId:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	goodsDetailId:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	goodsNum:{
		type:Sequelize.INTEGER,
		allowNull:false
	},
	amount:{
		type:Sequelize.FLOAT,
		allowNull:false
	},
	/*0未付款，1已付款未发货，2已发货未确认收到，3确认到货订单完成*/
	state:{
		type:Sequelize.ENUM(0,1,2,3),
		defaultValue: 0,
		allowNull:false
	},
	updatetime:{
		type:Sequelize.DATE,
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = OrderModel;