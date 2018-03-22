const AdminModel = require('../models/AdminModel.js');
const UserModel = require('../models/UserModel.js');
const MessageModel = require('../models/MessageModel.js');
const GoodsModel = require('../models/GoodsModel.js');
const ReplyModel = require('../models/ReplyModel.js');
const jwt = require('jsonwebtoken');
const moment = require('moment');

//获得未回复的留言
exports.getNoReplyMsg = async (ctx)=>{
	try{
		const noReplyMsgs = await MessageModel.findAll({
			attributes:['id','userId','goodsId','content','createtime'],
			order: [
	          	['createtime','DESC']
	        ],
			where:{
				state:0
			}
		});
		if(noReplyMsgs.length===0){
			ctx.body={
				code:10000,
				data:[]
			}
			return;
		}else{
			let messageList = [];
			for(let msg of noReplyMsgs){
				let user = await UserModel.findOne({
					attributes:['headimg','nickname'],
					where:{
						id:msg.dataValues.userId
					}
				});
				//用户已被删除
				if(!user){
					user = {};
					user.nickname = '该用户已注销';
					user.headimg = ''
				}
				let goods = await GoodsModel.findOne({
					attributes:['id','name'],
					where:{
						id:msg.dataValues.goodsId
					}
				});
				//商品已被删除
				if(!goods){
					goods = {};
					goods.id = 0;
					goods.name = '该商品已下架';
				}
				messageList.push({
					user:{
						name:user.nickname,
						headimg:user.headimg
					},
					id:msg.dataValues.id,
					content:msg.dataValues.content,
					time:moment(msg.dataValues.createtime).add('hours',8).format('MM-DD HH:mm'),
					goods:{
						id:goods.id,
						name:goods.name
					}
				})
			};
			ctx.body = {
				code:0,
				data:messageList
			}
		}
	}
	catch(e){
		console.log('eeeeeeeeee',e)
		ctx.body={
			code:10000,
			message:'网络出错'
		}
	}
}

//获得已回复的留言
exports.getRepliedMsg = async (ctx)=>{
	try{
		const repliedMsg = await MessageModel.findAll({
			attributes:['id','userId','goodsId','content','createtime'],
			order: [
	          	['createtime','DESC']
	        ],
			where:{
				state:1
			}
		});
		if(repliedMsg.length===0){
			ctx.body={
				code:10000,
				data:[]
			}
			return;
		}else{
			let messageList = [];
			for(let msg of repliedMsg){
				let user = await UserModel.findOne({
					attributes:['headimg','nickname'],
					where:{
						id:msg.dataValues.userId
					}
				});
				//用户已被删除
				if(!user){
					user = {};
					user.nickname = '该用户已注销';
					user.headimg = ''
				}
				let goods = await GoodsModel.findOne({
					attributes:['id','name'],
					where:{
						id:msg.dataValues.goodsId
					}
				});
				//商品已被删除
				if(!goods){
					goods = {};
					goods.id = 0;
					goods.name = '该商品已下架';
				}
				const reply = await ReplyModel.findOne({
					attributes:['content'],
					where:{
						messageId:msg.dataValues.id
					}
				});
				messageList.push({
					user:{
						name:user.nickname,
						headimg:user.headimg
					},
					id:msg.dataValues.id,
					content:msg.dataValues.content,
					replyContent:reply.content,
					time:moment(msg.dataValues.createtime).add('hours',8).format('MM-DD HH:mm'),
					goods:{
						id:goods.id,
						name:goods.name
					}
				})
			};
			ctx.body = {
				code:0,
				data:messageList
			}
		}
	}
	catch(e){
		console.log('eeeeeeeeee',e)
		ctx.body={
			code:10000,
			message:'网络出错'
		}
	}
}

//回复
exports.reply = async (ctx)=>{
	const replyObj = ctx.request.body;
	try{
		const res = await ReplyModel.create({
			messageId:replyObj.id,
			content:replyObj.content,
			createtime:new Date()
		});
		const res2 = await MessageModel.update(
		      {
		        state:1
		      },
		      {
		        where: {
		          id:replyObj.id
		        }
		      }
	    );
		ctx.body = {
			code:0
		}
	}
	catch(e){
		ctx.body={
			code:10000,
			message:'网络出错'
		}
	}
}
