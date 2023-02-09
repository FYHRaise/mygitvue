<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
            <el-form-item label="班级名称">
                <el-input v-model="query.clname" placeholder="请输入班级名称"></el-input>
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
                :data="cla"
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
                    prop="cno"
                    label="编号"
            >
            </el-table-column>
            <el-table-column
                    prop="clname"
                    label="班级名称"
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
            <el-form ref="classForm" :model="classForm" :rules="rules">
                <el-form-item v-if="classForm.cno != ''" label="班级编号" :label-width="formLabelWidth" prop="cno" style="width: 400px">
                    <el-input readonly v-model="classForm.cno" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="班级名称" :label-width="formLabelWidth" prop="clname" style="width: 400px">
                    <el-input v-model="classForm.clname" autocomplete="on"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCla">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ClassList",
        data(){
            return{
                query:{
                    clname:"",
                    page:1,
                    limit:10,
                },
                cla:[],
                total:0,
                classList:[],
                dialogFormVisible:false,
                classForm:{
                    cno:'',
                    clname:'',
                },
                formLabelWidth:'50px',
                selectionItems:[],
                titles:''
            }
        },
        methods:{
            getCla(){
                this.$http.post("/getAllCla",this.query).then(res=>{
                    this.cla = res.data.data
                    this.total = res.data.count
                })
            },
            search(){
                this.query.page=1
                this.getCla()
            },
            handleSizeChange(val) {
                this.query.limit=val;
                this.getCla()
            },
            handleCurrentChange(val) {
                this.query.page=val;
                this.getCla()
            },
            add(){
                this.dialogFormVisible=true
                this.titles="新增班级"

                if (this.$refs["classForm"] != null) {
                    this.$refs["classForm"].resetFields()
                }

                this.classForm={
                    cno:'',
                    clname:'',
                }
            },
            saveCla(){
                this.$refs["classForm"].validate(valid=>{

                    if (valid){
                        let url = '/updateClass'
                        let msg = '修改'

                        if (this.classForm.cno==''){
                            url='/addClass'
                            msg='新增'
                        }

                        this.$http.post(url,this.classForm).then((res)=>{
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
                this.titles="修改班级信息"

                if (this.$refs["classForm"] != null) {
                    this.$refs["classForm"].resetFields()
                }

                this.classForm=selections[0]
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
                        arr.push(selection[i].cno)
                    }
                    this.$http.post("/delClass",arr).then(res=>{
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