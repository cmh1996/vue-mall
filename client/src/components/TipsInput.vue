<template>
  <div class="TipsInput tipsEle">
    <input 
      ref="input"
      type="text" 
      :placeholder="placeholder" 
      v-model="inputText"
      class="tipsEle" 
    />
    <ul class="tipsBox tipsEle" v-show="tipsShow">
      <li 
        v-for="(item,index) in tips" 
        :key="index"
        @click="tipsClickHandle(item)"
        class="tipsEle" 
      >
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TipsInput',
  computed:{
    tipsShow(){
      if(this.inputText.trim().length>0 && this.inputBoxFocus){
        return true;
      }else{
        return false;
      }
    }
  },
  props:{
    placeholder:{
      type:String,
      default:''
    },
    tips:{
      type:Array,
      default:[]
    }
  },
  data(){
    return{
      inputText:'',
      inputBoxFocus:false
    }
  },
  mounted(){
    document.addEventListener('click',this.documentClickHandle,false)
  },
  destroyed(){
    document.removeEventListener('click',this.documentClickHandle,false)
  },
  methods:{
    tipsClickHandle(tip){
      this.$emit('tipsChosen',tip)
    },
    documentClickHandle(e){
      if(e.target.className.includes('tipsEle')){
        this.inputBoxFocus = true;
      }else{
        this.inputBoxFocus = false;
      }
    }
  },
  watch:{
    inputText(newVal,oldVal){
      this.$emit('input',newVal);
    }
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.TipsInput{
  position: relative;
  width:254px;
  display: inline-block;
  input{
    border:none;
    border-bottom: 1px solid @thirdColor;
    padding-left: 4px;
    width:100%;
    height:24px;
  }
  .tipsBox{
    position: absolute;
    top: 24px;
    left: 0;
    width:100%;
    border:1px solid @borderColor;
    border-top:none;
    li{
      text-align: left;
      width:100%;
      height:25px;
      line-height: 25px;
      padding:0 6px;
      font-size:14px;
      cursor: pointer;
      background-color: white;
      &:hover{
        background-color:#f8f5f0;
        color:@thirdColor;
      }
    }
  }
}
</style>