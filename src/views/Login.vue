<template>
    <div>
        <h1 id="h1" ref="h1" style="margin-top: 50px;margin-bottom: 60px">登录</h1>
        <el-row>
            <el-col :span="8" :offset="8">
                <el-form ref="form" :rules="rules" :model="loginForm" label-width="80px">
                    <el-form-item label="用户名" prop="uname">
                        <el-input v-model="loginForm.uname" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-input v-model="loginForm.pwd" placeholder="请输入密码" show-password></el-input>
                    </el-form-item>
                    <!--<el-form-item label="身份" prop="user">
                    &lt;!&ndash;<el-radio-group v-model="loginForm.role">
                        <el-radio :label="1">管理员</el-radio>
                        <el-radio :label="2">老师</el-radio>
                        <el-radio :label="3">学生</el-radio>
                    </el-radio-group>&ndash;&gt;
                </el-form-item>-->
                    <el-button type="primary" @click="toLogin">登录</el-button>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                loginForm:{
                    uname:"",
                    pwd:"",
                    /*role:1*/
                },
                rules:{
                    uname:[
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    pwd:[
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    /*role: [
                        { required: true, message: '请选择身份', trigger: 'change' }
                    ]*/
                }
            }
        },
        methods:{
            toLogin(){
                this.$refs["form"].validate((valid)=>{
                    if (!valid){
                        return//结束方法
                    }
                })
                this.$http.post("/login",this.loginForm).then((res)=>{
                    if(res.data=="success1"){
                        /*this.$store.dispatch("setUname",this.loginForm.uname)*/
                        sessionStorage.setItem("uname",this.loginForm.uname)
                        //跳到主页面
                        this.$router.push("/home")
                    }else if (res.data=="success2") {
                        sessionStorage.setItem("uname",this.loginForm.uname)
                        //跳到主页面
                        this.$router.push("/teacherHome")
                    }else if (res.data=="success3") {
                        sessionStorage.setItem("uname",this.loginForm.uname)
                        //跳到主页面
                        this.$router.push("/childrenHome")
                    }
                    else {
                        this.$message.error('账号或密码错误');
                    }
                }).catch((e) => {
                        /*this.$message.error('账号或密码错误');*/
                })
            },
        }
    }
</script>

<style scoped>

</style>