<template>
    <div>
        <div class="handle-box">   
            <el-button
                type="text"
                size="mini"
                @click="append()">新增
            </el-button>
            <el-tree
                class="connTree"
                :data="connTreeData"
                accordion
                highlight-current
                @node-click="handleNodeClick"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }" >
                    <span>{{ node.label }}</span>
                    <span v-show="data.nodeType === 'con'">
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
        <el-dialog :title="operationType" :visible.sync="editVisible" width="500px" @close="cancelEvent('connForm')">
            <el-form ref="connForm"  :model="editData" label-width="100px" :rules="rules" status-icon>
                <el-form-item label="连接名称" prop="connName">
                    <el-input class="handle-input mr10" v-model="editData.connName"></el-input>
                </el-form-item>
                <el-form-item label="连接类型" prop="connType">
                    <el-select placeholder="请选择" v-model="editData.connType" class="handle-input mr10">
                        <el-option
                            v-for="item in connTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>    
                </el-form-item>   
                <el-form-item  v-if="editData.connType == 3" label="SID(服务名)" prop="sid">
                    <el-input class="handle-input mr10" v-model="editData.sid"></el-input>
                </el-form-item>
                <el-form-item label="ip" prop="connIp">
                    <el-input class="handle-input mr10" v-model="editData.connIp"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="connPort">
                    <el-input class="handle-input mr10" v-model="editData.connPort"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="connUsername">
                    <el-input class="handle-input mr10" v-model="editData.connUsername"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="connPwd">
                    <el-input class="handle-input mr10" type="password" v-model="editData.connPwd"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEvent('connForm')">取 消</el-button>
                <el-button type="primary" v-if="operationType === '新增'" @click="submit('connForm')">确 定</el-button>
                <el-button type="primary" v-else @click="editEvent('connForm')">保存</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
 import http from '@util/http';
  export default {
    name: 'databaseConnTree',
    inject:['reload'],
    data() {
        return {
            editVisible: false, // 弹出框显示控制
            operationType: '', // 新增，编辑
            connTreeData:[], // 组织树数据
            editData:{
                id:'',
                sid:'',
                connName: '',
                connType: 1,
                connIp:'',
                connPort:'',
                connUsername:'',
                connPwd:''
            },
            rules: {
                connName: [
                    { required: true, message: '请输入连接名称', trigger: 'blur' }
                ],
                connIp: [
                    { required: true, message: '请输入IP', trigger: 'blur' }
                ],
                connPort: [
                    { required: true, message: '请输入端口', trigger: 'blur' }
                ],
                connUsername: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                connPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                sid:[
                    { required: true, message: '请输入SID', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.initData();
    },
    computed: {
        connTypeOptions(){
            return [
                {
                    label: "mysql",
                    value: 1
                },
                {
                    label: "sql server",
                    value: 2
                },
                {
                    label: "oracle",
                    value: 3
                },
            ]
        },
    },
    methods: {
        handleNodeClick(row){
            if(row.nodeType == 'table'){
                let params = {
                    conId: row.conId,
                    databaseName: row.databaseName,
                    tableName: row.label
                }

                http.get('fields', params).then((result)=>{
                    let data = [];
                    if (result.httpCode === 200) {
                        data = result.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.message
                        });   
                    }
                    this.$store.dispatch('saveConData', params);
                    this.$store.dispatch('saveFileds', data);
                });
            }
        },
        // 数据初始化
        initData(){
            http.get('databaseTree', {}).then((result)=>{
                if (result.httpCode === 200) {
                    this.connTreeData = result.data
                } else {
                    this.$message({
                        type: 'error',
                        message: result.message
                    });   
                }
            });
        },
        // 新增节点
        append() {
            this.operationType = '新增';
            this.editVisible = true;
            this.editData = {
                sid:'',
                connName: '',
                connType: 1,
                connIp:'',
                connPort:'',
                connUsername:'',
                connPwd:''
            }
        },
        // 删除节点
        remove(node, data) {
            this.$confirm('您确定要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //  请求后台删除数据
                http.del('databaseConnection', {id:data.id}).then((ret)=>{
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
            })
        },
        // 编辑节点
        edit(node, data) {
            this.editVisible = true; 
            this.operationType = '编辑';

            http.get('databaseConnection',{id:data.id}).then((ret)=>{
                if(ret.httpCode === 200){
                    this.editData = ret.data
                } else {
                    this.$message({
                        type: 'error',
                        message: ret.message
                    });   
                }
            });
        },
        cancelEvent(formName){
            this.$refs[formName].resetFields();
            this.$refs[formName].clearValidate();
            this.editVisible = false;
        },
        editEvent(formName){
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editVisible = false;
                    this.$refs[formName].clearValidate();
                    //  修改数据库
                    http.put('databaseConnection', this.editData).then((ret)=>{
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
                }
             });
            
        }, 
        // 表单提交
        submit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editVisible = false;
                    this.$refs[formName].clearValidate();
                    http.post('databaseConnection', this.editData).then((ret)=>{
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
    .connTree{
        max-height: 680px;
        overflow-y: scroll;
    }
</style>