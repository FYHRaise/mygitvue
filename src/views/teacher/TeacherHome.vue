<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <h4>金桥幼儿请假管理系统</h4>
                <h5>老师界面</h5>
                <el-menu
                        :default-active="activeMenu"
                        class="el-menu-vertical-demo"
                        :router="true"
                        @open="handleOpen"
                        @close="handleClose">
                    <el-menu-item index="/teacherFirst">
                        <i class="el-icon-setting"></i>
                        <span slot="title">老师首页</span>
                    </el-menu-item>
                    <el-menu-item index="/teacherLeave">
                        <i class="el-icon-setting"></i>
                        <span slot="title">本班学生请假信息</span>
                    </el-menu-item>
                    <el-menu-item index="/children">
                        <i class="el-icon-setting"></i>
                        <span slot="title">本班学生信息</span>
                    </el-menu-item>
                    <el-menu-item index="/teacherShow">
                        <i class="el-icon-setting"></i>
                        <span slot="title">查看个人信息</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>欢迎你：{{uname}}
                    <el-button type="danger" @click="logout">登出账号</el-button>
                </el-header>
                <el-main><router-view></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "TeacherHome",
        data(){
            return{
                uname : sessionStorage.getItem("uname"),
                activeMenu:this.$route.path
            }
        },
        methods:{
            logout(){
                sessionStorage.clear()
                this.$router.push({path:'/'})
            }
        }
    }
</script>

<style scoped>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: right;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        height: 1000px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 20px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }
</style>