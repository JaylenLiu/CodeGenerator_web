<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>账号信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" ref="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="base_btn handle-del mr10"
                    @click="delAll">批量删除
                </el-button>
                <el-button
                    type="primary"
                    icon="el-icon-warning"
                    class="base_btn handle-del mr10"
                    @click="resetPassword">重置密码
                </el-button>
                <el-input v-model="searchKey" placeholder="请输入用户名" class="handle-input mr10" style="width:200px;"></el-input>
                <el-select v-model="state" placeholder="请选择" style="width:100px">
                    <el-option
                    v-for="item in selectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button
                    class="base_btn"
                    type="primary"
                    icon="el-icon-search"
                    @click="search">搜索
                </el-button>  
                <el-button
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    class="base_btn handle-del mr10"
                    style="float:right  !important"
                    @click="add">新增
                </el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="realName" label="真实姓名"></el-table-column>
                <el-table-column prop="orgName" label="组织信息"></el-table-column>
                <el-table-column prop="state" label="状态" :formatter="stateFormatter" width="60"></el-table-column>
                <el-table-column prop="accountType" label="账号类型" :formatter="accountTypeFormatter" width="80"></el-table-column>
                <el-table-column prop="lastLoginTime" label="上次登录时间"></el-table-column>
                <el-table-column prop="lastLoginIp" label="上次登录ip"></el-table-column>
                <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                        <el-button class="han_btn" size="small" type="text" @click="edit(scope.row)">编辑</el-button>
                        <el-button class="han_btn" size="small" type="text" @click="updateState(scope.row.id, 1)" v-if="scope.row.state==2">禁用</el-button>
                        <el-button class="han_btn" size="small" type="text" @click="updateState(scope.row.id, 2)" v-else>启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handlePageChange" layout="prev, pager, next" :total="pages*pageSize" background>
                </el-pagination>
            </div>
        </div>

         <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="500px">
            <el-form ref="accountForm"  :model="editData" label-width="100px" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input class="handle-input mr10" v-model="editData.username" placeholder="请输入用户名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input class="handle-input mr10" v-model="editData.realName" placeholder="请输入真实姓名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号类型" prop="accountType">
                    <el-select placeholder="请选择" v-model="editData.accountType" class="handle-input mr10" >
                        <el-option
                            auto-complete="off"
                            v-for="item in accountTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>    
                </el-form-item>
                <el-form-item label="组织信息" prop="orgId">
                     <treeselect 
                        auto-complete="off"
                        class="handle-input mr10"
                        v-model="editData.orgId"
                        :multiple="false" 
                        :searchable="true"
                        placeholder="请选择组织名称" 
                        :options="orgTreeData" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('accountForm')">取 消</el-button>
                <el-button type="primary" @click="submit('accountForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    // import the component
    import Treeselect from '@riophae/vue-treeselect';
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css';
    import http from '@util/http';
    export default {
        name: 'projectTable',
        components: { Treeselect },
        data() {
            return {
                operationType: '', // 操作类型，edit:编辑，add:新增
                editData:{  // 弹出框绑定的数据
                    id:'',
                    userId:'',
                    username:'',
                    realName:'',
                    accountType:2,
                    orgId:null
                },
                orgTreeData: [], // 组织树数据
                editVisible: false, // 是否展示编辑框
                state: 2,  
                tableData: [], // 表格数据
                searchKey: '', // 查询关键字
                accountIds: [], // 账号id数组
                userIds:[], // 用户id数组
                pageNum: 1, // 当前页码
                pageSize: 10, // 每页显示条数
                pages: 10, // 总页数
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    realName: [
                        { required: true, message: '请输入真实姓名', trigger: 'blur' }
                    ],
                    accountType: [
                        { required: true, message: '请选择账号类型', trigger: 'blur' }
                    ],
                    orgId: [
                        { required: true, message: '请选择组织信息', trigger: 'blur' }
                    ]
                },
            }
        },
        created() {
            this.initData({
                state:this.state
            });
        },
        mounted () {
            this.$refs.container.style.height = '680px';  
        },
        computed: {
           selectOptions(){
                return [
                    {
                        label: "全部",
                        value:0
                    },
                    {
                        label:"禁用",
                        value:1
                    },
                    {
                        label:"正常",
                        value:2
                    },
                    // {
                    //     label:"锁定",
                    //     value:3
                    // }
               ]
           },
           accountTypeOptions() {
               return [
                    {
                        label:"管理员",
                        value:1
                    },
                    {
                        label:"一般用户",
                        value:2
                    }
               ]
           }
        },
        methods: {
            // 初始化数据
            initData(params) {
                // 向参数对象中加入分页信息
                Object.assign(params,{
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                });
                // 请求账户数据
                http.get('accounts', params).then((result)=>{
                    if (result.httpCode === 200) {
                        this.tableData = result.data;
                        this.pages = result.pages;
                    } else {
                        this.$message({
                            type: 'error',
                            message: result.message
                        });
                    }
                });

                 // 请求组织数据
                http.get('orgTree', {}).then((res)=>{
                    if (res.httpCode === 200) {
                        this.orgTreeData = res.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });   
                    }
                });
            },
            // 修改状态含义
            stateFormatter(row, column){
                if (row.state === 1) {
                    return "禁用";
                } else if (row.state === 2) {
                    return "正常";
                } else if (row.state === 3) {
                    return "锁定";
                } 
            },
            // 用户类型格式化
            accountTypeFormatter(row, column){
                if (row.accountType === 1) {
                    return "管理员";
                } else if(row.accountType === 2) {
                    return "一般用户";
                }
            },
            // 查询事件
            search() {
                this.initData({
                    state:this.state,
                    searchKey:this.searchKey
                });
            },
            // 新增事件
            add(){
                this.editData = {  // 弹出框绑定的数据
                    id:'',
                    userId:'',
                    username:'',
                    realName:'',
                    accountType:2,
                    orgId:null
                },
                this.operationType = "add";
                this.editVisible = true;
            },
            // 分页事件 
            handlePageChange(currentPage){
                this.pageNum = currentPage;
                this.initData({
                    state:this.state,
                    searchKey:this.searchKey
                });
            },
            // 多选事件
            handleSelectionChange(val) {
                let accountIds = val.map((row)=>{
                    return row.id;
                });
                this.accountIds = accountIds;

                let userIds = val.map((row)=>{
                    return row.userId;
                });
                this.userIds = userIds;

            },
            // 重置密码
            resetPassword() {
                const length = this.accountIds.length;
                if (length === 0) {
                    this.$alert('您未选择任何数据！', '警告', {
                        confirmButtonText: '确定',
                    });
                } else {
                    this.$confirm('您确定要重置密码吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        http.put('resetPassword', {ids:this.accountIds}).then((ret)=>{
                            if(ret.httpCode === 200){
                                this.$message({
                                    type: 'success',
                                    message: '重置密码成功！'
                                });   
                                this.initData({state:this.state});
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: ret.message
                                });   
                            }
                        });
                    });
                }
            },
            // 删除多条记录
            delAll() {
                const length = this.accountIds.length;
                if (length === 0) {
                    this.$alert('您未选择任何数据！', '警告', {
                        confirmButtonText: '确定',
                    });
                } else {
                    this.deleteConfirm();
                }
            },
            // 编辑事件
            edit(row) {
                this.editData = {
                    id:row.id,
                    userId:row.userId,
                    username:row.username,
                    realName:row.realName,
                    accountType:row.accountType,
                    orgId:row.orgId
                };
                this.operationType = "edit";
                this.editVisible = true;
            },
            // 删除确认
            deleteConfirm() {
                this.$confirm('您确定要删除数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //  请求后台删除数据
                    http.del('accounts', {
                        accountIds: this.accountIds,
                        userIds: this.userIds
                    }).then((ret)=>{
                        if(ret.httpCode === 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });   
                            this.initData({state:this.state});
                        } else {
                            this.$message({
                                type: 'error',
                                message: ret.message
                            });   
                        }
                    });
                  
                })
            },
            // 表单重置
            resetForm(formName){
                this.$refs[formName].resetFields();
                this.$refs[formName].clearValidate();
                this.editVisible = false;
            },
            // 表单提交
            submit(formName){
                 this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editVisible = false;
                        if (this.operationType === 'edit') {
                            //  修改数据库
                            http.put('account', this.editData).then((ret)=>{
                                if(ret.httpCode === 200){
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });   
                                    this.initData({state:this.state});
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: ret.message
                                    });   
                                }
                            });
                        } else if (this.operationType === 'add'){
                            // let params = `username=${this.editData.username}&accountType=${this.editData.accountType}&realName=${this.editData.realName}
                            //     &orgId=${this.editData.orgId}`;
                            let params = {
                                username: this.editData.username,
                                accountType: this.editData.accountType,
                                realName: this.editData.realName,
                                orgId: this.editData.orgId
                            };
                            http.post('account', params).then((ret)=>{
                                if(ret.httpCode === 200){
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });

                                    this.initData({state:this.state});
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
            },
            // 启用/禁用
            updateState(id, state){
                http.put('account', {
                    id: id,
                    state: state
                }).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.$message({
                            type: 'success',
                            message: '状态修改成功！'
                        });   
                        this.initData({state:this.state});
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });   
                    }
                });
            }
        },
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 13px;
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
    .container{
        margin-top: 10px;
    }
</style>
