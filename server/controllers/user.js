const UserModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const moment = require('moment');

//注册
exports.signup = async (ctx)=>{
  const hashPwd = bcrypt.hashSync(ctx.request.body.pwd, salt);
	const user = {
  		email:ctx.request.body.email,
  		pwd:hashPwd,
  		nickname:ctx.request.body.nickname,
      recipient:ctx.request.body.recipient,
      address:ctx.request.body.address,
      phone:ctx.request.body.phone,
  		createtime:new Date(),
      updatetime:new Date()
  	};

  	//验证邮箱唯一性
  	const emailUniq = await UserModel.findOne({
	    where: {
	      email: ctx.request.body.email
	    }
	})
	//如果已经存在
  	if(emailUniq){
  		ctx.body = {
  			code:10000,
  			message:'该邮箱已被注册'
  		};
  		return;
  	}

  	//验证昵称唯一性
  	const nicknameUniq = await UserModel.findOne({
	    where: {
	      nickname: ctx.request.body.nickname
	    }
	})
	//如果已经存在
  	if(nicknameUniq){
  		ctx.body = {
  			code:10000,
  			message:'该昵称已被注册'
  		}
  		return;
  	}

  	//插入数据
  	const res = await UserModel.create(user);
  	const token = jwt.sign(res.id,'chambers');
  	ctx.body = {
  		code:0,
  		data:{
        name:res.nickname,
        token:token
      }
  	}
}

//登录
exports.login = async (ctx)=>{
    const user = ctx.request.body;
    //看该邮箱是否已经注册
    const emailSigned = await UserModel.findOne({
        where: {
          email: user.account
        }
    })

    //如果不存在
    if(!emailSigned){
      ctx.body = {
        code:10000,
        message:'该邮箱还没注册，请前往注册'
      };
      return;
    }
    //已经存在
    else{
        //密码不对
        if(!bcrypt.compareSync(user.pwd, emailSigned.pwd)){
          ctx.body = {
            code:10000,
            message:'密码不正确'
          };
          return;
        }
        //密码正确
        else{
          const token = jwt.sign(emailSigned.id,'chambers');
          ctx.body = {
            code:0,
            data:{
              name:emailSigned.nickname,
              token:token
            },
          }
        }
    }
}

//获取user基本资料
exports.getData = async (ctx)=>{
  const id = jwt.verify(ctx.query.token,'chambers');
  try{
    const user = await UserModel.findOne({
        attributes:['id','email','nickname','recipient','address','phone','headimg'],
        where: {
          id: id
        }
    })
    if(!user){
        ctx.body = {
          code:10000,
          message:'该用户不存在'
        };
        return;
    }
    ctx.body = {
      code:0,
      data:{
        id:user.id,
        headimg:user.headimg,
        email:user.email,
        nickname:user.nickname,
        recipient:user.recipient,
        address:user.address,
        phone:user.phone,
      }
    }
  }catch(e){
    ctx.body = {
      code:10000,
      message:'网络错误'
    }
  }
}

//更改用户资料
exports.updateUserData = async (ctx)=>{
  const data = ctx.request.body;
  
  try{
    const res = await UserModel.update(
      {
        recipient:data.recipient,
        address:data.address,
        phone:data.phone,
        nickname:data.nickname
      },
      {
        where: {
          id:data.id
        }
      }
    )
    //正常修改
    ctx.body = {
      code:0,
      nickname:data.nickname
    }
  }catch(e){
    //发生错误
    ctx.body = {
      code:10000,
      message:'网络出错'
    }
  }
}


//修改密码
exports.updatePwd = async (ctx)=>{
  const data = ctx.request.body;
  
  const account = await UserModel.findOne({
      where: {
        id: data.id
      }
  })

  if(!bcrypt.compareSync(data.oldPwd, account.pwd)){
    ctx.body = {
      code:10000,
      message:'密码不正确'
    };
    return;
  }
  //密码正确
  else{
    try{
      const hashPwd = bcrypt.hashSync(data.newPwd, salt);
      const res = await UserModel.update(
        {
          pwd:hashPwd
        },
        {
          where: {
            id:data.id
          }
        }
      )
      //正常修改
      ctx.body = {
        code:0
      }
    }catch(e){
      //发生错误
      ctx.body = {
        code:10000,
        message:'修改密码出错'
      }
    }
  }
}
