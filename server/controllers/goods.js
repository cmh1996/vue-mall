const GoodsDetailModel = require('../models/GoodsDetailModel.js');
const GoodsModel = require('../models/GoodsModel.js');
const TypeModel = require('../models/TypeModel.js');
const MessageModel = require('../models/MessageModel.js');
const ReplyModel = require('../models/ReplyModel.js');
const UserModel = require('../models/UserModel.js');
const OrderModel = require('../models/OrderModel.js');
const CommentModel = require('../models/CommentModel.js');

const jwt = require('jsonwebtoken');
const moment = require('moment');

//得到不同类目的商品
exports.getGoodsByType = async (ctx)=>{
	const typeId = ctx.query.typeId;
	try{
		let goods;
		//查全部
		if(typeId==='-1'){
			goods = await GoodsModel.findAll({
				attributes:['id','name','img','typeId'],
				order: [
		          	['createtime','DESC']
		        ],
			});
		}else{
			goods = await GoodsModel.findAll({
				attributes:['id','name','img','typeId'],
				where:{
					typeId:typeId
				},
				order: [
		          	['createtime','DESC']
		        ],
			});
		}
		if(goods.length===0){
			ctx.body = {
				code:0,
				data:[]
			};
			return;
		}

		let goodsList = [];

		for(let item of goods){
			const spec = await GoodsDetailModel.findOne({
				attributes:['unitPrice'],
				where:{
					goodsId:item.dataValues.id
				}
			});
			goodsList.push({
				id:item.dataValues.id,
				img:item.dataValues.img,
				name:item.dataValues.name,
				price:spec.unitPrice,
				typeId:item.dataValues.typeId
			})
		};
		ctx.body = {
			code:0,
			data:goodsList
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络错误'
		}
	}
}


//得到商品详情页信息
exports.getGoodsInfo = async (ctx)=>{
	const id = ctx.query.id;
	try{
		const goods = await GoodsModel.findOne({
			attributes:['id','name','img','desc','typeId'],
			where:{
				id:id
			},
		});
		if(!goods){
			ctx.body = {
				code:0,
				data:{
					img:'',
					name:'',
					desc:'',
					specs:[],
					typeId:''
				}
			};
			return;
		}

		const specs = await GoodsDetailModel.findAll({
			attributes:['id','specName','stockNum','unitPrice'],
			where:{
				goodsId:id
			}
		});

		ctx.body = {
			code:0,
			data:{
				img:goods.img,
				name:goods.name,
				desc:goods.desc,
				typeId:goods.typeId,
				specs:specs
			}
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络错误'
		}
	}
}

//获得商品详情页问答区数据
exports.getGoodsMsg = async (ctx)=>{
	const id = ctx.query.id;
	try{
		const msgs = await MessageModel.findAll({
			where:{
				goodsId:id
			},
			order: [
	          	['createtime','DESC']
	        ],
		});
		if(msgs.length===0){
			ctx.body = {
				code:0,
				data:[]
			};
			return;
		}

		let msgList = [];
		for(let msg of msgs){
			let nickname = '';
			let user = await UserModel.findOne({
				attributes:['nickname'],
				where:{
					id:msg.dataValues.userId
				}
			});

			if(!user){
				nickname = '该用户已注销'
			}else{
				nickname = user.nickname
			}

			let replyObj = {};
			let reply = await ReplyModel.findOne({
				attributes:['id','content','createtime'],
				where:{
					messageId:msg.dataValues.id
				}
			});

			if(reply){
				replyObj = {
					id:reply.id,
					content:reply.content,
					time:moment(reply.createtime).add('hours',8).format('MM-DD HH:mm')
				}
			}

			msgList.push({
				id:msg.dataValues.id,
				content:msg.dataValues.content,
				state:msg.dataValues.state,
				asker:nickname,
				time:moment(msg.dataValues.createtime).add('hours',8).format('MM-DD HH:mm'),
				reply:replyObj
			})
		}

		ctx.body = {
			code:0,
			data:msgList
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络错误'
		}
	}
}

//提问商品
exports.askGoodsMsg = async (ctx)=>{
	const token = ctx.request.body.token;
	try{
		const res = MessageModel.create({
			userId:jwt.verify(token,'chambers'),
			goodsId:ctx.request.body.goodsId,
			content:ctx.request.body.msg,
			createtime:new Date()
		})
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


//加入购物车或立即购买
exports.addOrder = async (ctx)=>{
	const token = ctx.request.body.token;
	try{
		const res = OrderModel.create({
			userId:jwt.verify(token,'chambers'),
			goodsDetailId:ctx.request.body.goodsDetailId,
			goodsNum:ctx.request.body.num,
			amount:ctx.request.body.amount,
			state:ctx.request.body.state,
			updatetime:new Date(),
			createtime:new Date()
		});
		//如果是立即购买的话，库存要马上变动
		if(ctx.request.body.state===1){
			const spec = await GoodsDetailModel.findOne({
				attributes:['stockNum'],
				where:{
					id:ctx.request.body.goodsDetailId
				}
			});
			let newNum = spec.stockNum-ctx.request.body.num;
			await GoodsDetailModel.update(
			      {
			        stockNum:newNum
			      },
			      {
			        where: {
			          id:ctx.request.body.goodsDetailId
			        }
			      }
		    );
		};
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


//获得用户订单
exports.getOrderByState = async (ctx)=>{
	const state = Number(ctx.query.state);
	const userId = jwt.verify(ctx.query.token,'chambers');
	try{
		let orders;
		//查全部的
		if(state===-1){
			orders = await OrderModel.findAll({
				where:{
					userId:userId,
				},
				order: [
		          	['createtime','DESC']
		        ],
			});
		}else{
			orders = await OrderModel.findAll({
				where:{
					userId:userId,
					state:state
				},
				order: [
		          	['createtime','DESC']
		        ],
			});
		};

		let orderList = [];
		for(let order of orders){
			const spec = await GoodsDetailModel.findOne({
				attributes:['id','goodsId','specName','unitPrice'],
				where:{
					id:order.dataValues.goodsDetailId
				}
			});
			if(!spec){
				continue;
			}
			const goods = await GoodsModel.findOne({
				attributes:['id','name','img'],
				where:{
					id:spec.goodsId
				}
			});
			if(!goods){
				continue;
			}

			//如果是已完成订单，那就看看评价过没有
			let hasComment = false;
			if(order.dataValues.state===3){
				let comment = await CommentModel.findOne({
					where:{
						orderId:order.dataValues.id
					}
				});
				if(comment){
					hasComment = true;
				}
			}

			orderList.push({
				id:order.dataValues.id,
				createtime:moment(order.dataValues.createtime).add('hours',8).format('MM-DD HH:mm'),
				goods:{
					img:goods.img,
					id:goods.id,
					goodsDetailId:spec.id,
					name:goods.name,
					spec:spec.specName,
					unitPrice:spec.unitPrice,
				},
				goodsNum:order.dataValues.goodsNum,
				amount:order.dataValues.amount,
				state:order.dataValues.state,
				hasComment:hasComment
			})
		}

		ctx.body = {
			code:0,
			data:orderList
		}
	}
	catch(e){
		console.log(e);
		ctx.body={
			code:10000,
			message:'网络出错'
		}
	}
}

//删除订单
exports.deleteOrder = async (ctx)=>{
	const orderId = ctx.query.id;
	try{
		const order = await OrderModel.findOne({
			attributes:['goodsDetailId','state','goodsNum'],
			where:{
				id:orderId
			}
		});
		if(!order){
			ctx.body = {
				code:0
			}
			return;
		}

		//除了已完成订单和未付款订单外，其它状态的订单被删除，库存量都要加回去
		if(order.state===1 || order.state===2){
			const spec = await GoodsDetailModel.findOne({
				attributes:['stockNum'],
				where:{
					id:order.goodsDetailId
				}
			});
			let newNum = spec.stockNum+order.goodsNum;
			await GoodsDetailModel.update(
			      {
			        stockNum:newNum
			      },
			      {
			        where: {
			          id:order.goodsDetailId
			        }
			      }
		    );
		}

		//删除
		const res = await OrderModel.destroy({
			where:{
				id:orderId
			}
		});

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

//确认收货
exports.confirmReceive = async (ctx)=>{
	const orderId = ctx.query.id;
	try{
		await OrderModel.update(
	      {
	        state:3
	      },
	      {
	        where: {
	          id:orderId
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

//确认付款
exports.pay = async (ctx)=>{
	const orderId = ctx.query.id;
	try{
		await OrderModel.update(
	      {
	        state:1
	      },
	      {
	        where: {
	          id:orderId
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

//购物车结算
exports.settleAccounts = async (ctx)=>{
	let cartList = ctx.request.body.cartList;
	try{
		for(let item of cartList){
			let order = await OrderModel.findOne({
				attributes:['goodsDetailId'],
				where:{
					id:item.id
				}
			});
			await OrderModel.update(
		      {
		        state:1,
		        goodsNum:item.goodsNum,
		        amount:item.amount
		      },{
		        where: {
		          id:item.id
		        }
		      }
			);
			//更新库存
			let spec = await GoodsDetailModel.findOne({
				attributes:['stockNum'],
				where:{
					id:order.goodsDetailId
				}
			});
			let newNum = spec.stockNum-item.goodsNum;
			await GoodsDetailModel.update(
				{
	        		stockNum:newNum
		      	},{
		        	where: {
		          		id:order.goodsDetailId
		        	}
		      	}
			)
		};
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

//发送评价
exports.sendComment = async (ctx)=>{
	try{
		const res = await CommentModel.create({
			userId:jwt.verify(ctx.request.body.token,'chambers'),
	        goodsId:ctx.request.body.goodsId,
	        goodsDetailId:ctx.request.body.goodsDetailId,
	        orderId:ctx.request.body.orderId,
	        content:ctx.request.body.content,
	        score:ctx.request.body.score,
	        createtime:new Date()
		});
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

//获得商品评论
exports.getGoodsComment = async (ctx)=>{
	const goodsId = ctx.query.goodsId;
	try{
		const comments = await CommentModel.findAll({
			where:{
				goodsId:goodsId
			},
			order: [
	          	['createtime','DESC']
	        ],
		});
		if(comments.length<=0){
			ctx.body={
				code:0,
				data:{}
			};
			return;
		}

		//分数累加
		let sum = 0;
		let commentList = [];
		for(let comment of comments){
			sum+=comment.score;
			let user = await UserModel.findOne({
				attributes:['nickname','headimg'],
				where:{
					id:comment.dataValues.userId
				}
			});
			if(!user){
				user = {
					nickname:'该用户已注销',
					headimg:'http://tvax3.sinaimg.cn/default/images/default_avatar_male_180.gif'
				}
			};

			let spec = await GoodsDetailModel.findOne({
				attributes:['specName'],
				where:{
					id:comment.dataValues.goodsDetailId
				}
			});
			if(!spec){
				spec = {
					specName:'该规格已下架'
				}
			}

			commentList.push({
				id:comment.dataValues.id,
				user:user,
				score:comment.dataValues.score,
				comment:comment.dataValues.content,
				time:moment(comment.dataValues.createtime).add('hours',8).format('MM-DD HH:mm'),
				specName:spec.specName
			})
		};
		//算平均分
		let rate = sum/comments.length;
		ctx.body = {
			code:0,
			data:{
				rate:rate,
				commentList:commentList
			}
		}
	}
	catch(e){
		ctx.body={
			code:10000,
			message:'网络出错'
		}
	}
}

//关键词搜索商品
exports.searchGoods = async (ctx)=>{
	const keyword = ctx.query.keyword;
	try{
		let goods;
		goods = await GoodsModel.findAll({
			attributes:['id','name','img','typeId'],
			where:{
				name:{
					'$like':'%'+keyword+'%'
				}
			},
			order: [
	          	['createtime','DESC']
	        ],
		});
		if(goods.length===0){
			ctx.body = {
				code:0,
				data:[]
			};
			return;
		}

		let goodsList = [];

		for(let item of goods){
			const spec = await GoodsDetailModel.findOne({
				attributes:['unitPrice'],
				where:{
					goodsId:item.dataValues.id
				}
			});
			goodsList.push({
				id:item.dataValues.id,
				img:item.dataValues.img,
				name:item.dataValues.name,
				price:spec.unitPrice,
				typeId:item.dataValues.typeId
			})
		};
		ctx.body = {
			code:0,
			data:goodsList
		}
	}
	catch(e){
		ctx.body = {
			code:10000,
			message:'网络错误'
		}
	}
}
