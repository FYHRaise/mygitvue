<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <h4>金桥幼儿请假管理系统</h4>
                <h5>管理员界面</h5>
                    <el-menu
                            :default-active="activeMenu"
                            class="el-menu-vertical-demo"
                            :router="true"
                            @open="handleOpen"
                            @close="handleClose">
                        <el-menu-item index="/adminFirst">
                            <i class="el-icon-setting"></i>
                            <span slot="title">管理员首页</span>
                        </el-menu-item>
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>信息维护</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/childrenList">
                                    <i class="el-icon-setting"></i>
                                    <span slot="title">幼儿信息维护</span>
                                </el-menu-item>
                                <el-menu-item index="/teacherList">
                                    <i class="el-icon-setting"></i>
                                    <span slot="title">老师信息维护</span>
                                </el-menu-item>
                                <el-menu-item index="/classList">
                                    <i class="el-icon-setting"></i>
                                    <span slot="title">班级信息维护</span>
                                </el-menu-item>
                                <el-menu-item index="/leaveList">
                                    <i class="el-icon-setting"></i>
                                    <span slot="title">请假类型维护</span>
                                </el-menu-item>
                                <el-menu-item index="/cleaveList">
                                    <i class="el-icon-setting"></i>
                                    <span slot="title">查看本校请假信息</span>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>管理员信息维护</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/adminShow">
                                    <i class="el-icon-setting"></i>
                                    <span slot="title">查看管理员个人信息</span>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
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
        name: "HomeView",
    data(){
       /* const router = new VueRouter({
            routes
        })
        router.beforeEach((to,from,next) =>{
            let path = to.fullPath
            if (path == "/"){
                next()
                return
            }
            if (sessionStorage.getItem("uname") != null){
                next()
                return;
            }

            next("/")
        });*/
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