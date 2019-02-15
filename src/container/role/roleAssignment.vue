<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>角色分配</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" ref="container">
            <div class="role_filter">
                <p class="role_title">选择角色：</p>
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
                <p class="role_title">选择需要分配的账号列表：</p>
                <el-transfer
                    v-model="assignAccount"
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
                        label: 'username',
                    }"
                    @change="handleChange"
                    :data="accountData"
                >
                </el-transfer>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
    import http from '@util/http';
    export default {
        name: 'roleAssignment',
        data() {
            return {
                selectedRoleId: '', // 当前选中的角色ID
                accountData: [], // 所有的账号数据
                roleData: [], // 所有的角色数据
                assignAccount: [], // 已分配账号
                renderFunc(h, option) {
                    return <span>{option.username}</span>;
                }
            };
        },
        created() {
            this.initData();
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
                        http.del("roleAccount", {
                            roleId: this.selectedRoleId,
                            accountIds: movedKeys
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
                        // let params = `roleId=${this.selectedRoleId}&accountIds=${movedKeys}`;
                        let params = {
                            roleId: this.selectedRoleId,
                            accountIds: movedKeys
                        };
                        http.post("roleAccount", params).then((res)=>{
                            if (res.httpCode === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '分配成功！'
                                });  
                           } else {
                                this.$message({
                                    type: 'error',
                                    message: '分配失败！'
                                });  
                           }
                        });
                    }
                }
               
            },
            // 下拉框改变事件，在选择角色时，加载账号信息
            roleChange(value){
               this.selectedRoleId = value;

                // 请求所有账号数据
                http.get('allAccounts', {}).then((res)=>{
                    this.accountData = res.data;
                });
                // 请求相关role对象的资源
                http.get('getAccountByRoleId',{
                    roleId: value
                }).then((res)=>{
                    if(res.httpCode === 500){
                        this.assignAccount = [];
                    } else {
                        this.assignAccount = res.data;
                    }
                });
            }
        }
  };
</script>

<style>
.container{
    margin-top: 10px;
}
.role_title{
    font-size: 12px;
    line-height: 35px;
    color: #555;
}
.role_filter{
    margin-bottom: 10px;
}
.role_filter, .role_trans{
    margin-left: 20px;
}
</style>
