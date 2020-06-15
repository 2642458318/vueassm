<template>
    <div style="width: 500px">
        <el-input
                placeholder="请输入部门名称进行搜索"
                prefix-icon="el-icon-search"
                v-model="filterText">
        </el-input>
        <!--default-expand-all: 默认展开所有-->
        <el-tree
                :data="deps"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }"
                  style="display: flex;justify-content: space-between;width: 100%">
        <span>{{ node.label }}</span>
        <span>
          <el-button
                  type="primary"
                  size="mini"
                  class="depBtn"
                  @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
                  type="danger"
                  size="mini"
                  class="depBtn"
                  @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
        </el-tree>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data() {
            return {
                filterText: '',
                //后端返回的数据
                deps: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        //监控器 当filterText的值发生变化时，他会触发这个方法   val为filterText的最新值
        //filter调用过滤方法，实际上调用:filter-node-method，同时传一个val
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            //data为一条一条的json对象
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            initDeps() {
                this.getRequest("/system/basic/department/").then(resp => {
                    if (resp) {
                        this.deps = resp;
                    }
                })
            },
            showAddDepView(data) {
                console.log(data)
            },
            deleteDep(data) {
                console.log(data)
            }
        }
    }
</script>

<style>
    .depBtn {
        padding: 2px;
    }
</style>