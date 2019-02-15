<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" ref="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="base_btn handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="searchKey" placeholder="请输入资源名称" class="handle-input mr10" style="width:200px;"></el-input>
                <el-button class="base_btn" type="primary" icon="el-icon-search" @click="search">搜索</el-button>   
                <el-button class="base_btn" icon="el-icon-circle-plus-outline" type="primary" style="float:right  !important" @click="add">新增资源</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <!-- <el-table-column type="index" label="序号"></el-table-column> -->
                <el-table-column prop="resName" label="资源名称" width="100"></el-table-column>
                <el-table-column prop="resPath" label="资源路径" width="130"></el-table-column>
                <!-- <el-table-column prop="resUrl" label="资源URL" width="250"></el-table-column> -->
                <!-- <el-table-column prop="icon" label="图标" width="100"></el-table-column> -->
                <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
                <el-table-column prop="updateTime" label="最近更新时间"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button
                            class="han_btn"
                            type="text"
                            size="small"
                            @click="edit(scope.row)">编辑
                        </el-button>
                        <el-button
                            class="han_btn"
                            type="text"
                            size="small"
                            @click="deleteConfirm(scope.row.id)">删除
                        </el-button>
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
            <el-form ref="resourceForm"  :model="editData" label-width="100px" :rules="rules" status-icon>
                <el-form-item label="资源名称" prop="resName">
                    <el-input class="handle-input mr10" v-model="editData.resName"></el-input>
                </el-form-item>
                <el-form-item label="父级资源名称">
                    <el-select placeholder="选择父级资源" v-model="editData.parentId" class="handle-input mr10">
                        <el-option
                            v-for="item in resData"
                            :key="item.id"
                            :label="item.resName"
                            :value="item.id">
                        </el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="资源路径" prop="resPath">
                    <el-input class="handle-input mr10" v-model="editData.resPath"></el-input>
                </el-form-item>
                 <!-- <el-form-item label="资源URL" prop="resUrl">
                    <el-input class="handle-input mr10" v-model="editData.resUrl"></el-input>
                </el-form-item> -->
                <el-form-item label="图标" prop="icon">
                    <el-input class="handle-input mr10" v-model="editData.icon" disabled></el-input>
                </el-form-item>
                 <el-form-item label="排序号" prop="sort">
                    <el-input-number class="handle-input mr10" v-model="editData.sort" :precision="1" :step="1"></el-input-number>
                    <!-- <el-input class="handle-input mr10" v-model="editData.sort"></el-input> -->
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit('resourceForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import http from '@util/http';
    export default {
        name: 'resource',
        data() {
            return {
                operationType: '', // 操作类型，edit:编辑，add:新增
                editData:{  // 弹出框绑定的数据
                    id:'',
                    parentId: -1,
                    resName:'',
                    resUrl:'',
                    resPath: '',
                    icon:'el-icon-menu',
                    sort:''
                }, 
                resData: [], // 资源数据
                editVisible: false, // 是否展示编辑框
                tableData: [], // 表格数据
                searchKey: '', // 查询关键字
                multipleSelection: [], // 多选id
                pageNum: 1, // 当前页码
                pageSize: 10, // 每页显示条数
                pages: 10, // 总页数
                rules: {
                    resName: [
                        { required: true, message: '请输入资源名称', trigger: 'blur' }
                    ],
                    resPath: [
                        { required: true, message: '请输入资源路径', trigger: 'blur' }
                    ],
                    resUrl: [
                        { required: true, message: '请输入资源url', trigger: 'blur' }
                    ],
                    icon: [
                        { required: true, message: '请选择图标', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.initData({});
        },
        mounted () {
            // let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            // this.$refs.container.style.height = '680px';   
        },
        computed: {
          
        },
        methods: {
            // 初始化数据
            initData(params) {
                // 向参数对象中加入分页信息
                Object.assign(params,{
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                });

                // 请求分页的资源数据
                http.get('resources', params).then((res)=>{
                    if (res.httpCode === 200) {
                        this.tableData = res.data;
                        this.pages = res.pages;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });  
                    }
                });
            },
            // 查询事件
            search() {
                this.initData({
                    searchKey:this.searchKey
                });
            },
            // 新增事件
            add(){
                this.editData = {
                    id:'',
                    parentId: -1,
                    resName:'',
                    resUrl:'',
                    resPath:'',
                    icon:'el-icon-menu',
                    sort:''
                };
                this.operationType = "add";
                this.editVisible = true;

                 // 请求所有的资源数据
                http.get('allRes', {}).then((res)=>{
                    if (res.httpCode === 200) {
                        this.resData= [{id:-1, resName:'请选择'}];
                        this.resData.push.apply(this.resData, res.data);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });  
                    }
                   
                });
            },
            // 分页事件 
            handlePageChange(currentPage){
                this.pageNum = currentPage;
                this.initData({
                    searchKey:this.searchKey
                });
            },
            // 多选事件
            handleSelectionChange(val) {
                let ids = val.map((row)=>{
                    return row.id;
                });
                this.multipleSelection = ids;
            },
            // 删除多条记录
            delAll() {
                const length = this.multipleSelection.length;
                if (length === 0) {
                    this.$alert('您未选择任何数据！', '警告', {
                        confirmButtonText: '确定',
                    });
                } else {
                    this.deleteConfirm(this.multipleSelection);
                }
            },
            // 编辑事件
            edit(row) {
                this.editData = {
                    id: row.id,
                    parentId: row.parentId ? row.parentId : -1,
                    resName: row.resName,
                    resUrl: row.resUrl,
                    resPath: row.resPath,
                    icon: row.icon,
                    sort: row.sort
                };
                this.operationType = "edit";
                this.editVisible = true;

                  // 请求所有的资源数据
                http.get('allRes', {}).then((res)=>{
                    if (res.httpCode === 200) {
                        this.resData= [{id:-1, resName:'请选择'}];
                        this.resData.push.apply(this.resData,res.data);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });  
                    }
                   
                });
            },
            // 删除确认
            deleteConfirm(param) {
                this.$confirm('您确定要删除数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    if(Array.isArray(param)){
                        ids = param;
                    } else {
                        ids.push(param);
                    }
                    //  请求后台删除数据
                    http.del('resources', {ids:ids}).then((ret)=>{
                        if(ret.httpCode === 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });   
                            this.initData({searchKey:this.searchKey});
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
            // 表单提交
            submit(formName){
                 this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editVisible = false;
                        if (this.operationType === 'edit') {
                            //  修改数据库
                            http.put('resource', this.editData).then((res)=>{
                                
                                if(res.httpCode === 200){
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });   
                                    this.initData({searchKey:this.searchKey});
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.message
                                    });   
                                }
                            });
                        } else if (this.operationType === 'add'){
                            // let params = `resName=${this.editData.resName}&resUrl=${this.editData.resUrl}&resPath=${this.editData.resPath}
                            //     &icon=${this.editData.icon}&sort=${this.editData.sort}&parentId=${this.editData.parentId}`;
                            let params = {
                                resName: this.editData.resName,
                                resUrl: this.editData.resUrl,
                                resPath: this.editData.resPath,
                                icon: this.editData.icon,
                                sort: this.editData.sort,
                                parentId: this.editData.parentId
                            };
                            http.post('resource', params).then((res)=>{
                                if(res.httpCode === 200){
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });

                                    this.initData({searchKey:this.searchKey});
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.message
                                    });   
                                }
                            });
                        }
                    }
                 });   
            },
        }
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
