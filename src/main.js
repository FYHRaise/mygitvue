import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入axios
import axios from 'axios';



//设置后台访问路径
axios.defaults.baseURL = "http://localhost:8089"
Vue.config.productionTip = false
//使用element-ui
Vue.use(ElementUI);
//挂载axios
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')