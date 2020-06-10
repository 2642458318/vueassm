import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden:true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden:true
    }/*,
    {
        path: '/home',
        name: '导航一',
        component: Home,
        //设置页面打开在左侧
        children: [
            {
                path: '/test1',
                name: '选项1',
                component: Test1
            }, {
                path: '/test2',
                name: '选项2',
                component: Test2
            }
        ]
    }*/
]

const router = new VueRouter({
    routes
})

export default router
