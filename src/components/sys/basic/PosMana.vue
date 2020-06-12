<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="addPosInput"
                    placeholder="添加职位"
                    @keydown.enter.native="addPosition"
                    prefix-icon="el-icon-plus"
                    v-model="pos.name">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition"></el-button>
        </div>
        <div class="posManaMain">
            <el-table
                    :data="positions"
                    @selection-change="handleSelectionChange"
                    border
                    stripe
                    style="width: 70%">
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
                        label="职位名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--scope.$index 当前操作的第几行 scope.row 当前对应的那个json 每一行的json对象-->
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                title="修改职位"
                :visible.sync="dialogVisible"
                width="30%"
        >
            <div>
                <el-tag>职位名称</el-tag>
                <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
        </el-dialog>
        <el-button @click="deleteMany" type="danger" size="" style="margin-top: 8px"
                   :disabled="multipleSelection.length==0">批量删除
        </el-button>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                pos: {
                    name: ''
                },
                updatePos: {
                    name: ''
                },
                dialogVisible: false,
                /*后端传来的数据*/
                positions: [],
                multipleSelection: []
            }
        },
        mounted() {
            this.initPositions();
        },
        methods: {
            addPosition() {
                /*this.pos传的是对象，而不是一个name属性  如果resp有返回，就重新吊initPositions方法加载一下*/
                if (this.pos.name) {
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        if (resp) {
                            /*重新加载方法*/
                            this.initPositions();
                            /*清空输入框*/
                            this.pos.name = ''
                        }
                    })
                } else {
                    this.$message.error('输入框不能为空，请重新输入');
                }
            },
            showEditView(index, data) {
                //this.updatePos=data;
                //用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
                Object.assign(this.updatePos, data);
                this.dialogVisible = true;
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
                            if (resp) {
                                this.initPositions();
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
            initPositions() {
                this.getRequest("/system/basic/pos/").then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            },
            doUpdate() {
                //this.updatePos 请求的数据
                this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
                    if (resp) {
                        //刷新
                        this.initPositions();
                        //复原为空
                        this.updatePos.name = null;
                        //关闭对话框
                        this.dialogVisible = false;
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            deleteMany() {
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                    })
                    this.deleteRequest("/system/basic/pos/" + ids).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    })
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
    .addPosInput {
        width: 300px;
        margin-right: 8px
    }

    .posManaMain {
        margin-top: 10px;
    }

    .updatePosInput {
        width: 200px;
        margin-left: 8px;
    }
</style>