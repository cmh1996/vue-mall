<template>
  <div class="GoodsList">
    <div class="sortBox">
      <span class="title">排序：</span>
      <span :class="['normal',{selected:sortMode===0}]" @click="changeSortMode(0)">默认</span>
      <span :class="['normal',{selected:sortMode!==0}]" @click="changeSortMode(3)">
        价格
        <i :class="['iconfont','icon-arrows-4-7',{'selected':sortMode===1}]" /><i :class="['iconfont','icon-arrows-4-7',{'selected':sortMode===2}]" />
      </span>
    </div>
    <ul class="result">
      <GoodsItem 
        v-for="(item,index) in sortedList" 
        :style="{marginRight: (index+1)%4===0?'0px':'25px'}"
        :key="+item.id"
        :id="item.id"
        :img="item.img"
        :name="item.name"
        :price="item.price"
      />
      <p class="noGoods" v-if="goodsList.length<=0">抱歉，没有找到相关商品~</p>
  </ul>
  </div>
</template>

<script>
import {getGoodsList,searchGoods} from '../../api/client';
import GoodsItem from '../../components/GoodsItem';

export default {
  name: 'GoodsList',
  components:{
    GoodsItem
  },
  computed:{
    isSearchPage(){
      return Number(this.typeId)===0?true:false;
    },
    typeId(){
      return this.$route.params.typeId || 0;
    },
    keyword(){
      return this.$route.params.keyword || '';
    },
    sortedList(){
      let temList = this.goodsList.slice();
      if(this.sortMode===0){
        return temList;
      }else if(this.sortMode===1){
        return temList.sort((a,b)=>{
          return a.price - b.price;
        })
      }else if(this.sortMode===2){
        return temList.sort((a,b)=>{
          return b.price - a.price;
        })
      }
    }
  },
  data () {
    return {
      goodsList:[],
      sortMode:0,//0默认，1价格升序，2价格降序
    }
  },

  methods:{
    getGoodsList(typeId){
      const res = getGoodsList(typeId);
      res.then((data)=>{
        this.goodsList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },
    searchGoods(keyword){
      const res = searchGoods(keyword);
      res.then((data)=>{
        this.goodsList = data;
      })
      .catch((e)=>{
        alert(e);
      })
    },
    changeSortMode(mode){
      if(mode===3){
        this.sortMode = this.sortMode===1?2:1;
      }else{
        this.sortMode = 0;
      }
    }
  },

  mounted(){
    //类别页
    if(!this.isSearchPage){
      this.getGoodsList(this.typeId);
    }
    //搜索结果页
    else{
      this.searchGoods(this.keyword);
    }
    
  },

  watch:{
    $route(to,from){
      this.sortMode = 0;
      if(!this.isSearchPage){
        this.getGoodsList(this.typeId);
      }else{
        this.searchGoods(to.params.keyword);
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.GoodsList{
  .sortBox{
    width: 90%;
    border-top: 1px dotted @borderColor;
    border-bottom: 1px dotted @borderColor;
    margin: 30px auto;
    padding-bottom: 30px;
    padding-top: 30px;
    span{
      font-size: 13px;
    }
    .title{
      color:@fontDefaultColor;
      display: inline-block;
      margin-right: 10px;
    }
    .normal{
      cursor: pointer;
      color:@fontDefaultColor;
      display: inline-block;
      margin-right: 10px;
    }
    .iconfont{
      color:@fontDefaultColor;
      display: inline-block;
      position: relative;
      left: -3px;
      &:last-of-type{
        transform:rotate(180deg);
        left: -6px;
      }
    }
    .selected{
      color:@thirdColor;
    }
  }
  .noGoods{
    margin: 38px auto;
    text-align: center;
    color:@thirdColor;
    font-size: 18px;
  }
}
</style>