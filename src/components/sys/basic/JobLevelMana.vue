<template>
    <div>
        <div>
            <el-input size="small" v-model="jl.name" style="width: 300px" prefix-icon="el-icon-plus"
                      placeholder="添加职称"></el-input>
            <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" style="margin-left: 8px">
                <!--label 展示给客户看的 value 提交给服务端的-->
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button icon="el-icon-plus" size="small" type="primary" style="margin-left: 8px" @click="addJobLevel">
                添加
            </el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="jls"
                    border
                    stripe
                    style="width: 70%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称级别"
                >
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                >
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="是否启用"

                >
                    <!--scope相当于一行的数据， scope.row相当于当前行的数据对象-->
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" style="width: 150px">
                    <template slot-scope="scope">
                        <!--scope.$index 当前操作的第几行 scope.row 当前对应的那个json 每一行的json对象-->
                        <el-button
                                size="small"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button size="small" type="danger" style="margin-top: 10px" :disabled="multipleSelection.length==0" @click="deleteMany">批量删除</el-button>
        </div>
        <el-dialog
                title="修改职称"
                :visible.sync="dialogVisible"
                width="30%"
        >
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职称名</el-tag>
                        </td>
                        <td>
                            <el-input size="small" v-model="updateJl.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>职称级别</el-tag>
                        </td>
                        <td>
                            <el-select v-model="updateJl.titleLevel" placeholder="职称等级" size="small"
                                       style="margin-left: 8px">
                                <!--label 展示给客户看的 value 提交给服务端的-->
                                <el-option
                                        v-for="item in titleLevels"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                            <!--<el-input size="small" v-model="updateJl.titleLevel"></el-input>-->
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>是否启用</el-tag>
                        </td>
                        <td>
                            <el-switch
                                    v-model="updateJl.enabled"
                                    active-text="启用"
                                    inactive-text="禁用">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest} from "../../../utils/api";

    export default {
        name: "JobLevelMana",
        data() {
            return {
                jl: {
                    name: '',
                    titleLevel: ''
                },
                //后端返回的数据最放到此数组里
                jls: [],
                titleLevels: [
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级'
                ],
                dialogVisible: false,
                updateJl: {
                    name: '',
                    titleLevel: '',
                    enabled: false
                },
                multipleSelection: []
            }
        },
        mounted() {
            this.initJls();
        },
        methods: {
            initJls() {
                this.getRequest("/system/basic/joblevel/").then(resp => {
                    if (resp) {
                        this.jls = resp;
                    }
                })
            },
            addJobLevel() {
                if (this.jl.name && this.jl.titleLevel) {
                    this.postRequest("/system/basic/joblevel/", this.jl).then(resp => {
                        if (resp) {
                            /*重新加载方法*/
                            this.initJls();
                            /*清空输入框*/
                            this.jl.name = '';
                            this.jl.titleLevel = ''
                        }
                    })
                } else {
                    this.$message.error('输入框不能为空，请重新输入');
                }
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除【' + data.name + '】职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/joblevel/" + data.id).then(resp => {
                            if (resp) {
                                this.initJls();
                            }
                        }
                    )
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showEditView(index, data) {
                //赋值        用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
                Object.assign(this.updateJl, data);
                this.dialogVisible = true
            },
            doUpdate() {
                this.putRequest("/system/basic/joblevel/", this.updateJl).then(resp => {
                    if (resp) {
                        this.initJls();
                        this.dialogVisible = false
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            deleteMany(){
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids='?';
                    this.multipleSelection.forEach(item=>{
                        ids+='ids='+item.id+'&'
                    })
                    this.deleteRequest("/system/basic/joblevel/" + ids).then(resp => {
                            if (resp) {
                                this.initJls();
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

<style scoped>

</style>