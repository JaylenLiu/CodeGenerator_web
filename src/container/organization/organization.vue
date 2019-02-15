<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>组织管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" ref="container">
            <div class="handle-box">            
                <el-tree
                    :data="treeData"
                    node-key="id"
                    default-expand-all
                    @node-drag-end="handleDragEnd"
                    draggable
                >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => append(node, data)">
                            新增
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => edit(node, data)">
                            修改
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)">
                            删除
                        </el-button>
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="operationType" :visible.sync="editVisible" width="500px">
            <el-form ref="orgForm"  :model="editData" label-width="100px" :rules="rules" status-icon>
                <el-form-item label="组织名称" prop="orgName">
                    <el-input class="handle-input mr10" v-model="editData.orgName"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="orgType">
                    <el-select placeholder="请选择" v-model="editData.orgType" class="handle-input mr10">
                        <el-option
                            v-for="item in orgTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>    
                </el-form-item>   
                <el-form-item label="排序号" prop="sort">
                     <el-input-number class="handle-input mr10" v-model="editData.sort" :precision="1" :step="1"></el-input-number>
                    <!-- <el-input class="handle-input mr10" v-model="editData.sort"></el-input> -->
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit('orgForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
 import http from '@util/http';
  export default {
    name: 'orgTree',
    data() {
        return {
            editVisible: false, // 弹出框显示控制
            operationType: '', // 新增，编辑
            treeData:[], // 组织树数据
            editData:{
                id:'',
                orgName: '',
                orgType: 1,
                sort: ''
            },
            rules: {
                orgName: [
                    { required: true, message: '请输入组织名称', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.initData();
    },
    mounted () {
        // 获取屏幕宽度和高度
        // let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.$refs.container.style.height = '680px';  
    },
    computed: {
        orgTypeOptions(){
            return [
                {
                    label: "机构",
                    value: 1
                },
                {
                    label: "部门",
                    value: 2
                },
                {
                    label: "职位",
                    value: 3
                },
            ]
        },
    },
    methods: {
        // 拖拽事件
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            let data = {};
            if (dropType === 'inner') {
                data = {
                    id : draggingNode.data.id,
                    parentId: dropNode.data.id
                }
            } else if (dropType === "before" || dropType === 'after') {
                data = {
                    id : draggingNode.data.id,
                    parentId: dropNode.data.parentId,
                }
            } 
            console.log(dropNode);
            
            http.put('org', data).then((res)=>{                
                if(res.httpCode === 200){
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    });   
                    this.initData();
                } else {
                    this.$message({
                        type: 'error',
                        message: ret.message
                    });   
                }
            });
        },
        // 数据初始化
        initData(){
            http.get('orgTree', {}).then((result)=>{
                if (result.httpCode === 200) {
                    this.treeData = result.data
                } else {
                    this.$message({
                        type: 'error',
                        message: result.message
                    });   
                }
            });
        },
        // 新增节点
        append(node, data) {
            this.operationType = '新增';
            this.editVisible = true;
            this.editData = {
                id: data.id,
                orgName: '',
                orgType: 1,
                sort: ''
            }
        },
        // 删除节点
        remove(node, data) {
            this.$confirm('您确定要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = [];
                ids.push(data.id);
                //  请求后台删除数据
                http.del('orgs', {ids:ids}).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });   
                        this.initData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });   
                    }
                });
                
            }).catch(() => {
                        
            });
        },
        // 编辑节点
        edit(node, data) {
            this.editVisible = true;
            this.operationType = '编辑';
            this.editData = {
                id: data.id,
                orgName: data.label,
                orgType: data.orgType,
                sort: data.sort
            }
        },
        // 表单提交
        submit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editVisible = false;
                    if (this.operationType === '编辑') {
                        //  修改数据库
                        http.put('org', this.editData).then((ret)=>{
                            
                            if(ret.httpCode === 200){
                                this.$message({
                                    type: 'success',
                                    message: '修改成功！'
                                });   
                                this.initData();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: ret.message
                                });   
                            }
                        });
                    } else if (this.operationType === '新增'){
                        // let params = `parentId=${this.editData.id}&orgName=${this.editData.orgName}&orgType=${this.editData.orgType}&sort=${this.editData.sort}`;
                        let params = {
                            parentId: this.editData.id,
                            orgName: this.editData.orgName,
                            orgType: this.editData.orgType,
                            sort: this.editData.sort
                        };
                        http.post('org', params).then((ret)=>{
                            if(ret.httpCode === 200){
                                this.$message({
                                    type: 'success',
                                    message: '新增成功！'
                                });

                                this.initData();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: ret.message
                                });   
                            }
                        });
                    }
                }
            });   
        }
    }
  };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .container{
        margin-top: 10px;
    }
</style>