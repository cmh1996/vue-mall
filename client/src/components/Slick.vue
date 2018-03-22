<template>
    <div class="Slick" :style="{width:(showWidth+btnWidth*2+20)+'px',height:height+'px'}">
      <div class="prev" @click="prev" :style="{width:btnWidth+'px',height:btnWidth+'px',lineHeight:btnWidth+'px',opacity:curPage<=1?0.3:1}"><i class="iconfont icon-return" /></div><div class="listWrapper" :style="{width:showWidth+'px',height:height+'px'}">
        <div class="animateList" :style="{width:ulWidth+'px',transform:`translate3d(${translateX}px,0,0)`}" >
          <slot name="list"></slot>
        </div>
      </div><div class="next" @click="next" :style="{width:btnWidth+'px',height:btnWidth+'px',lineHeight:btnWidth+'px',opacity:curPage>=pageNum?0.3:1}"><i class="iconfont icon-enter" /></div>
    </div>
</template>

<script>
export default {
  name: 'Slick',
  props:{
    ulWidth:{
      type:Number,
      default:0
    },
    showWidth:{
      type:Number,
      default:0
    },
    height:{
      type:Number,
      default:0
    }
  },
  computed:{
    pageNum(){
      return Math.ceil(this.ulWidth/this.showWidth);
    },
    translateX(){
      return -(this.curPage-1)*this.showWidth;
    }
  },
  data(){
    return{
      btnWidth:40,
      curPage:1,
    }
  },
  methods:{
    prev(){
      if(this.curPage<=1){
        return;
      }
      this.curPage-=1;
    },
    next(){
      if(this.curPage>=this.pageNum){
        return;
      }
      this.curPage+=1;
    }
  },
  mounted(){

  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.Slick{
  .prev,.next{
    display: inline-block;
    vertical-align: middle;
    background-color: @thirdColor;
    border-radius: 50%;
    text-align: center;
    position: relative;
    top: -30px;
    cursor: pointer;
    i{
      color:white;
      font-size: 20px;
    }
  }
  .prev{
    margin-right: 10px;
  }
  .next{
    margin-left: 10px;
  }
  .listWrapper{
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    .animateList{
      transition:all 0.5s;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>