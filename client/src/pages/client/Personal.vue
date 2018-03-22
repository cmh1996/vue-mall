<template>
  <div class="Personal">
    <ul class="titleList">
      <li :class="{selected:curPath==='/mall/personal/cart'}" @click="navTo('/mall/personal/cart')">购物车</li>
      <li :class="{selected:curPath==='/mall/personal/myOrder'}" @click="navTo('/mall/personal/myOrder')">我的订单</li>
      <li :class="{selected:curPath==='/mall/personal/myData'}" @click="navTo('/mall/personal/myData')">修改资料</li>
    </ul>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Personal',
  computed:{
    ...mapState([
      'clientToken',
      'clientName'
    ]),
  },
  data () {
    return {
      curPath:this.$route.path
    }
  },

  methods:{
    navTo(route){
      this.$router.push(route)
    },
  },

  mounted(){
  },

  watch:{
    '$route'(to,from){
        this.curPath = to.path;
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Personal{
  padding-top: 20px;
  .titleList{
    width: 180px;
    border:1px solid @borderColor;
    padding: 20px 0;
    display: inline-block;
    overflow: hidden;
    li{
      width: 100%;
      margin: 20px 0;
      padding-left: 30px;
      color:@fontDefaultColor;
      font-size: 15px;
      cursor: pointer;
      border-left: 2px solid transparent;
    }
    .selected{
      border-left: 2px solid @thirdColor;
      color:@thirdColor;
    }
  }
  .content{
    width: 980px;
    margin-left: 30px;
    overflow: hidden;
    display: inline-block;  
    vertical-align: top;
  }
}
</style>