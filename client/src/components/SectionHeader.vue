<template>
    <header class="SectionHeader">
      <div class="left">
        <h3>{{title}}</h3>
        <span>{{tips}}</span>
      </div>
      <span class="right">{{moreText}}</span>
    </header>
</template>

<script>
export default {
  name: 'SectionHeader',
  props:{
    title:{
      type:String,
      default:''
    },
    tips:{
      type:String,
      default:''
    },
    moreText:{
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
.SectionHeader{
  width: 100%;
  height: 66px;
  .left{
    display: inline-block;
    vertical-align: middle;
    height: 40px;
    h3{
      display: inline-block;
      font-size: 28px;
      cursor: pointer;
      &:hover{
        color:@thirdColor;
      }
    }
    span{
      display: inline-block;
      margin-left: 25px;
      font-size: 14px;
      color:#333;
    }
  }
  .right{
    display: inline-block;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    font-size: 14px;
    color:#333;
    float: right;
    &:hover{
      color:@thirdColor;
    }
  }
}
</style>