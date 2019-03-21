<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">Code Generator</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img src="static/img/img.jpg"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided  command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog :visible.sync="editVisible" title="修改密码" width="500px">
            <el-form ref="passwordForm"  :model="editData" label-width="120px" :rules="rules">
                <el-form-item label="原密码" prop="password">
                    <el-input class="handle-input mr10" v-model="editData.password" placeholder="请输入原密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input class="handle-input mr10" v-model="editData.newPassword" placeholder="请输入新密码" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="再次输入新密码" prop="newPassword_again">
                    <el-input class="handle-input mr10" v-model="editData.newPassword_again" placeholder="请输入新密码" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('passwordForm')">取 消</el-button>
                <el-button type="primary" @click="submit('passwordForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import http from '@util/http';
    export default {
        data() {
            // 验证第二次密码是否正确
            var validatePassword_again = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码！'));
                } else if (value != this.editData.newPassword) {
                    callback(new Error('两次密码不一致！'));
                } else {
                    callback();
                }
            };
            // 验证原密码是否正确
            var validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入原密码！'));
                } else if (value != localStorage.getItem('password')) {
                    callback(new Error('原密码输入错误!'));
                } else {
                    callback();
                }
            };
            return {
                collapse: false,
                fullscreen: false,
                // name: 'admin',
                message: 2,
                editData:{
                    password:'',
                    newPassword:'',
                    newPassword_again:'',
                },
                editVisible:false,
               
                rules: {
                    password: [
                        { required: true, validator: validatePassword, trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                    newPassword_again: [
                        { required: true, validator: validatePassword_again , trigger: 'blur' }
                    ],
                
                },
            }
        },
        computed:{
            username(){
                return sessionStorage.getItem('realname');
            }
        },
        methods:{

            // 修改密码提交事件
            submit(formName){
                http.put('changePassword', {newPassword: this.editData.newPassword}).then((ret)=>{
                    if(ret.httpCode === 200){
                        this.$message({
                            type: 'success',
                            message: '修改密码成功！'
                        });   
                        this.$router.push("/login");
                    } else {
                        this.$message({
                            type: 'error',
                            message: ret.message
                        });   
                    }
                });
            },
             // 表单重置
            resetForm(formName){
                this.$refs[formName].resetFields();
                this.editVisible = false;
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem("username");
                    localStorage.removeItem("password");
                    localStorage.removeItem("realname");
                    this.$router.push('/login');
                } else if (command == 'changePassword') {
                    this.editVisible = true;
                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        font-size: 18px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 50px;
    }
    .header .logo{
        float: left;
        width:250px;
        line-height: 50px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 50px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
