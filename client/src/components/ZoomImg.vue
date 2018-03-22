<template>
    <div class="ZoomImg">
      <img :src="imgSrc" alt="" />
      <div class="otherEle"><slot name="otherEle"></slot></div>
    </div>
</template>

<script>
export default {
  name: 'ZoomImg',
  props:{
    imgSrc:{
      type:String,
      default:''
    },
  },
  data(){
    return{
    }
  },
  mounted(){
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.ZoomImg{
  width: 200px;
  height: 200px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
    &:hover{
      img{
        transform:scale(1.05)
      }
    }
  img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition:transform 0.5s;
  }
  .otherEle{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>