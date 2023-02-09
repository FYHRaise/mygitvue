<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
            <el-form-item label="姓名">
                <el-input v-model="query.tname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="班级">
                <el-select v-model="query.cno" placeholder="请选择班级" clearable>
                    <el-option v-for="cl in classList"  :label="cl.clname" :value="cl.cno"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="primary" @click="upd">修改</el-button>
                <el-button type="danger" @click="del">删除</el-button>
                <el-button type="danger" @click="reset">重置密码</el-button>
            </el-form-item>
        </el-form>
        <el-table
                ref="multipleTable"
                :data="teacher"
                tooltip-effect="dark"
                style="width: 100%"
                height="500px"
                @select="selectRow"
                @select-all="selectAll">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="tid"
                    label="编号"
            >
            </el-table-column>
            <el-table-column
                    prop="tname"
                    label="姓名"
            >
            </el-table-column>
            <el-table-column
                    prop="clname"
                    label="班级"
                    show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="query.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <el-dialog :title="titles" :visible.sync="dialogFormVisible" width="25%">
            <el-form ref="teacherForm" :model="teacherForm" :rules="rules">
                <el-form-item v-if="teacherForm.tid != ''" label="老师编号" :label-width="formLabelWidth" prop="tid" style="width: 400px">
                    <el-input readonly v-model="teacherForm.tid" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="tname" style="width: 400px">
                    <el-input v-model="teacherForm.tname" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="班级" :label-width="formLabelWidth" prop="cno" style="width: 400px">
                    <el-select v-model="teacherForm.cno" placeholder="请选择班级" clearable style="width: 100%">
                        <el-option v-for="cl in classList"  :label="cl.clname" :value="cl.cno"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTeacher">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TeacherList",
        data(){
            return{
                query:{
                    tname:"",
                    cno:"",
                    page:1,
                    limit:10,
                },
                teacher:[],
                total:0,
                classList:[],
                dialogFormVisible:false,
                teacherForm:{
                    tid:'',
                    tname:'',
                    cno:'',
                },
                formLabelWidth:'50px',
                selectionItems:[],
                titles:'',
                rules:{
                    tname:[
                        {required:true,message:"老师姓名不能为空",trigger:"blur"}
                    ],
                    cno:[
                        {required:true,message:"班级不能为空",trigger:"change"}
                    ]
                },
            }
        },
        methods:{
            getTeacher(){
                this.$http.post("/getTeacher",this.query).then(res=>{
                    this.teacher = res.data.data
                    this.total = res.data.count
                })
            },
            getAllClass(){
                this.$http.post("/geAllClass").then(res=>{
                    this.classList = res.data
                }).catch(()=>{
                    this.$message.error("信息加载失败，请联系管理员")
                })
            },
            search(){
                this.query.page=1
                this.getTeacher()
            },
            handleSizeChange(val) {
                this.query.limit=val;
                this.getTeacher()
            },
            handleCurrentChange(val) {
                this.query.page=val;
                this.getTeacher()
            },
            add(){
                this.dialogFormVisible=true
                this.titles="新增老师"

                if (this.$refs["teacherForm"] != null) {
                    this.$refs["teacherForm"].resetFields()
                }

                this.teacherForm={
                    tid:'',
                    tname:'',
                    cno:'',
                }
            },
            saveTeacher(){
                this.$refs["teacherForm"].validate(valid=>{

                    if (valid){
                        let url = '/updateTeacher'
                        let msg = '修改'

                        if (this.teacherForm.tid==''){
                            url='/addTeacher'
                            msg='新增'
                        }

                        this.$http.post(url,this.teacherForm).then((res)=>{
                            if (res.data=="success"){
                                this.$message.success(msg+"成功")
                            }else {
                                this.$message.error(msg+"失败")
                            }
                            this.dialogFormVisible=false
                            this.search()
                        }).catch(()=>{
                            this.$message.error(msg+"失败,请联系管理员")
                        })
                    }

                })
            },
            upd(){
                let selections = this.selectionItems
                if (selections.length != 1){
                    this.$message.warning("请选择一条数据")
                    return
                }
                this.dialogFormVisible = true
                this.titles="修改老师信息"

                if (this.$refs["teacherForm"] != null) {
                    this.$refs["teacherForm"].resetFields()
                }

                this.teacherForm=selections[0]
            },
            del(){
                let selection = this.selectionItems
                if (selection.length==0){
                    this.$message.error("请至少选择一条数据")
                    return
                }
                this.$confirm('此操作不可逆，请谨慎选择','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'}).then(()=>{
                    let arr = [];

                    for (let i = 0;i<selection.length;i++){
                        arr.push(selection[i].tid)
                    }
                    this.$http.post("/delTeacher",arr).then(res=>{
                        if (res.data=="success"){
                            this.$message.success("删除成功")
                            this.search()
                        }else {
                            this.$message.error("删除失败")
                        }
                        this.selectionItems=[]
                    }).catch(()=>{
                        this.$message.error("删除失败,请联系管理员")
                    })
                })
            },
            reset(){
                let selection = this.selectionItems
                if (selection.length==0){
                    this.$message.error("请至少选择一条数据")
                    return
                }
                this.$confirm('此操作不可逆，请谨慎选择','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'}).then(()=>{
                    let arr = [];

                    for (let i = 0;i<selection.length;i++){
                        arr.push(selection[i].tid)
                    }
                    this.$http.post("/resetTeacherPassword",arr).then(res=>{
                        if (res.data=="success"){
                            this.$message.success("重置密码成功")
                            this.search()
                        }else {
                            this.$message.error("重置密码失败")
                        }
                        this.selectionItems=[]
                    }).catch(()=>{
                        this.$message.error("重置密码失败,请联系管理员")
                    })
                })
            },
            selectRow(selection,row){
                this.selectionItems = selection
            },
            selectAll(selection){
                this.selectionItems = selection
            }
        },
        created() {
            this.search()
            this.getAllClass()
        }
    }
</script>

<style scoped>

</style>