<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>资源分配</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" ref="container">
            <div class="role_filter">
                <p  class="role_title">选择角色：</p>
                <el-select v-model="selectedRoleId" placeholder="请选择" style="width:250px" @change="roleChange">
                    <el-option
                        v-for="item in roleData"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="role_trans">
                <p class="role_title">选择需要分配的资源列表：</p>
                <el-transfer
                    style="text-align: left; display: inline-block"
                    v-model="assignRes"
                    filterable
                    :render-content="renderFunc"
                    :titles="['未分配', '已分配']"
                    :button-texts="['取消', '分配']"
                    :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                    }"
                    :props="{
                        key: 'id',
                        label: 'resName',
                    }"
                    @change="handleChange"
                    :data="resData"
                    >
                </el-transfer>
            </div>
        </div>
    </div>    
</template>

<script>
    import http from '@util/http';
    export default {
        name: 'resAssignment',
        data() {
            return {
                selectedRoleId: '', // 当前选中的角色ID
                resData: [],
                roleData: [],
                assignRes: [],
                renderFunc(h, option) {
                    return <span>{ option.resName }</span>;
                }
            };
        },
        created() {
            this.initData();
        },
        computed: {
          
        },
        // 页面高度控制
        mounted () {
            // let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            // this.$refs.container.style.height = '680px';  
        },
        methods: {
            // 初始化数据
            initData() {
                // 请求角色数据
                http.get('allRoles',{}).then((res)=>{
                    this.roleData = res.data;
                });
            },
            handleChange(value, direction, movedKeys) {
                if (this.selectedRoleId === ''){
                    this.$alert('请选择需要分配的角色！', '警告', {
                        confirmButtonText: '确定',
                    });
                } else {
                    // 取消分配事件
                    if (direction === 'left') {
                        del("roleRes", {
                            roleId: this.selectedRoleId,
                            resIds: movedKeys
                        }).then((res)=>{
                           if (res.httpCode === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '取消分配成功！'
                                });  
                           } else {
                                this.$message({
                                    type: 'error',
                                    message: '取消分配失败！'
                                });  
                           }
                        });
                    } else if (direction === 'right') {
                        // let params = `roleId=${this.selectedRoleId}&resIds=${movedKeys}`;
                        let params = {
                            roleId: this.selectedRoleId,
                            resIds: movedKeys
                        };
                        http.post("roleRes", params).then((res)=>{
                            if (res.httpCode === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '取消分配成功！'
                                });  
                           } else {
                                this.$message({
                                    type: 'error',
                                    message: '取消分配失败！'
                                });  
                           }
                        });
                    }
                }
               
            },
            // 下拉框改变事件，在选择角色时，加载资源数据
            roleChange(value){
               this.selectedRoleId = value;
                // 请求所有资源数据
                http.get('allRes', {}).then((res)=>{
                    this.resData = res.data;
                });
                // 请求相关role对象的资源
                http.get('getResByRoleId',{
                    roleId: value
                }).then((res)=>{
                    if(res.httpCode === 501){
                        this.assignRes = [];
                    } else {
                        this.assignRes = res.data;
                    }
                });
            }
        }
  };
</script>

<style>
.el-transfer-panel__body, .el-transfer-panel__list.is-filterable{
    height: 580px;
}
.container{
    margin-top: 10px;
}

</style>