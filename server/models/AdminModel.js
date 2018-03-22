const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase');

const AdminModel = sequelize.define('admin',{
	id:{
		type:Sequelize.BIGINT,
		primaryKey:true,
		allowNull:false,
		autoIncrement:true
	},
	account:{
		type:Sequelize.STRING(255),
		unique:true,
		allowNull:false
	},
	name:{
		type:Sequelize.STRING(64),
		allowNull:false
	},
	pwd:{
		type:Sequelize.STRING(255),
		allowNull:false
	},
},{
	timestamps:false,
});

module.exports = AdminModel;