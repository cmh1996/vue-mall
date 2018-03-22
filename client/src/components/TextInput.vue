<template>
    <input :type="type" class="TextInput" v-model.trim="text" :placeholder="placeholder"/>
</template>

<script>
export default {
  name: 'TextInput',
  props:{
    placeholder:{
      type:String,
      default:''
    },
    initText:{
      type:String,
      default:''
    },
    type:{
      type:String,
      default:'text'
    }
  },
  data(){
    return{
      text:this.initText || '',
    }
  },
  methods:{
  },
  watch:{
    text(newVal,oldVal){
      this.$emit('input',newVal);
    },
    initText(newVal){
      this.text = newVal;
    }
  }
}
</script>

<style scoped lang="less">
@import "../assets/css/var.less";
.TextInput{
  border: 1px solid @borderColor;
  padding: 6px 10px;
  border-radius: 5px;
  display: inline-block;
  vertical-align: middle;
}
</style>