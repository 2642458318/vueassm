import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //路由数组，一会从服务器上加载的菜单项都会放在这个数组里面
        routes: []
    },
    mutations: {
        /**
         * 通过state才能访问到state里面的routes
         * 虽然该方法有两个参数，实际上只传data就可以，data只能传一个参数，如果有多个参数，就把它封装成json对象
         * @param state
         * @param data 传进来的参数
         */
        initRoutes(state, data) {
            state.routes = data;
        }
    },
    actions: {}
})