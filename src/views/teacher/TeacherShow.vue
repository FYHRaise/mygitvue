<template>
    <div>
        <el-form :label-position="labelPosition" label-width="80px" :model="adminForm">
            <el-form-item label="账号名称">
                <el-input v-model="teacherForm.tname" style="width: 300px" readonly></el-input>
            </el-form-item>
            <el-form-item label="班级">
                <el-select v-model="teacherForm.cno" placeholder="请选择班级" style="width: 300px">
                    <el-option v-for="cl in classList"  :label="cl.clname" :value="cl.cno" disabled></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="updPwd">修改密码</el-button>
        </el-form>
        <el-dialog :title="titles" :visible.sync="dialogFormVisible" width="25%">
            <el-form ref="pwdForm" :model="pwdForm" :rules="rules">
                <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldPassword" style="width: 80%">
                    <el-input v-model="pwdForm.oldPassword" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword" style="width: 80%">
                    <el-input v-model="pwdForm.newPassword" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="newPassword2" style="width: 80%">
                    <el-input v-model="pwdForm.newPassword2" autocomplete="on"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updPassword">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TeacherShow",
        data() {
            const validateNewPassword = (rule,value,callback)=>{
                if (value === this.pwdForm.oldPassword){
                    callback(new Error("新密码不能与原密码相同！"));
                }else {
                    callback();
                }
            };
            const validateNewPassword2 = (rule,value,callback)=>{
                if (value !== this.pwdForm.newPassword){
                    callback(new Error("两次输入密码不一致！"));
                }else {
                    callback();
                }
            };
            const validateOldPassword=(rule,value,callback)=>{
                if (value !== this.teacherForm.pwd){
                    callback(new Error("与原密码不一致！"))
                } else {
                    callback();
                }
            }

            return {
                classList:[],
                labelPosition: 'right',
                teacherForm: {
                    tid: '',
                    tname: '',
                    cno:'',
                    pwd:''
                },
                teacher: [],
                name: '',
                dialogFormVisible:false,
                titles:"修改密码",
                pwdForm:{
                    id:'',
                    oldPassword:'',
                    newPassword:'',
                    newPassword2:''
                },
                rules: {
                    oldPassword: [
                        {required:true, message: '请输入密码', trigger: 'blur'},
                        { validator: validateOldPassword,  trigger: 'blur' }
                    ],
                    newPassword: [
                        {required:true, message: '请输入密码', trigger: 'blur'},
                        { validator: validateNewPassword,trigger: 'blur' }
                    ],
                    newPassword2: [
                        {required:true, message: '请输入密码', trigger: 'blur'},
                        { validator: validateNewPassword2,trigger: 'blur' }
                    ],
                },
            }
        },
        methods: {
            getTeacher(){
                this.teacherForm.tname = sessionStorage.getItem("uname")

                this.$http.post("/getTea", this.teacherForm).then(res => {
                    this.teacher = res.data
                    this.teacherForm = this.teacher[0]
                })
            },
            updPwd(){
                this.dialogFormVisible = true
            },
            updPassword(){
                this.$refs["pwdForm"].validate(valid=>{
                    if (valid){
                        this.pwdForm.id = this.teacherForm.tid
                        this.$http.post("/updTeacherPassword",this.pwdForm).then(res => {
                            if (res.data == "success") {
                                this.$message.success("修改成功")
                            } else {
                                this.$message.error("修改失败")
                            }
                            this.dialogFormVisible = false;
                        })
                        debugger
                    }
                })
            },
            getAllClass(){
                this.$http.post("/geAllClass").then(res=>{
                    this.classList = res.data
                }).catch(()=>{
                    this.$message.error("信息加载失败，请联系管理员")
                })
            }
        },
        created() {
            this.getTeacher()
            this.getAllClass()
        }
    }
</script>

<style scoped>

</style>