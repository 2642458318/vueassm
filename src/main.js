import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
/***
 * 请求方法封装，使用时无需import，直接this.方法就可以
 */
import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/menu";


/***
 * 引用
 * @type {postKeyValueRequest}
 */
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;


Vue.config.productionTip = false
Vue.use(ElementUI);

/***
 * 配置全局导航守卫
 * to 要去哪里
 * from 从哪里来
 * next 要让这个方法继续向下走
 */
router.beforeEach((to, from, next) => {
    //如果去login页，直接next
    if (to.path == '/') {
        next();
    } else {
        /**
         * 登陆之后用户数据存在user中，如果user中有数据就说明登录成功了
         * 如果没有登录就去登陆
         */
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store);
            next();
        } else {
            next("/");
        }

    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
