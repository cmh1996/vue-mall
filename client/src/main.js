import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router/client';
import store from './store';

import './assets/css/common.less';
import './assets/font/iconfont.css';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
