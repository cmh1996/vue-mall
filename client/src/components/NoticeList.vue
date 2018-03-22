<template>
    <div class="NoticeListBox">
        <ul class="noticeList" :style="{top:top+'px',transition:`top ${animateTime}s`}">
          <li v-for="(item,index) in notices" :key="index" >
            <a href="#">{{item}}</a>
          </li>
          <li>
            <a href="#">{{notices[0]}}</a>
          </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'NoticeList',
  props:{
    notices:{
      type:Array,
      default:[]
    }
  },
  data(){
    return{
      top:0,
      height:40,
      animateTime:1
    }
  },
  mounted(){
    setInterval(this.topAnimate,3000);
  },
  destroyed(){
    clearInterval(this.topAnimate);
  },
  methods:{
    topAnimate(){
      if(this.top<=(-this.notices.length*this.height)){
        this.top = 0;
        this.animateTime = 0;
        return;
      }
      this.animateTime = 1;
      this.top-=this.height;
    }
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.NoticeListBox{
  height: 40px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  width: 240px;
  .noticeList{
    width: 100%;
    position: absolute;
    left: 0;
    li{
      width: 100%;
      height: 40px;
      line-height: 36px;
      a{
        color:@thirdColor;
        text-decoration: underline;
        font-size: 12px;
        &:hover{
          color:white;
          text-decoration: none;
        }
      }
    }
  }
}
</style>