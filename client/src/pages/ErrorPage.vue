<template>
  <div class="ErrorPage" :style="{width:width+'px',height:height+'px'}">
    <h3>404</h3>
    <p>抱歉，您访问的页面跑丢了~</p>
  </div>
</template>

<script>
import {getClientSize} from '../util/util';
export default {
  name: 'ErrorPage',
  computed:{
    width(){
      return getClientSize().width;
    },
    height(){
      return getClientSize().height;
    },
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.ErrorPage{
  text-align: center;
  background-color: @mainColor;
  color:white;
  padding-top: 200px;
  h3{
    font-size: 100px;
  }
  p{
    font-size: 30px;
  }
}
</style>