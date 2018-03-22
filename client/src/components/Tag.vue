<template>
  <ul class="Tag">
    <li :class="{selected:curIndex===index}" @click="chooseTag(index)" v-for="(item,index) in tagList" :key="'tag'+index">{{item}}</li>
  </ul>
</template>

<script>
export default {
  name: 'Tag',
  props:{
    tagList:{
      type:Array,
      default:[]
    }
  },
  data(){
    return{
      curIndex:0
    }
  },
  methods:{
    chooseTag(index){
      this.curIndex = index;
      this.$emit('indexChange',index);
    }
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.Tag{

  li{
    display: inline-block;
    text-align: center;
    width: 88px;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    margin-right: 8px;
    cursor: pointer;
  }
  .selected{
    background-color: white;
    border-top: 2px solid @mainColor;
    color:@mainColor;
  }
}
</style>
