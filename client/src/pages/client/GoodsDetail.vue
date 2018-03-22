<template>
  <div class="GoodsDetail">
    <div class="content">
      <div class="goodsInfo">
        <img class="infoLeft" :src="goodsImg" alt="商品图片" />
        <div class="infoRight">
          <div class="infoBox">
            <h3 class="name">{{goodsName}}</h3>
          </div>
          <div class="infoBox">
            <p>{{goodsDesc}}</p>
          </div>
          <div class="infoBox">
            <h3 class="price">{{'¥'+goodsPrice}}</h3>
          </div>
          <div class="infoBox">
            <span>规格：</span>
            <Radio v-for="(item,index) in specs" :key="item.id" v-model="temSpecId" :initVal="specs[0].id" radioName="spec" :radioVal="item.id">
              <span class="tips" slot="tips">{{item.specName+' 还剩'+item.stockNum+'件'}}</span>
            </Radio>
          </div>
          <div class="infoBox">
            <span>数量：</span>
            <NumberInput v-model="num" :min="1" :max="temStockNum"/>
          </div>
          <button class="buyBtn" @click="buy">立即购买</button>
          <button @click="addToCart">加入购物车</button>
        </div>
      </div>
      <section class="msgBox leftContainer">
        <ul class="tagList">
          <li :class="{selected:curIndex===index}" v-for="(item,index) in tagList" :key="'tag'+index" @click="changeIndex(index)">
            {{item}}
          </li>
        </ul>
        <div class="commentBody" v-if="curIndex===0">
          <div v-if="commentList.length>0">
            <div class="rateBox">
              <span>好评率</span>
              <span class="rate">{{rate+'%'}}</span>
            </div>
            <ul class="commentList">
              <li v-for="(item,index) in commentList" :key="'comment'+index">
                <div class="userInfo">
                  <img :src="item.user.headimg" />
                  <span>{{item.user.nickname}}</span>
                </div>
                <div class="commentInfo">
                  <div class="starList">
                    <i
                      class="iconfont icon-collection_fill" 
                      v-for="(star,index) in (item.score/20)" 
                      :key="item.id+''+index" 
                    />
                  </div>
                  <p class="specName">{{item.specName}}</p>
                  <p class="comment">{{item.comment}}</p>
                  <p class="time">{{item.time}}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="noComment" v-else>暂时还没有评论~</div>
        </div>
        <div class="msgBody" v-else>
          <div class="inputBox">
            <textarea placeholder="请输入提问内容" v-model="askContent" cols="30" rows="10"></textarea>
            <button v-if="clientToken" @click="postAsk" :class="{ban:askContent.trim().length<=0}">提问</button>
            <div v-else class="banAsk">请先登录</div>
          </div>
          <ul class="msgList">
            <li v-for="(item,index) in msgList" :key="'msg'+item.id">
              <div class="ask">
                <span class="note">问</span>
                <span class="text">{{item.content}}</span>
                <span class="tipsInfo">{{item.asker+' '+item.time}}</span>
              </div>
              <div class="answer">
                <span class="note">答</span>
                <span class="text">{{Object.keys(item.reply).length>0?item.reply.content:'暂时没有回答'}}</span>
                <span class="tipsInfo">{{Object.keys(item.reply).length>0?item.reply.time:''}}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section class="typeGoods rightContainer">
        <div class="title">相似商品</div>
        <ul class="list">
          <GoodsItem 
            v-for="(item,index) in filterList" 
            :key="+item.id"
            :id="item.id"
            :img="item.img"
            :name="item.name"
            :price="item.price"
          />
      </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {getGoodsInfo,getGoodsMsg,askGoodsMsg,addOrder,getComment,getGoodsList} from '../../api/client';
import NumberInput from '../../components/NumberInput';
import Radio from '../../components/Radio';
import GoodsItem from '../../components/GoodsItem';

export default {
  name: 'GoodsDetail',
  components:{
    NumberInput,
    Radio,
    GoodsItem
  },
  computed:{
    ...mapState([
      'clientToken',
      'clientName'
    ]),
    id(){
      return this.$route.params.id;
    },
    goodsPrice(){
      let unitPrice = 0; 
      this.specs.map((item,index)=>{
        if(item.id===this.temSpecId){
          unitPrice = Number(item.unitPrice);
        }
      })
      return (this.num*unitPrice);
    },
    temStockNum(){
      let stockNum = 0; 
      this.specs.map((item,index)=>{
        if(item.id===this.temSpecId){
          stockNum = Number(item.stockNum);
        }
      })
      return stockNum;
    },
    filterList(){
      return this.goodsList.filter((item)=>{
        return String(item.id)!==String(this.id);
      })
    }
  },
  data () {
    return {
      goodsImg:'',
      goodsName:'',
      goodsDesc:'',
      specs:[],
      typeId:'',
      temSpecId:0,
      num:1,
      msgList:[],
      askContent:'',
      tagList:['评价','商品问答'],
      curIndex:0,
      rate:'',
      commentList:[],
      goodsList:[]
    }
  },

  methods:{
    changeIndex(i){
      this.curIndex = i;
    },

    getGoodsInfo(id){
      const res = getGoodsInfo(id);
      res
      .then((data)=>{
        this.goodsImg = data.img;
        this.goodsName = data.name;
        this.goodsDesc = data.desc;
        this.specs = data.specs;
        this.typeId = data.typeId;
        this.temSpecId = data.specs[0].id;
        this.getTypeGoodsList(data.typeId);
      })
      .catch((e)=>{
        alert(e);
      })
    },

    getGoodsMsg(id){
      const res = getGoodsMsg(id);
      res
      .then((data)=>{
        this.msgList=data
      })
      .catch((e)=>{
        alert(e);
      })
    },

    postAsk(){
      if(this.askContent.trim().length<=0){
        return;
      }
      const res = askGoodsMsg({
        token:this.clientToken,
        msg:this.askContent,
        goodsId:this.id,
      });
      res
      .then(()=>{
        let time = new Date();
        this.msgList.unshift({
          id:'new',
          content:this.askContent,
          state:0,
          asker:this.clientName,
          time:time.getMonth()+1+'-'+time.getDate(),
          reply:{}
        });
        this.askContent = '';
      })
      .catch((e)=>{
        alert(e);
      })
    },

    addToCart(){
      if(!this.clientToken){
        alert('请先登录！');
        return;
      }
      const res = addOrder({
        token:this.clientToken,
        goodsDetailId:this.temSpecId,
        state:0,
        num:this.num,
        amount:this.goodsPrice
      });
      res
      .then(()=>{
        alert('加入购物车成功！请前往 个人中心->购物车 结算')
      })
      .catch((e)=>{
        alert(e);
      })
    },

    buy(){
      if(!this.clientToken){
        alert('请先登录！');
        return;
      }
      const res = addOrder({
        token:this.clientToken,
        goodsDetailId:this.temSpecId,
        num:this.num,
        state:1,
        amount:this.goodsPrice
      });
      res
      .then(()=>{
        alert('自动付款成功！请耐心等待包裹派送~')
      })
      .catch((e)=>{
        alert(e);
      })
    },

    getComment(goodsId){
      const res = getComment(goodsId);
      res
      .then((data)=>{
        if(Object.keys(data).length<=0){
          this.rate = '';
          this.commentList = [];
          return;
        }
        this.rate = data.rate;
        this.commentList = data.commentList;
      })
      .catch((e)=>{
        alert(e);
      })
    },

    getTypeGoodsList(typeId){
      const res = getGoodsList(typeId);
      res.then((data)=>{
        this.goodsList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },

  },
  mounted(){
    this.getGoodsInfo(this.id);
    this.getGoodsMsg(this.id);
    this.getComment(this.id);
  },

  watch:{
    $route(to,from){
      this.getGoodsInfo(to.params.id);
      this.getGoodsMsg(to.params.id);
      this.getComment(to.params.id);
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.GoodsDetail{
  .content{
    width: 100%;
    padding-top: 20px;
    .goodsInfo{
      width: 100%;
      overflow: hidden;
      .infoLeft{
        display: inline-block;
        width: 400px;
        height: 400px;
        float: left;
      }
      .infoRight{
        display: inline-block;
        float: right;
        width: 700px;
        .infoBox{
          margin-bottom: 30px;
          .name{
            font-size: 20px;
          }
          p{
            color:@fontDefaultColor;
            font-size: 15px;
          }
          .price{
            font-size: 35px;
            color:@falseColor;
          }
          span{
            color:@fontDefaultColor;
            font-size: 13px;
            display: inline-block;
            width: 50px;
          }
          .tips{
            width: auto;
            margin: 0 20px 0 5px;
          }
          .NumberInput{
            display: inline-block;
            vertical-align: middle;
          }
        }
        button{
          background-color: #b4a078;
          width: 170px;
          height: 50px;
          color:white;
          border: none;
          font-size: 19px;
          margin-right: 20px;
          margin-top: 10px;
          &:hover{
            opacity:0.8;
          }
        }
        .buyBtn{
          border: 1px solid #b4a078;
          color:#b4a078;
          background-color: #f5f3ef;
        }
      }
    }
    .msgBox{
      margin: 50px 0;
      border: 1px solid @borderColor;
      padding-top: 0;
      .tagList{
        width: 100%;
        height: 40px;
        border-bottom: 1px solid @borderColor;
        background-color: #f5f5f5;
        li{
          width: 170px;
          height: 42px;
          position: relative;
          top: -2px;
          display: inline-block;
          text-align: center;
          line-height: 40px;
          font-size: 13px;
          cursor: pointer;
          &:hover{
            color:@thirdColor;
          }
        }
        .selected{
          background-color: white;
          border-top: 4px solid @thirdColor;
        }
      }
      .commentBody{
        padding: 20px;
        min-height: 300px;
        .rateBox{
          margin-bottom: 10px;
          span{
            color:@fontDefaultColor;
            display: inline-block;
            margin-right: 10px;
          }
          .rate{
            color:@falseColor;
            font-weight: 600;
            font-size: 30px;
          }
        }
        .commentList{
          width: 100%;
          li{
            width: 100%;
            display: block;
            margin: 0 auto;
            border-bottom:1px solid @borderColor;
            padding: 20px 0;
            .userInfo{
              width: 80px;
              display: inline-block;
              text-align: center;
              img{
                margin: auto;
                display: block;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-bottom: 6px;
              }
              span{
                font-size: 13px;
                color:@fontDefaultColor;
              }
            }
            .commentInfo{
              display: inline-block;
              vertical-align: top;
              .starList{
                i{
                  color:#f9bd4f;
                }
              }
              .specName,.time{
                color:@fontDefaultColor;
                font-size: 13px;
                margin-top: 10px;
              }
              .comment{
                margin-top: 10px;
              }
            }
          }
        }
        .noComment{
          width: 100%;
          text-align: center;
          color:@thirdColor;
          padding-top: 30px;
        }
      }
      .msgBody{
        padding: 20px;
        min-height: 300px;
        .inputBox{
          margin-top: 20px;
          textarea{
            width: 88%;
            height: 50px;
            padding: 5px;
            border:2px solid @borderColor;
            display: inline-block;
            overflow: hidden;
          }
          button,.banAsk{
            float: right;
            width: 10%;
            height: 50px;
            position: relative;
            display: inline-block;
            overflow: hidden;
            background-color: white;
            border: 2px solid @fontShallowColor;
            color:@fontDefaultColor;
          }
          .banAsk{
            background-color: @fontShallowColor;
            text-align: center;
            font-size: 12px;
            line-height: 50px;
            color:white;
            user-select:none;
          }
        }
        .msgList{
          margin-top: 20px;
          li{
            border-bottom: 1px solid @borderColor;
            padding: 10px 0;
            .ask,.answer{
              margin: 8px 0;
              width: 100%;
              .note{
                display: inline-block;
                color:white;
                text-align: center;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                font-size: 10px;
                line-height: 20px;
              }
              .text{
                font-size: 14px;
              }
              .tipsInfo{
                float: right;
                font-size: 14px;
                color:@fontDefaultColor;
              }
            }
            .ask{
              .note{
                background-color: @falseColor;
              }
            }
            .answer{
              .note{
                background-color: @mainColor;
              }
            }
          }
        }
      }
    }
    .typeGoods{
      margin: 50px 0;
      border: 1px solid @borderColor;
      padding-top: 0;
      .title{
        text-align: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #f5f5f5;
        font-weight: 600;
        border-bottom: 1px solid @borderColor;
      }
      .list{
        .GoodsItem{
          display:block;
          border-bottom:1px dotted @borderColor;
          margin: 0 auto;
        }
      }
    }
  }
  .ban{
    user-select: none;
    cursor:not-allowed;
  }
}
</style>