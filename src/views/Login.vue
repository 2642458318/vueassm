<template>
    <div>
        <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="text" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <!--是否记住密码-->
            <el-checkbox v-model="checked" class="loginRemember"></el-checkbox>
            <el-button type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>

    import {postKeyValueRequest} from "../utils/api";

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123'
                },
                checked: true,
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },

            }
        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        //alert('submit!');
                        /**
                         * then里面的参数就是服务端返回的参数，参数在response已经被二次处理一次
                         */
                        postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
                            if (resp) {
                                //把用户信息保存在sessionStorage，sessionStorage打开页面再关掉就没了
                                window.sessionStorage.setItem('user', JSON.stringify(resp.obj));
                                //页面跳转,获取当前对象的router对象,replace替换页面
                                this.$router.replace('/home');
                                //如果成功，打印一下
                                alert(JSON.stringify(resp))
                            }
                        })
                    } else {
                        //console.log('error submit!!');
                        this.$message.error('请输入所有信息');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        /*位置：上右下左*/
        margin: 0px auto 40px auto;
        /*位置：居中*/
        text-align: center;
        color: black;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 20px 0px;
    }

</style>