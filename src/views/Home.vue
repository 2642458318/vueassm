<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">花果山</div>
                <el-dropdown class="userInfo" @command="commandHandler">
  <span class="el-dropdown-link">
    {{user.name}}<i><img :src="user.userface"/></i>
  </span>
                    <el-dropdown-menu slot="dropdown">
                        <!--设置点击事件：command-->
                        <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <!--disabled：禁用-->
                        <!--<el-dropdown-item disabled>双皮奶</el-dropdown-item>-->
                        <!--divided：分割线-->
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu @select='menuClick' unique-opened>
                        <!--把router文件夹下的index.js文件中的routes数组，动态渲染到左边菜单。如果hidden为true就隐藏起来。for循环要加key-->
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden"
                                    :key="index">
                            <template slot="title">
                                <i style="color: #409eff;margin-right: 5px" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!--不是首页的时候，面包屑才展示出来-->
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <!--只在首页展示-->
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                        欢迎来到花果山！
                    </div>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem('user'))
            }
        },
        computed: {
            routes() {
                /**
                 * this.$store就可以获取到store，然后再拿到state里面的routes属性
                 * routes属性为store文件及里的index.js文件里面的routes数组，数组里面存的服务端返回的数据，
                 * 数据经过menu.js里面的方法加工之后，变成对象数据
                 *
                 * */
                return this.$store.state.routes;
            }
        },
        methods: {
            menuClick(index) {
                this.$router.push(index);
            },
            commandHandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        /*this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });*/
                        //调用api.js的方法注销登录
                        this.getRequest('/logout');
                        /*清空登录数据*/
                        window.sessionStorage.removeItem('user');
                        /*清空store里面的数据*/
                        this.$store.commit('initRoutes',[])
                        /*回到登录页*/
                        this.$router.replace('/');
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }
        }
    }
</script>

<style>
    .homeWelcome {
        text-align: center;
        font-size: 30px;
        font-family: 华文行楷;
        color: #409eff;
        padding-top: 50px;
    }

    .homeHeader {
        /*背景颜色*/
        background-color: cadetblue;
        display: flex;
        /*竖直居中*/
        align-items: center;
        /*空白的地方在中间*/
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .title {
        font-size: 30px;
        font-family: 华文行楷;
        color: aliceblue;
    }

    .userInfo {
        /*箭头变成手指*/
        cursor: pointer;
    }

    /*设置图片属性样式*/
    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        /*把图片变成圆的*/
        border-radius: 24px;
        margin-left: 8px;
    }

    /*设置文本属性样式*/
    .el-dropdown-link {
        /*垂直居中*/
        display: flex;
        align-items: center;
    }
</style>