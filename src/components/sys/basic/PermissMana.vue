<template>
    <div>
        <div class="peimissManaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.namezh" @keydown.enter.native="doAddRole">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
        </div>
        <div class="permissManaMain">
            <el-collapse v-model="activeName" accordion @change="change">
                <el-collapse-item :title="r.namezh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff0000" type="text"
                                       icon="el-icon-delete" @click="deleteRole(r)"></el-button>
                        </div>
                        <div>
                            <!--ref="tree" 相当于取了一个名字，根据名字就能查找到元素-->
                            <el-tree ref="tree" node-key="id" :default-checked-keys="selectedMenus" show-checkbox
                                     :data="allmenus"
                                     :props="defaultProps"
                                     :key="index"></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    import {postRequest} from "../../../utils/api";

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
                },
                //后端返回的menu资源id
                selectedMenus: [],
                activeName: -1
            }

        },
        mounted() {
            this.initRoles();
        },
        methods: {
            // name为:name="r.id" 我们用角色id来当name 判断只在点开的时候响应
            change(rid) {
                if (rid) {
                    this.initAllMenu();
                    this.initSelectedMenus(rid);
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
            },
            initSelectedMenus(rid) {
                this.getRequest("/system/basic/permiss/mids/" + rid).then(resp => {
                    if (resp) {
                        this.selectedMenus = resp;
                    }
                })
            },
            doUpdate(rid, index) {
                let tree = this.$refs.tree[index];
                //getCheckedKeys 若为true只返回叶子结点的key
                let selectKeys = tree.getCheckedKeys(true);
                let url = "/system/basic/permiss/?rid=" + rid;
                selectKeys.forEach(key => {
                    console.log(rid);
                    console.log(key);
                    url += '&mids=' + key;
                })
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.initRoles();
                        this.activeName = -1;
                    }
                })
            },
            cancelUpdate() {
                this.activeName = -1;
                this.initRoles();
            },
            doAddRole() {
                if (this.role.name && this.role.namezh) {
                    this.postRequest("/system/basic/permiss/role/", this.role).then(resp => {
                        if (resp) {
                            this.role.name = '';
                            this.role.namezh = '';
                            this.initRoles();
                        }
                    })
                } else {
                    this.$message.error('输入框不能为空，请重新输入');
                }

            },
            deleteRole(role) {
                this.$confirm('此操作将永久删除【' + role.namezh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(role.id);
                    this.deleteRequest("/system/basic/permiss/role/" + role.id).then(resp => {
                            if (resp) {
                                this.initRoles();
                            }
                        }
                    )
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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