const AdminModel = require('../models/AdminModel.js');
const UserModel = require('../models/UserModel.js');
const MessageModel = require('../models/MessageModel.js');
const GoodsModel = require('../models/GoodsModel.js');
const GoodsDetailModel = require('../models/GoodsDetailModel.js');
const OrderModel = require('../models/OrderModel.js');
const moment = require('moment');

//获得订单s
exports.getOrders = async (ctx)=>{
	/*-1全部，0未付款，1已付款未发货，2已发货未确认收到，3确认到货订单完成*/
	const state = Number(ctx.query.state);
	try{
		let orders = [];
		if(state===-1){
			orders = await OrderModel.findAll({
				attributes:['id','userId','goodsDetailId','goodsNum','amount','state','createtime'],
				order: [
		          	['updatetime','DESC']
		        ]
			})
		}else{
			orders = await OrderModel.findAll({
				attributes:['id','userId','goodsDetailId','goodsNum','amount','state','updatetime'],
				order: [
		          	['updatetime','DESC']
		        ],
				where:{
					state:state
				}
			})
		};
		if(orders.length===0){
			ctx.body={
				code:0,
				data:[]
			}
			return;
		}
		let orderList = [];
		for(let order of orders){
			let user = await UserModel.findOne({
				attributes:['nickname','recipient','address','phone'],
				where:{
					id:order.dataValues.userId
				}
			});
			if(!user){
				user = {
					nickname:'已注销账户',
					recipient:'已注销账户',
					address:'已注销账户',
					phone:'已注销账户',
				};
			}
			let spec = await GoodsDetailModel.findOne({
				attributes:['goodsId','specName'],
				where:{
					id:order.dataValues.goodsDetailId
				}
			});
			if(!spec){
				spec = {
					goodsId:0,
					specName:'已下架',
				};
			}
			let goods = await GoodsModel.findOne({
				attributes:['name'],
				where:{
					id:spec.goodsId
				}
			});
			if(!goods){
				goods = {
					name:'已下架',
				};
			}
			orderList.push({
				id:order.dataValues.id,
				user:{
					nickname:user.nickname,
					name:user.recipient,
					address:user.address,
					phone:user.phone
				},
				goods:goods.name,
				spec:spec.specName,
				num:order.dataValues.goodsNum,
				amount:order.dataValues.amount,
				state:order.dataValues.state===0?'未付款':order.dataValues.state===1?'未发货':order.dataValues.state===2?'已发货':'已到货',
				time:moment(order.dataValues.updatetime).format('MM-DD HH:mm'),
			})
		}
		ctx.body = {
			code:0,
			data:orderList
		}
	}
	catch(e){
		ctx.body={
			code:10000,
			message:'网络出错'
		}
	}
}


//获得订单
exports.getOrder = async (ctx)=>{
	const id = Number(ctx.query.id);
	try{
		let order = await OrderModel.findOne({
			attributes:['id','goodsDetailId','goodsNum','amount','state'],
			where:{
				id:id
			}
		})
		if(!order){
			ctx.body={
				code:0,
				data:{}
			}
			return;
		}
		const spec = await GoodsDetailModel.findOne({
			attributes:['id','goodsId','specName'],
			where:{
				id:order.goodsDetailId
			}
		});
		const specs = await GoodsDetailModel.findAll({
			attributes:['id','specName','unitPrice'],
			where:{
				goodsId:spec.goodsId
			}
		});
		const goods = await GoodsModel.findOne({
			attributes:['name'],
			where:{
				id:spec.goodsId
			}
		});
		ctx.body = {
			code:0,
			data:{
				id:order.id,
				goods:goods.name,
				amount:order.amount,
				num:order.goodsNum,
				spec:specs,
				states:[
					{id:0,name:'未付款'},
					{id:1,name:'未发货'},
					{id:2,name:'已发货'},
					{id:3,name:'已到货'},
				],
				curSpec:{
					id:spec.id,
					name:spec.specName
				},
				curState:{
					id:order.state,
					name:order.state===0?'未付款':order.state===1?'未发货':order.state===2?'已发货':'已到货',
				}
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

//修改订单
exports.changeOrder = async (ctx)=>{
	const orderObj = ctx.request.body;
	try{
		const order = await OrderModel.findOne({
			attributes:['goodsNum'],
			where:{
				id:orderObj.id
			}
		});
		const difNum = orderObj.num - order.goodsNum;
		const spec = await GoodsDetailModel.findOne({
			attributes:['unitPrice','stockNum'],
			where:{
				id:orderObj.spec,
			}
		});
		await GoodsDetailModel.update(
			{
	          stockNum:spec.stockNum - difNum
	        },
	        {
	          where: {
	            id:orderObj.spec
	          }
	        }
		)
		const res = await OrderModel.update(
	        {
	          goodsNum:orderObj.num,
	          goodsDetailId:orderObj.spec,
	          state:orderObj.state,
	          amount:spec.unitPrice*orderObj.num
	        },
	        {
	          where: {
	            id:orderObj.id
	          }
	        }
	    );
	    ctx.body={
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

//删除订单
exports.deleteOrder = async (ctx)=>{
  const id = ctx.query.id;
  try{
  	const order = await OrderModel.findOne({
  		attributes:['state','goodsNum'],
  		where:{
  			id:id
  		}
  	});
  	//还没结束的订单，那就库存增加
  	if(order.state!==3){
  		const goodsDetail = await GoodsDetailModel.findOne({
  			attributes:['stockNum'],
  			where:{
  				id:id
  			}
  		});
  		await GoodsDetailModel.update(
	        {
	          stockNum:goodsDetail.stockNum+order.goodsNum
	        },
	        {
	          where: {
	            id:id
	          }
	        }
	    );
  	};

    const res = await OrderModel.destroy({
      where:{
        id:id
      }
    });
    ctx.body = {
      code:0
    }
  }
  catch(e){
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}


