<template>
  <div class="EditUser">
  	<header class="clear">
  		<span>用户管理</span>
  		<div><input ref="input" type="text" placeholder="输入搜索用户" /><button @click="searchUser"><i class="iconfont icon-search" /></button></div>
  	</header>
	<table className="userTable">
        <thead>
        	<tr><th>用户ID</th><th>email</th><th>昵称</th><th>性别</th><th>收件人</th><th>收货地址</th><th>联系电话</th><th>操作</th></tr>
        </thead>
        <tbody>
            <tr v-for="(item,index) in userList" :key="'user'+item.id">
                <td>{{item.id}}</td>
                <td>{{item.email}}</td>
                <td>{{item.nickname}}</td>
                <td>{{item.sex}}</td>
                <td>{{item.recipient}}</td>
                <td>{{item.address}}</td>
                <td>{{item.phone}}</td>
                <td><button class="delete" @click="deleteUser(item.id)">删除</button></td>
            </tr>
        </tbody>
    </table>
  	
    
  </div>
</template>

<script>
import {getAllUser,getSearchUser,deleteUser} from '../../api/admin';
export default {
  name: 'EditUser',
  computed:{
  },
  data(){
  	return{
  		userList:[]
  	}
  },
  mounted(){
  	const res = getAllUser();
  	res
  	.then((users)=>{
  		this.userList = users;
  	})
  	.catch((e)=>{
  		alert(e)
  	})
  },
  methods:{
  	deleteUser(id){
  		const res = deleteUser(id);
  		res
  		.then(()=>{
  			alert('删除成功');
  			this.userList.map((item,index)=>{
  				if(item.id===id){
  					this.userList.splice(index,1);
  				}
  			})
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
  	searchUser(){
  		const val = this.$refs.input.value;
  		const res = getSearchUser(val);
  		res
  		.then((data)=>{
  			this.userList = data;
  		})
  		.catch((e)=>{
  			alert(e);
  		})
  	},
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.EditUser{
	header{
		width: 100%;
		height: 40px;
		line-height: 40px;
		span{
			float: left;
		}
		div{
			height: 20px;
			float: right;
      input{
        border: none;
        border-bottom: 1px solid #337da4;
        background-color: rgba(0,0,0,0);
        width: 180px;
        padding-left: 10px;
      }
			button{
        position: relative;
        top: -1px;
        border: none;
        background-color: rgba(0,0,0,0);
				i{
					font-size: 17px;
          color:#337da4;
				}
			}
		}
	}
}
</style>