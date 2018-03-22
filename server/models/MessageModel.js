const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const MessageModel = sequelize.define('message',{
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
	content:{
		type:Sequelize.STRING(500),
		allowNull:false
	},
	/*0未回复，1已回复*/
	state:{
		type:Sequelize.ENUM(0,1),
		defaultValue: 0,
		allowNull:false
	},
	createtime:{
		type:Sequelize.DATE,
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = MessageModel;