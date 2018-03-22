<template>
  <div class="PopupWrapper" :style="{width:windowWidth+'px',height:windowHeight+'px',lineHeight:windowHeight+'px'}" @click.stop="closePopup">
    <div class="Popup" @click.stop="()=>{}">
      <div class="popupHeader">
        <span>{{title}}</span>
        <span class="closeBtn" @click="closePopup"><i class="iconfont icon-close" /></span>
      </div>
      <div class="popupBody">
        <slot name="popupContent"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import {getClientSize} from '../util/util';
export default {
  name: 'Popup',
  props:{
    title:{
      type:String,
      default:'提示信息'
    },
  },
  data(){
    return{
      show:false,
      windowWidth:getClientSize().width,
      windowHeight:getClientSize().height,
    }
  },
  methods:{
    closePopup(){
      this.$emit('popupClose');
    }
  },
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.PopupWrapper{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0,0,0,0.5);
  text-align: center;
  .Popup{
    display: inline-block;
    box-shadow: 0 0 10px @fontDeepColor;
    .popupHeader{
      height: 40px;
      line-height: 40px;
      background-color:#333333;
      text-align: center;
      position: relative;
      span{
        color:@fontShallowColor;
      }
      .closeBtn{
        position: absolute;
        right: 5px;
        cursor: pointer;
        i{
          color:@fontShallowColor;
        }
      }
    }
    .popupBody{
      background-color: white;
    }
  }
}
</style>