<template>
  <div class="MallIndex">
    <FadeSwiper class="swiperBox" :width="clientWidth" height="420px">
      <img class="banner" slot="item1" src="../../assets/img/banner1.jpg" />
      <img class="banner" slot="item2" src="../../assets/img/banner2.jpg" />
      <img class="banner" slot="item3" src="../../assets/img/banner3.jpg" />
    </FadeSwiper>
    <section class="newGoods section">
      <SectionHeader title="新品首发" tips="周一周四上新，为你寻觅世间好物" moreText="更多新品>"/>
      <Slick
        :ulWidth="(266*goodsList.length)+(10*(goodsList.length-1))" 
        :showWidth="(266*4)+(10*3)"
        :height="360"
      >
        <ul class="goodsList" :style="{width:`${(266*goodsList.length)+(10*(goodsList.length-1))}px`}" slot="list">
          <GoodsItem 
            v-for="(item,index) in goodsList" 
            :style="{marginRight: (index+1)%4===0?'0px':'10px'}"
            :key="+item.id"
            :id="item.id"
            :img="item.img"
            :name="item.name"
            :price="item.price"
          />
        </ul>
      </Slick>
    </section>
    <section class="flashSale section">
      <SectionHeader title="限时购" tips="抢抢抢，好货不等人" moreText="更多抢购>"/>
      <div class="content">
        <div class="left">
          <p class="title">特价场</p>
          <hr/>
          <p class="tips">距离结束还剩</p>
          <div class="countBox">
            <span class="time">{{h}}</span>
            <span>:</span>
            <span class="time">{{m}}</span>
            <span>:</span>
            <span class="time">{{s}}</span>
          </div>
          <div class="allBtn">查看全部 ></div>
        </div><ul class="right"><li v-for="(item,index) in goodsList.slice(0,4)" :key="item.id">
            <img class="leftImg" :src="item.img" />
            <div class="rightBox">
              <p class="goodsName ellipsis" @click="navTo('/mall/goods/'+item.id)">{{item.name}}</p>
              <div class="less">
                <span class="lessBar"></span>
                <span class="lessNum">还剩86件</span>
              </div>
              <div class="price">
                <span class="nowPrice">限时价¥{{item.price}}</span>
                <span class="beforePrice">原价¥{{item.price+60}}</span>
              </div>
              <div class="buyBtn" @click="navTo('/mall/goods/'+item.id)">立即抢购</div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="hotGoods section">
      <SectionHeader title="人气推荐" tips="最火最潮商品，为您挑选" moreText="更多推荐>"/>
      <div class="content">
        <ul class="left">
          <GoodsItem 
            :id="goodsList[0].id"
            :img="goodsList[0].img"
            :name="goodsList[0].name"
            :price="goodsList[0].price"
          />
        </ul>
        <ul class="right">
           <GoodsItem 
            v-for="(item,index) in goodsList.slice(3,9)" 
            :style="{marginBottom: index<=2?'10px':'0px'}"
            :key="+item.id"
            :id="item.id"
            :img="item.img"
            :name="item.name"
            :price="item.price"
          />
        </ul>
      </div>
    </section>
    <section class="maker section">
      <SectionHeader title="品牌制造商" tips="工厂直达消费者，剔除品牌溢价" moreText="更多制造商>"/>
      <div class="content">
        <ZoomImg imgSrc="http://yanxuan.nosdn.127.net/0266209ded1751f599fe0dc21bb33e02.jpg" class="left">
          <div class="makerInfo" slot="otherEle">
            <p class="large">Adidas制造商</p>
            <hr/>
            <p class="small">35元起</p>
          </div>
        </ZoomImg>
        <ZoomImg imgSrc="http://yanxuan.nosdn.127.net/7cd0c8ed77da498090fb67c288ef05be.jpg" class="center">
          <div class="makerInfo" slot="otherEle">
            <p class="large">UGG制造商</p>
            <hr/>
            <p class="small">129元起</p>
          </div>
        </ZoomImg>
        <div class="right">
          <ZoomImg imgSrc="http://yanxuan.nosdn.127.net/d824afe357e61fbee097412c5894c6ce.jpg">
            <div class="makerInfo" slot="otherEle">
              <p class="large">新秀丽制造商</p>
              <hr/>
              <p class="small">49元起</p>
            </div>
          </ZoomImg>
          <ZoomImg imgSrc="http://yanxuan.nosdn.127.net/cf5f4a0d110ca17b9e0a80e6f7e6184b.jpg">
            <div class="makerInfo" slot="otherEle">
              <p class="large">MUJI制造商</p>
              <hr/>
              <p class="small">12.9元起</p>
            </div>
          </ZoomImg>
        </div>
      </div>
    </section>
    <section class="typeSection section" v-for="(item,index) in typeList.slice(1)" :key="item.id">
      <SectionHeader :title="item.name" tips="" moreText="查看更多>" @click.native="selectType(item.id)"/>
      <ul class="content">
          <GoodsItem 
            v-for="(item,index) in filterGoodsByType(item.id).slice(0,4)" 
            :style="{marginRight: (index+1)%4===0?'0px':'25px'}"
            :key="+item.id"
            :id="item.id"
            :img="item.img"
            :name="item.name"
            :price="item.price"
          />
      </ul>
    </section>
  </div>
</template>

<script>
import {getTypes,getGoodsList} from '../../api/client';
import SectionHeader from '../../components/SectionHeader';
import ZoomImg from '../../components/ZoomImg';
import GoodsItem from '../../components/GoodsItem';
import Slick from '../../components/Slick';
import FadeSwiper from '../../components/FadeSwiper';

import {getClientSize,getScrollWidth} from '../../util/util';

export default {
  name: 'MallIndex',
  components:{
    SectionHeader,
    ZoomImg,
    GoodsItem,
    Slick,
    FadeSwiper
  },
  computed:{
    clientWidth(){
      return getClientSize().width-getScrollWidth()+'px';
    }
  },
  data () {
    return {
      typeList:[],
      goodsList:[],
      initTimestamp:0,
      newTimestamp:0,
      timer:null,
      h:0,
      m:0,
      s:0,
    }
  },

  methods:{
    filterGoodsByType(typeid){
      return this.goodsList.filter((item)=>{
        return item.typeId===typeid;
      });
    },
    navTo(route){
      this.$router.push(route);
    },
    selectType(typeId){
      if(typeId==-1){
        return;
      }
      this.navTo('/mall/show/goodsList/'+typeId+'/all');
    },
    getGoodsList(typeId){
      const res = getGoodsList(typeId);
      res.then((data)=>{
        this.goodsList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },
    searchTip(tip){
      alert(tip)
    },
    inputTextChange(text){
    },
    scrollHandle(){
      const top = this.$refs.typeList.getBoundingClientRect().top;
      //还未到顶
      if(top>0){
        this.navShouldFixed=false;
      }
      //已经到顶
      else{
        this.navShouldFixed=true;
      }
    }
  },

  mounted(){
    //获取数据
    const res = getTypes();
    res
    .then((data)=>{
      data.unshift({
        id:-1,
        name:'首页'
      });
      this.typeList = data;
      this.getGoodsList(-1);
    })
    .catch((e)=>{
      alert(e);
    });

    //记录打开网页再加四小时的时间
    this.initTimestamp = new Date().getTime()+(4*60*60*1000);
    this.timer = setInterval(()=>{
      this.newTimestamp = new Date().getTime();
      let diff = parseInt((this.initTimestamp-this.newTimestamp)/1000);
      diff = diff%(86400*365)%(86400*30)%86400;
      this.h = new String(Math.floor(diff/3600)).padStart(2,'0');
      diff = diff%3600;
      this.m = new String(Math.floor(diff/60)).padStart(2,'0');
      diff = diff%60;
      this.s = new String(diff).padStart(2,'0');
    },1000);
  },

  beforeDestroy(){
    clearInterval(this.timer);
    this.timer = null;
  },

}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.MallIndex{
  width: 100%;
  .swiperBox{
    position: absolute;
    left: 0;
    top: 230px;
    margin-top: 20px;
    display: block;
    box-shadow: 0 -1px 2px rgba(0,0,0,0.2);
    overflow: hidden;
    .banner{
      transform: scale(1.2,1);
    }
  }
  .section{
    padding:30px;
    overflow: hidden;
    .Slick{
      position: relative;
      left: -30px;
    }
  }
  .newGoods{
    margin-top: 440px;
  }
  .flashSale{
    .content{
      border: 1px solid @borderColor;
      height: 376px;
      position: relative;
      .left{
        vertical-align: top;
        display: inline-block;
        width: 20%;
        height: 100%;
        position: relative;
        background-image: url(//yanxuan.nosdn.127.net/c9aeb62a3f79123d793d8c49b6698b09.jpg);
        background-repeat: no-repeat;
        background-size: 100%;
        text-align: center;
        color: #615548;
        cursor: pointer;
        .title{
          font-size: 26px;
          font-weight: 500;
          margin-top: 60px;
        }
        hr{
          width: 20px;
          height: 2px;
          background-color: #615548;
          border: none;
          margin-top: 20px;
        }
        .tips{
          font-size: 18px;
          margin-top: 20px;
        }
        .countBox{
          margin-top: 20px;
          .time{
            width: 42px;
            height: 42px;
            line-height: 42px;
            font-size: 19px;
            display: inline-block;
            color: white;
            background-color: #615548;
          }
        }
        .allBtn{
          width:110px;
          height: 33px;
          line-height: 33px;
          font-size: 13px;
          background-color: #a7936e;
          color:white;
          border-radius: 20px;
          margin:50px auto;
        }
      }
      .right{
        vertical-align: top;
        display: inline-block;
        width: 80%;
        height: 100%;
        position: relative;
        overflow: hidden;
        li{
          display: inline-block;
          width: 50%;
          height: 50%;
          overflow: hidden;
          .leftImg{
            width: 180px;
            height: 100%;
            display: inline-block;
          }
          .rightBox{
            display: inline-block;
            width: 240px;
            height: 100%;
            overflow: hidden;
            .goodsName{
              font-size: 15px;
              cursor: pointer;
              margin-top: 16px;
              &:hover{
                color:@thirdColor;
              }
            }
            .less{
              margin-top: 16px;
              .lessBar{
                display: inline-block;
                width: 150px;
                height: 10px;
                background-color: #ffe5e5;
                border:1px solid #f2cecd;
                border-radius: 10px;
              }
              .lessNum{
                color:@fontDefaultColor;
                font-size: 13px;
              }
            }
            .price{
              margin-top: 16px;
              .nowPrice{
                color: @falseColor;
                font-size: 20px;
              }
              .beforePrice{
                color:@fontDefaultColor;
                text-decoration:line-through;
                margin-left: 10px;
                font-size: 14px;
              }
            }
            .buyBtn{
              margin-top: 16px;
              width: 120px;
              height: 30px;
              color:white;
              background-color: @falseColor;
              text-align: center;
              line-height: 30px;
              cursor: pointer;
            }
          }
          &:nth-of-type(1){
            border-bottom: 1px solid @borderColor;
            border-right: 1px solid @borderColor;
          }
          &:nth-of-type(2){
            border-bottom: 1px solid @borderColor;
          }
          &:nth-of-type(3){
            border-right: 1px solid @borderColor;
          }
        }
      }
    }
  }
  .maker{
    .content{
      .left,.center,.right{
        display: inline-block;
        height: 320px;
        width: 32%;
      }
      .left,.center{
        margin-right: 7px;
        .makerInfo{
          p{
            text-align: center;
          }
          hr{
            width: 60px;
          }
          .large{
            margin-top: 50px;
            margin-bottom: 10px;
            font-size: 26px;
          }
          .small{
            margin-top: 10px;
            font-size: 14px;
          }
        }
      }
      .right{
        .ZoomImg{
          width: 100%;
          height: 49%;
          .makerInfo{
            p{
              text-align: left;
              margin-left: 30px;
            }
            hr{
              width: 60px;
              position: relative;
              left: -122px;
            }
            .large{
              margin-top: 30px;
              margin-bottom: 10px;
              font-size: 20px;
            }
            .small{
              margin-top: 10px;
              font-size: 12px;
            }
          }
          &:first-child{
            margin-bottom:7px;
          }
        }
      }
    }
  }
  .hotGoods{
    background-color: rgb(244,240,234);
    height: 654px;
    .left{
      width: 394px;
      display: inline-block;
      vertical-align: top;
      .GoodsItem{
        width: 100%;
        height: 532px;
        background-color: white;
      }
      .GoodsItem /deep/ .imgBox{
        height: 380px;
      }
      .GoodsItem /deep/ .goodsInfo{
        height: auto;
      }
      .GoodsItem /deep/ .goodsName{
        font-size: 30px;
        line-height: 60px;
      }
    }
    .right{
      display: inline-block;
      vertical-align: top;
      width: 740px;
      height: 100%;
      .GoodsItem{
        width: 230px;
        height: 260px;
        background-color: white;
        margin-left: 10px;
        overflow: hidden;
      }
      .GoodsItem /deep/ .imgBox{
        height: 180px;
      }
    }
  }
}
</style>