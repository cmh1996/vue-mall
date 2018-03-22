const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const CommentModel = sequelize.define('comment',{
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
	goodsId:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	goodsDetailId:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	orderId:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	content:{
		type:Sequelize.STRING(500),
		allowNull:true
	},
	/*打分，一颗星代表20分，最高100分*/
	score:{
		type:Sequelize.INTEGER,
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = CommentModel;