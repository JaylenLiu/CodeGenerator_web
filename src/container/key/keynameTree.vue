<template>
    <div>
        <div class="handle-box">            
            <el-tree
                :data="keynameData"
                node-key="id"
                default-expand-all
                @node-click="handleNodeClick"
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
        <!-- 编辑弹出框 -->
        <el-dialog :title="operationType" :visible.sync="editVisible" width="500px">
            <el-form ref="keynameForm"  :model="editData" label-width="100px" :rules="rules">
                <el-form-item label="名称" prop="keyname">
                    <el-input class="handle-input mr10" v-model="editData.keyname"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="keyType">
                    <el-select placeholder="请选择" v-model="editData.keyType" class="handle-input mr10">
                        <el-option
                            v-for="item in keynameTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>    
                </el-form-item>   
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit('keynameForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
 import http from '@util/http';
  export default {
    name: 'keynameTree',
    inject:['reload'],
    data() {
        return {
            editVisible: false, // 弹出框显示控制
            operationType: '', // 新增，编辑
            keynameData:[], // 组织树数据
            editData:{
                id:'',
                keyname: '',
                keyType: 3,
            },
            
            rules: {
                keyName: [
                    { required: true, message: '请输入字典名称', trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.initData();
    },
    computed: {
        keynameTypeOptions(){
            return [
                {
                    label: "系统参数",
                    value: 1
                },
                {
                    label: "默认参数",
                    value: 2
                },
                {
                    label: "用户参数",
                    value: 3
                },
            ]
        },
    },
    methods: {
        handleNodeClick(row){
            this.$store.dispatch('saveKeynameId', row.id);
            http.get('keyValuesByKeynameId', {keynameId:row.id}).then((ret)=>{
                let data = [];
                if (ret.httpCode == 200) {
                    data = ret.data
                }
                this.$store.dispatch('saveKeyvalues', data);
            });
             
        },
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
            
            http.put('keyname', data).then((res)=>{                
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
            http.get('keynameTree', {}).then((result)=>{
                if (result.httpCode === 200) {
                    this.keynameData = result.data
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
                parentId: data.id,
                keyname: '',
                keyType: 3,
            }
        },
        // 删除节点
        remove(node, data) {
             if (data.keyType != 3) {
                this.$alert('系统参数及默认参数不允许删除！', '警告', {
                    confirmButtonText: '确定',
                });
            } else{
                this.$confirm('您确定要删除数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    ids.push(data.id);
                    //  请求后台删除数据
                    http.del('keynames', {ids:ids}).then((ret)=>{
                        if(ret.httpCode === 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });   
                        } else {
                            this.$message({
                                type: 'error',
                                message: ret.message
                            });   
                        }
                    });
                    
                })
            }
        },
        // 编辑节点
        edit(node, data) {
            if (data.keyType != 3) {
                this.$alert('系统参数及默认参数不允许修改！', '警告', {
                    confirmButtonText: '确定',
                });
            } else{
                this.editVisible = true; 
                this.operationType = '编辑';
                this.editData = {
                    id: data.id,
                    keyname: data.label,
                    keyType: data.keyType
                }
            }
           
        },
        // 表单提交
        submit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editVisible = false;
                    if (this.operationType === '编辑') {
                        //  修改数据库
                        http.put('keyname', this.editData).then((ret)=>{
                            
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
                        let params = {
                            parentId: this.editData.parentId,
                            keyname: this.editData.keyname,
                            keyType: this.editData.keyType
                        };
                        http.post('keyname', params).then((ret)=>{
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
</style>