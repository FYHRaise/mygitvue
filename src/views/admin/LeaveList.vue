<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
            <el-form-item label="请假类型">
                <el-input v-model="query.lname" placeholder="请输入请假类型"></el-input>
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
                :data="leave"
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
                    prop="lid"
                    label="编号"
            >
            </el-table-column>
            <el-table-column
                    prop="lname"
                    label="请假类型"
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
            <el-form ref="leaveForm" :model="leaveForm" :rules="rules">
                <el-form-item v-if="leaveForm.lid != ''" label="请假类型编号" :label-width="formLabelWidth" prop="lid" style="width: 400px">
                    <el-input readonly v-model="leaveForm.lid" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="请假类型" :label-width="formLabelWidth" prop="lname" style="width: 400px">
                    <el-input v-model="leaveForm.lname" autocomplete="on"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveLeave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "LeaveList",
        data(){
            return{
                query:{
                    lname:"",
                    page:1,
                    limit:10,
                },
                leave:[],
                total:0,
                leaveList:[],
                dialogFormVisible:false,
                leaveForm:{
                    lid:'',
                    lname:'',
                },
                formLabelWidth:'50px',
                selectionItems:[],
                titles:''
            }
        },
        methods:{
            getLeave(){
                this.$http.post("/getAllLeave",this.query).then(res=>{
                    this.leave = res.data.data
                    this.total = res.data.count
                })
            },
            search(){
                this.query.page=1
                this.getLeave()
            },
            handleSizeChange(val) {
                this.query.limit=val;
                this.getLeave()
            },
            handleCurrentChange(val) {
                this.query.page=val;
                this.getLeave()
            },
            add(){
                this.dialogFormVisible=true
                this.titles="新增请假类型"

                if (this.$refs["leaveForm"] != null) {
                    this.$refs["leaveForm"].resetFields()
                }

                this.leaveForm={
                    lid:'',
                    lname:'',
                }
            },
            saveLeave(){
                this.$refs["leaveForm"].validate(valid=>{

                    if (valid){
                        let url = '/updateLeave'
                        let msg = '修改'

                        if (this.leaveForm.lid==''){
                            url='/addLeave'
                            msg='新增'
                        }

                        this.$http.post(url,this.leaveForm).then((res)=>{
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
                this.titles="修改请假类型"

                if (this.$refs["leaveForm"] != null) {
                    this.$refs["leaveForm"].resetFields()
                }

                this.leaveForm=selections[0]
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
                        arr.push(selection[i].lid)
                    }
                    this.$http.post("/delLeave",arr).then(res=>{
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