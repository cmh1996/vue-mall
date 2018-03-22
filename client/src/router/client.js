import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store';

import Mall from '@/pages/client/Mall';
import MallShow from '@/pages/client/MallShow';
import MallIndex from '@/pages/client/MallIndex';
import MallLogin from '@/pages/client/MallLogin';
import GoodsDetail from '@/pages/client/GoodsDetail';
import GoodsList from '@/pages/client/GoodsList';
import Personal from '@/pages/client/Personal';
import MyOrder from '@/pages/client/MyOrder';
import MyData from '@/pages/client/MyData';
import Cart from '@/pages/client/Cart';
import ErrorPage from '@/pages/ErrorPage';

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path:"/",
      redirect:"/mall"
    },{
      path: '/login',
      name: 'MallLogin',
      component: MallLogin
    },{
      path: '/mall',
      name: 'Mall',
      component: Mall,
      redirect:'/mall/show',
      children:[
        {
          path: 'show',
          name: 'MallShow',
          component: MallShow,
          redirect:'/mall/show/index',
          children:[
            {
              path: 'index',
              name: 'MallIndex',
              component: MallIndex
            },{
              path: 'goodsList/:typeId/:keyword',
              name: 'GoodsList',
              component: GoodsList
            },
          ]
        },{
          path: 'goods/:id',
          name: 'GoodsDetail',
          component: GoodsDetail
        },{
          path: 'personal',
          name: 'Personal',
          component: Personal,
          redirect:'/mall/personal/cart',
          children:[
            {
              path: 'cart',
              name: 'Cart',
              component: Cart,
              meta: {
                requireLogin:true,
              },
            },{
              path: 'myData',
              name: 'MyData',
              component: MyData,
              meta: {
                requireLogin:true,
              },
            },{
              path: 'myOrder',
              name: 'MyOrder',
              component: MyOrder,
              meta: {
                requireLogin:true,
              },
            }
          ]
        }
      ]
    },{
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
    if(store.state.clientToken){
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
