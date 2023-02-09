<template>
    <div>
        <el-form :label-position="labelPosition" label-width="80px" :model="childrenForm">
            <el-form-item label="姓名">
                <el-input v-model="childrenForm.cname" style="width: 300px" readonly></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio v-model="childrenForm.sex" label="男" disabled>男</el-radio>
                <el-radio v-model="childrenForm.sex" label="女" disabled>女</el-radio>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker
                        style="width: 300px"
                        v-model="childrenForm.birthday"
                        type="date"
                        placeholder="选择日期"
                        clearable
                        format="yyyy年M月d日"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="班级">
                <el-select v-model="childrenForm.cno" placeholder="请选择班级" style="width: 300px">
                    <el-option v-for="cl in classList"  :label="cl.clname" :value="cl.cno" disabled></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="upd">修改个人信息</el-button>
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
        name: "ChildrenShow",
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
            if (value !== this.childrenForm.pwd){
                callback(new Error("与原密码不一致！"))
            } else {
                callback();
            }
        }

        return {
            labelPosition: 'right',
            childrenForm: {
                cid: '',
                cname: sessionStorage.getItem("uname"),
                cno: '',
                sex:'',
                birthday:'',
                pwd:""
            },
            children: [],
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
        getChildren() {
            this.childrenForm.cname = sessionStorage.getItem("uname")
            this.$http.post("/getChild", this.childrenForm).then(res => {
                this.children = res.data
                this.childrenForm = this.children[0]
            })
        },
        getAllClass(){
            this.$http.post("/geAllClass").then(res=>{
                this.classList = res.data
            }).catch(()=>{
                this.$message.error("信息加载失败，请联系管理员")
            })
        },
        upd() {
            this.$http.post("/updChild", this.childrenForm).then((res) => {
                if (res.data == "success") {
                    this.$message.success("修改成功")
                } else {
                    this.$message.error("修改失败")
                }
                this.getChildren()
            })
        },
        updPwd(){
            this.dialogFormVisible = true
        },
        updPassword(){
            this.$refs["pwdForm"].validate(valid=>{
            if (valid){
                this.pwdForm.id = this.childrenForm.cid
                this.$http.post("/updChildPassword",this.pwdForm).then(res => {
                    if (res.data == "success") {
                        this.$message.success("修改成功")
                    } else {
                        this.$message.error("修改失败")
                    }
                    this.dialogFormVisible = false
                })
            }
        })
        }
        },
    created() {
        this.getAllClass()
        this.getChildren()
    }
    }
</script>

<style scoped>

</style>