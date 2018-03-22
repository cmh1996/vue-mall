<template>
    <div class="FixedNav" :style="{width:width}">
        <slot name="navContent"></slot>
    </div>
</template>

<script>
import {getClientSize} from '../util/util';
export default {
  name: 'FixedNav',
  props:{
  },
  data(){
    return{
      width:''
    }
  },
  mounted(){
    this.width = getClientSize().width+'px';
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.FixedNav{
  position: fixed;
  top: 0;
  left: 0;
  height: 64px;
  background-color: white;
  border-bottom: 1px solid @borderColor;
  animation: slideIn .3s;
  z-index: 10000;
}
@keyframes slideIn{
  from{
    top:-64px;
  }
  to{
    top:0px;
  }
}
</style>