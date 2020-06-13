<template>
    <div>
        <div class="peimissManaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus">添加角色</el-button>
        </div>
        <div class="permissManaMain">
            <el-collapse accordion @change="change">
                <el-collapse-item :title="r.namezh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff0000" type="text"
                                       icon="el-icon-delete"></el-button>
                        </div>
                        <div>
                            <el-tree show-checkbox :data="allmenus" :props="defaultProps"></el-tree>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return {
                //默认打开哪个
                /*activeName:'1',*/
                role: {
                    name: '',
                    namezh: ''
                },
                roles: [],
                //服务端返回的树形数据
                allmenus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            // name为:name="r.id" 我们用角色id来当name 判断只在点开的时候响应
            change(name) {
                if (name) {
                    this.initAllMenu();
                }
            },
            initAllMenu() {
                this.getRequest("/system/basic/permiss/menu/").then(resp => {
                    if (resp) {
                        this.allmenus = resp;
                    }
                })
            },
            initRoles() {
                this.getRequest("/system/basic/permiss/").then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                })
            }
        }
    }
</script>

<style>
    .peimissManaTool {
        /*水平显示*/
        display: flex;

    }

    .peimissManaTool .el-input {
        width: 300px;
        margin-right: 8px;
    }

    .permissManaMain {
        margin-top: 8px;
        width: 700px;
    }
</style>