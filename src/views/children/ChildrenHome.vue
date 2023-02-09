<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <el-upload
                        class="avatar-uploader"
                        action="#"
                        :http-request="uploadImg"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <el-avatar :size="150" :src="childrenUrl"></el-avatar>
                </el-upload>
                <h4>金桥幼儿请假管理系统</h4>
                <h5>幼儿界面</h5>
                <el-menu
                        :default-active="activeMenu"
                        class="el-menu-vertical-demo"
                        :router="true"
                        @open="handleOpen"
                        @close="handleClose">
                    <el-menu-item index="/childrenFirst">
                        <i class="el-icon-setting"></i>
                        <span slot="title">学生首页</span>
                    </el-menu-item>
                    <el-menu-item index="/childrenLeave">
                         <i class="el-icon-setting"></i>
                         <span slot="title">学生请假</span>
                    </el-menu-item>
                    <el-menu-item index="/parentsList">
                          <i class="el-icon-setting"></i>
                          <span slot="title">家长信息</span>
                    </el-menu-item>
                    <el-menu-item index="/childrenShow">
                           <i class="el-icon-setting"></i>
                           <span slot="title">查看个人信息</span>
                    </el-menu-item>
                    </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <div>
                        欢迎你：{{uname}}
                        <el-button type="danger" @click="logout">登出账号</el-button>
                        <!--<el-avatar :size="50" :src="childrenUrl"></el-avatar>-->
                    </div>
                </el-header>
                <el-main><router-view></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "ChildrenHome",
    data(){
        return{
            uname : sessionStorage.getItem("uname"),
            activeMenu:this.$route.path,
            childrenUrl:"",
            query:{
                cname : sessionStorage.getItem("uname"),
            }
        }
    },
    methods:{
        logout(){
            sessionStorage.clear()
            this.$router.push({path:'/'})
        },
        getChildrenUrl(){
            this.$http.post("/selectImg"+"/"+this.uname).then(res =>{
                this.childrenUrl = this.$http.defaults.baseURL +"/"+ res.data
            }).catch(()=>{
            })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt1M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt1M) {
                this.$message.error('上传头像图片大小不能超过 1MB!');
            }
            return isJPG && isLt1M;
        },
        uploadImg(item){
            let param = new FormData();
            param.append("image",item.file)
            this.$http.post("/uploadImg"+"/"+this.uname,param).then(res =>{
                this.childrenUrl = this.$http.defaults.baseURL+  res.data
            }).catch(()=>{

            })
        }
    },
    created() {
        this. getChildrenUrl()
    }
    }
</script>

<style scoped>
    .el-header, .el-footer {
        background-color: #349cd1;
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