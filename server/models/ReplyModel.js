const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const ReplyModel = sequelize.define('reply',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	messageId:{
		type:Sequelize.BIGINT,
		allowNull:false
	},
	content:{
		type:Sequelize.STRING(500),
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = ReplyModel;