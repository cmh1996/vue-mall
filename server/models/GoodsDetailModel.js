const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const GoodsDetailModel = sequelize.define('goodsDetail',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	goodsId:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	specName:{
		type:Sequelize.STRING(500),
		allowNull:false
	},
	stockNum:{
		type:Sequelize.INTEGER,
		defaultValue: 0,
		allowNull:false
	},
	unitPrice:{
		type:Sequelize.FLOAT,
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

module.exports = GoodsDetailModel;