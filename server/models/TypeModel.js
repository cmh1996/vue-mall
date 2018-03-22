const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const TypeModel = sequelize.define('type',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	name:{
		type:Sequelize.STRING(255),
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = TypeModel;