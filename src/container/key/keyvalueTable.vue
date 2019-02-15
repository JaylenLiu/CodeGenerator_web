<template>
    <div class="table">
        <div>
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="base_btn handle-del mr10"
                    @click="delAll">批量删除
                </el-button>
                <el-input v-model="searchKey" placeholder="请输入键值名称" class="handle-input mr10" style="width:200px;"></el-input>
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
                    style="float:right !important"
                    @click="add">新增
                </el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="keyvalue" label="键值名称"></el-table-column>
                 <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="90"></el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button class="han_btn" size="small" type="text" @click="edit(scope.row)">编辑</el-button>
                        <el-button class="han_btn" size="small" type="text" @click="deleteConfirm(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

         <!-- 编辑弹出框 -->
        <el-dialog :title="operationType" :visible.sync="editVisible" width="500px">
            <el-form ref="keyvalueForm"  :model="editData" label-width="100px" :rules="rules">
                <el-form-item label="键值名称" prop="keyvalue">
                    <el-input class="handle-input mr10" v-model="editData.keyvalue"></el-input>
                </el-form-item>  
                 <el-form-item label="描述" prop="description">
                    <el-input class="handle-input mr10" v-model="editData.description"></el-input>
                </el-form-item>   
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit('keyvalueForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import http from '@util/http';
    export default {
        name: 'keyvalueTable',
        data() {
            return {
                operationType: '', // 操作类型，编辑，新增
                editData:{  // 弹出框绑定的数据
                    keyvalue: '',
                    description:''
                }, 
                editVisible: false, // 是否展示编辑框
                // tableData: [], // 表格数据
                searchKey: '', // 查询关键字
                multipleSelection: [], // 多选id
                rules: {
                    keyvalue: [
                        { required: true, message: '请输入键值名称', trigger: 'blur' }
                    ],
                }
            }
        },
        created() {
            this.initData({
                keynameId:this.keynameId
            });
        },
        computed: {
            tableData(){
                return this.$store.state.key.keyvalues;
            },
            keynameId(){
                return this.$store.state.key.keynameId;
            }
        },
        methods: {
            // 初始化数据
            initData(params) {
                // 请求后台数据
                http.get('keyValuesByKeynameId', params).then((ret)=>{
                    if (ret.httpCode == 200) {
                        this.$store.dispatch('saveKeyvalues', ret.data);
                    } else {
                        this.$store.dispatch('saveKeyvalues', []);
                    }
                });
            },
           
            // 查询事件
            search() {
                this.initData({
                    keynameId:this.keynameId,
                    searchKey:this.searchKey
                });
            },
            // 新增事件
            add(){
                if (!this.keynameId) {
                    this.$alert('请先选择左边的节点！', '警告', {
                        confirmButtonText: '确定',
                    });
                } else {
                    this.editData = {
                        keynameId:this.keynameId,
                        keyvalue: '',
                        description:'',
                    };
                    this.operationType = "新增";
                    this.editVisible = true;
                }
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
                    keyvalue: row.keyvalue,
                    description: row.description,
                };
                this.operationType = "编辑";
                this.editVisible = true;
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
                    http.del('keyvalues', {ids:ids}).then((ret)=>{
                        if(ret.httpCode === 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });   
                            this.initData({
                                keynameId:this.keynameId,
                                searchKey:this.searchKey
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: ret.message
                            });   
                        }
                    });
                });
            },
            // 表单提交
            submit(formName){
                 this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editVisible = false;
                        if (this.operationType === '编辑') {
                            //  修改数据库
                            http.put('keyvalue', this.editData).then((ret)=>{
                                
                                if(ret.httpCode === 200){
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功！'
                                    });   
                                    this.initData({
                                        keynameId:this.keynameId,
                                        searchKey:this.searchKey
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: ret.message
                                    });   
                                }
                            });
                        } else if (this.operationType === '新增'){
                            // let params = `keyvalue=${this.editData.keyvalue}&keynameId=${this.editData.keynameId}&description=${this.editData.description}`;
                            let params = {
                                keyvalue: this.editData.keyvalue,
                                keynameId: this.editData.keynameId,
                                description: this.editData.description
                            };
                            http.post('keyvalue', params).then((ret)=>{
                                if(ret.httpCode === 200){
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });

                                    this.initData({
                                        keynameId:this.keynameId,
                                        searchKey:this.searchKey
                                    });
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
