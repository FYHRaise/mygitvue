<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
            <el-form-item label="姓名">
                <el-input v-model="query.cname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="开始日期" :label-width="formLabelWidth" prop="statrt" style="width: 400px">
                <el-date-picker
                        style="width: 100%"
                        v-model="query.statrt"
                        type="date"
                        placeholder="选择日期"
                        clearable
                        format="yyyy年M月d日"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" >查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="leaveList"
                border
                style="width: 100%">
            <el-table-column
                    fixed
                    prop="statrt"
                    label="请假日期"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="cname"
                    label="姓名"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="clname"
                    label="班级"
                    width="120px">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="end"
                    label="请假结束日期"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="day"
                    label="请假天数"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="relationship"
                    label="申请人"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="lname"
                    label="请假类型"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="reason"
                    label="请假理由"
                    width="200px">
            </el-table-column>
            <el-table-column
                    prop="stare"
                    label="状态"
                    width="120px">
            </el-table-column>
            <el-table-column
                    prop="refusereson"
                    label="拒绝理由"
                    width="150px">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.native.prevent="agree(scope.$index, leaveList)" :disabled="scope.row.btnstyle">同意</el-button>
                    <el-button type="text" size="small" @click.native.prevent="disagree(scope.$index, leaveList)" :disabled="scope.row.btnstyle">拒绝</el-button>
                </template>
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
            <el-form ref="childForm" :model="cleaveForm" :rules="rules">
                <el-form-item label="拒绝理由" :label-width="formLabelWidth" prop="reason" style="width: 400px">
                    <el-input v-model="cleaveForm.refusereson" autocomplete="on"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRefuseReason">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TeacherLeave",
        data() {
            return {
                leaveList: [],
                leaveTypeList:[],
                relationshipList:[],
                query:{
                    cname:"",
                    statrt:"",
                    tname:sessionStorage.getItem("uname"),
                    page:1,
                    limit:10,
                },
                cleaveForm:{
                    clid:'',
                    cname:sessionStorage.getItem("uname"),
                    statrt:"",
                    end:"",
                    lid:"",
                    reason:"",
                    day:"",
                    pid:"",
                    refusereson:""
                },
                total:0,
                dialogFormVisible:false,
            }
        },
        methods: {
            getAllLeave(){
                this.$http.post("/getCleave",this.query).then(res=>{
                    this.leaveList = res.data.data
                    this.total = res.data.count
                })
            },
            search(){
                this.query.page=1
                this.getAllLeave()
            },
            agree(index, rows){
                this.$confirm('同意后后不可再次操作，请谨慎选择','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'}).then(()=>{
                    this.$http.post("/agree",this.leaveList[index]).then(res=>{
                        if (res.data=="success"){
                            this.$message.success("同意成功")
                            this.getAllLeave()
                        }else if (res.data=="error1"){
                            this.$message.error("请求已过期，无法同意申请")
                            this.getAllLeave()
                        } else {
                            this.$message.error("同意失败")
                        }
                    })
                })
                /*this.$http.post("/agree",this.leaveList[index]).then(res=>{
                    if (res.data=="success"){
                        this.$message.success("同意成功")
                        this.getAllLeave()
                    }else if (res.data=="error1"){
                        this.$message.error("请求已过期，无法同意申请")
                        this.getAllLeave()
                    } else {
                        this.$message.error("同意失败")
                    }
                })*/
            },
            disagree(index, rows){
                this.$confirm('拒绝后不可再次操作，请谨慎选择','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'}).then(()=>{
                        this.$http.post("/disagree",this.leaveList[index]).then(res=>{
                            if (res.data=="success"){
                                this.cleaveForm = this.leaveList[index]
                                this.dialogFormVisible = true
                            }else {
                                this.$message.error("请求已过期，无法拒绝申请")
                            }
                    })

                })
                /*this.$http.post("/disagree",this.leaveList[index]).then(res=>{
                    if (res.data=="success"){
                        this.$message.success("拒绝成功")
                        this.getAllLeave()
                    }else if (res.data=="error1"){
                        this.$message.error("请求已过期，无法拒绝申请")
                        this.getAllLeave()
                    }else {
                        this.$message.error("拒绝失败")
                    }
                })*/
            },
            handleSizeChange(val) {
                this.query.limit=val;
                this.getAllLeave()
            },
            handleCurrentChange(val) {
                this.query.page=val;
                this.getAllLeave()
            },
            saveRefuseReason(index, rows){
                this.$http.post("/updRefuseReason",this.cleaveForm).then(res=>{
                    if (res.data=="success"){
                        this.$message.success("拒绝成功!")
                        this.dialogFormVisible= false

                    }else if (res.data=="error1"){
                        this.$message.error("请求已过期，无法拒绝申请!")
                        this.getAllLeave()
                    }else {
                        this.$message.error("拒绝失败!")
                    }
                })
            }

        },
        created() {
            this.search()
        }
    }
</script>

<style scoped>

</style>