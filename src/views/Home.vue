<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">异世界</div>
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
                <el-aside width="200px">Aside</el-aside>
                <el-main>Main</el-main>
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
        methods:{
            commandHandler(cmd){
                if (cmd=='logout'){
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        /*this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });*/
                        this.getRequest('/logout');
                        /*清空登录数据*/
                        window.sessionStorage.removeItem('user')
                        /*回到登录页*/
                        this.$router.replace('/')
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

    .userInfo{
        /*箭头变成手指*/
        cursor: pointer;
    }

    .el-dropdown-link img{
        width: 48px;
        height: 48px;
        /*把图片变成圆的*/
        border-radius: 24px;
        margin-left: 8px;
    }

    .el-dropdown-link{
        /*垂直居中*/
        display: flex;
        align-items: center;
    }
</style>