import Vue from 'vue'
import App from './App.vue'
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuescroll from "vuescroll";//引入vuescroll
import "vuescroll/dist/vuescroll.css";//引入vuescroll样式
Vue.use(vuescroll);//使用
Vue.config.productionTip = false
Vue.use(VueAxios, axios)

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(JsonViewer)
new Vue({
  render: h => h(App),
}).$mount('#app')
