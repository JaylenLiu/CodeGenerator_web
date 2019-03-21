<template>
    <div class="login-wrap">
        <div class="ms-title">Code Generator</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import http from '@util/http';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            
            if (this.$route.query.message) {
                this.$message({
                    showClose: true,
                    message: this.$route.query.message,
                    type: 'warning'
                });
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // let params = `username=${this.ruleForm.username}&password=${this.ruleForm.password}`;
                        let params = {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        };
                        http.post("login", params).then((res)=>{
                            if(res.httpCode === 200){
                                // this.$store.dispatch('login',res.data);  
                                localStorage.setItem("username", this.ruleForm.username);
                                localStorage.setItem("realname", res.data.realname);
                                localStorage.setItem("password", this.ruleForm.password);
                                if (this.$route.query.path) {
                                    this.$router.push(this.$route.query.path);
                                } else {
                                    this.$router.push("/");
                                }
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: res.message,
                                    type: 'error'
                                });
                            }
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '输入有误，请重新输入',
                            type: 'error'
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>