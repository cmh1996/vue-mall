import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store';

import AdminLogin from '@/pages/admin/AdminLogin' 
import Backstage from '@/pages/admin/Backstage'
import EditUser from '@/pages/admin/EditUser' 
import EditAdmin from '@/pages/admin/EditAdmin'
import Goods from '@/pages/admin/Goods' 
import Orders from '@/pages/admin/Orders' 
import EditOrders from '@/pages/admin/EditOrders'
import EditGoods from '@/pages/admin/EditGoods'
import Messages from '@/pages/admin/Messages' 
import ErrorPage from '@/pages/ErrorPage' 

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path:"/",
      redirect:"/login"
    },{
      path: '/login',
      name: 'AdminLogin',
      component: AdminLogin
    },{
      path: '/backstage',
      name: 'Backstage',
      redirect:"/backstage/editUser",
      component: Backstage,
      children: [
        {
          path: 'editUser',
          name: 'EditUser',
          component: EditUser,
          meta: {
            requireLogin:true,
          },
        },{
          path: 'editAdmin',
          name: 'EditAdmin',
          component: EditAdmin,
          meta: {
            requireLogin:true,
          },
        },{
          path: 'goods',
          name: 'Goods',
          component: Goods,
          meta: {
            requireLogin:true,
          },
        },{
          path: 'goods/:id',
          name: 'EditGoods',
          component: EditGoods,
          meta: {
            requireLogin:true,
          },
        },{
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: {
            requireLogin:true,
          },
        },{
          path: 'orders/:id',
          name: 'EditOrders',
          component: EditOrders,
          meta: {
            requireLogin:true,
          },
        },{
          path: 'messages',
          name: 'Messages',
          component: Messages,
          meta: {
            requireLogin:true,
          },
        }
      ]
    },{//404页面
    	path:'*',
    	name:'ErrorPage',
    	component: ErrorPage
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

//登录拦截
router.beforeEach((to,from,next) => {
  if(to.meta.requireLogin){
    if(store.state.adminToken){
      next()
    }else{
      next({
        path: '/login',
        query:{redirect: to.fullPath}
      })
    }
  }else{
    next();
  }
});

export default router;