<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
            <el-form-item label="姓名">
                <el-input v-model="query.pname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="请输入与学生的关系">
                <el-input v-model="query.relationship" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="primary" @click="upd">修改</el-button>
                <el-button type="danger" @click="del">删除</el-button>
            </el-form-item>
        </el-form>
        <el-table
                ref="multipleTable"
                :data="parents"
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
                    prop="pid"
                    label="编号"
            >
            </el-table-column>
            <el-table-column
                    prop="pname"
                    label="姓名"
            >
            </el-table-column>
            <el-table-column
                    prop="relationship"
                    label="关系"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号码"
            >
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
            <el-form ref="parentsForm" :model="parentsForm" :rules="rules">
                <el-form-item v-if="parentsForm.pid != ''" label="家长编号" :label-width="formLabelWidth" prop="tid" style="width: 400px">
                    <el-input readonly v-model="parentsForm.pid" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="幼儿姓名" :label-width="formLabelWidth" prop="cname" style="width: 400px">
                    <el-input v-model="parentsForm.cname" autocomplete="on" readonly></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="pname" style="width: 400px">
                    <el-input v-model="parentsForm.pname" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="关系" :label-width="formLabelWidth" prop="relationship" style="width: 400px">
                    <el-input v-model="parentsForm.relationship" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone" style="width: 400px">
                    <el-input v-model="parentsForm.phone" autocomplete="on"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveParents">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ParentsList",
        data(){
            return{
                query:{
                    pname:"",
                    relationship:"",
                    cname:sessionStorage.getItem("uname"),
                    page:1,
                    limit:10,
                },
                parents:[],
                total:0,
                dialogFormVisible:false,
                parentsForm:{
                    pid:'',
                    pname:'',
                    relationship:'',
                    cid:'',
                    phone:'',
                    cname:sessionStorage.getItem("uname"),
                },
                formLabelWidth:'50px',
                selectionItems:[],
                titles:'',
                rules:{
                    pname:[
                        {required:true,message:"家长姓名不能为空",trigger:"chang"}
                    ],
                    relationship:[
                        {required:true,message:"关系不能为空",trigger:"change"}
                    ],
                    phone:[
                        {required:true,message:"手机号码不能为空",trigger:"change"}
                    ],
                },
            }
        },
        methods:{
            getAllParents(){
                this.$http.post("/getAllParents",this.query).then(res=>{
                    this.parents = res.data.data
                    this.total = res.data.count
                })
            },search(){
                this.query.page=1
                this.getAllParents()
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
                this.titles="新增家长"

                if (this.$refs["parentsForm"] != null) {
                    this.$refs["parentsForm"].resetFields()
                }

                this.parentsForm={
                    pid:'',
                    pname:'',
                    relationship:'',
                    cid:'',
                    phone:'',
                    cname:sessionStorage.getItem("uname")
                }
            },
            saveParents(){
                this.$refs["parentsForm"].validate(valid=>{

                    if (valid){
                        let url = '/updParents'
                        let msg = '修改'

                        if (this.parentsForm.pid==''){
                            url='/addParents'
                            msg='新增'
                        }

                        this.$http.post(url,this.parentsForm).then((res)=>{
                            debugger
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
                this.titles="修改家长信息"

                if (this.$refs["parentsForm"] != null) {
                    this.$refs["parentsForm"].resetFields()
                }
                this.parentsForm={
                    pid:'',
                    pname:'',
                    relationship:'',
                    cid:'',
                    phone:'',
                    cname:sessionStorage.getItem("uname")
                }
                this.parentsForm=selections[0]
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
                        arr.push(selection[i].pid)
                    }
                    this.$http.post("/delParents",arr).then(res=>{
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
            selectRow(selection,row){
                this.selectionItems = selection
            },
            selectAll(selection){
                this.selectionItems = selection
            }
        },
        created() {
            this.search()
        }
    }
</script>

<style scoped>

</style>