<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
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
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add" >请假</el-button>
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
                    width="120px">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="updateLeave(scope.$index, leaveList)" type="text" size="small">修改</el-button>
                    <el-button type="text" size="small" @click.native.prevent="submitLeave(scope.$index, leaveList)">提交</el-button>
                    <el-button type="text" size="small" @click.native.prevent="deleteLeave(scope.$index, leaveList)">删除</el-button>
                    <el-button type="text" size="small" @click.native.prevent="logoutLeave(scope.$index, leaveList)">销假</el-button>
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
                :total="total"
                :inline="true">
        </el-pagination>
        <el-dialog :title="titles" :visible.sync="dialogFormVisible" width="25%">
            <el-form ref="childForm" :model="cleaveForm" :rules="rules">
                <el-form-item label="请假信息编号" v-if="cleaveForm.clid != ''" :label-width="formLabelWidth" prop="clid" style="width: 100%">
                    <el-input v-model="cleaveForm.clid" autocomplete="on" readonly></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="cname" style="width: 100%">
                    <el-input v-model="cleaveForm.cname" autocomplete="on" readonly></el-input>
                </el-form-item>
                <el-form-item label="开始日期" :label-width="formLabelWidth" prop="statrt" style="width: 100%">
                    <el-date-picker
                            style="width: 100%"
                            v-model="cleaveForm.statrt"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                            @change="getDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" :label-width="formLabelWidth" prop="end" style="width: 100%">
                    <el-date-picker
                            style="width: 100%"
                            v-model="cleaveForm.end"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                            @change="getDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="请假类型" :label-width="formLabelWidth" prop="lid" style="width: 100%">
                    <el-select v-model="cleaveForm.lid" placeholder="请选择请假类型" clearable style="width: 100%">
                        <el-option v-for="l in leaveTypeList"  :label="l.lname" :value="l.lid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请假原因" :label-width="formLabelWidth" prop="reason" style="width: 100%">
                    <el-input v-model="cleaveForm.reason" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="申请人" :label-width="formLabelWidth" prop="pid" style="width: 100%">
                    <el-select v-model="cleaveForm.pid" placeholder="请选择申请人" clearable style="width: 100%">
                        <el-option v-for="rl in relationshipList"  :label="rl.relationship" :value="rl.pid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请假天数" :label-width="formLabelWidth" prop="day" style="width: 100%">
                    <el-input v-model="cleaveForm.day" autocomplete="on" readonly></el-input>
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
        name: "ChildrenLeave",
        data() {
            const validateStart= (rule,value,callback)=>{
                let statrt1 = new Date(this.cleaveForm.statrt)
                let current1 = new Date(this.current)
                if (statrt1 < current1){
                    callback(new Error("请假日期不得早于当前日期！"));
                }else {
                    callback();
                }
            };
            const validateEnd= (rule,value,callback)=>{
                let statrt1 = new Date(this.cleaveForm.statrt)
                let end1 =  new Date(this.cleaveForm.end)
                if (end1 < statrt1){
                    callback(new Error("请假截止日期不得早于请假开始日期！"));
                }else {
                    callback();
                }
            };
            return {
                leaveList: [],
                leaveTypeList:[],
                relationshipList:[],
                query:{
                    statrt:'',
                    uname:sessionStorage.getItem("uname"),
                    page:1,
                    limit:10,
                },
                total:0,
                titles:"请假页面",
                cleaveForm:{
                    clid:'',
                    cname:sessionStorage.getItem("uname"),
                    statrt:"",
                    end:"",
                    lid:"",
                    reason:"",
                    day:"",
                    pid:""
                },
                dialogFormVisible:false,
                rules:{
                    statrt:[
                        {required:true,message:"开始日期不能为空",trigger:"change"},
                        { validator: validateStart,  trigger: 'change' }
                    ],
                    end:[
                        {required:true,message:"结束日期不能为空",trigger:"change"},
                        { validator: validateEnd,  trigger: 'change' }
                    ],
                    lid:[
                        {required:true,message:"请假类型不能为空",trigger:"change"}
                    ],
                    reason:[
                        {required:true,message:"结束日期不能为空",trigger:"blur"}
                    ],
                    pid:[
                        {required:true,message:"申请人不能为空",trigger:"change"}
                    ],
                },
                current:""
            }
        },
        methods: {
            getAllLeave(){
                this.$http.post("/getAllCleave",this.query).then(res=>{
                    this.leaveList = res.data.data
                    this.total = res.data.count
                })
            },
            search(){
                this.query.page=1
                this.getAllLeave()
            },
            getAllLeaveType(){
                this.$http.post("/getAllLeaveType").then(res=>{
                    this.leaveTypeList = res.data
                })
            },
            getRelation(){

                this.$http.post("/getParents",this.query).then(res=>{
                    this.relationshipList = res.data
                })
            },
            add(){
                this.$http.post("/add",this.cleaveForm).then(res=>{
                    if (res.data=="success"){
                        this.dialogFormVisible = true;

                        if (this.$refs["cleaveForm"] != null) {
                            this.$refs["cleaveForm"].resetFields()
                        }

                        this.cleaveForm={
                            clid:'',
                            cname:sessionStorage.getItem("uname"),
                            statrt:"",
                            end:"",
                            lid:"",
                            reason:"",
                            day:"",
                            pid:""
                        }
                    }else {
                        this.$message.error("请确保所有的假期都结束后再次请假")
                    }
                })


            },
            saveLeave(){
                this.getDate()
                // if (pid)
                // this.$http.post("/addCleave",this.cleaveForm).then(res=>{
                //     if (res.data=="success"){
                //         this.$message.success("保存成功")
                //     }else {
                //         this.$message.error("保存失败")
                //     }
                //     this.dialogFormVisible=false
                //     this.getAllLeave()
                // })
                this.$refs["childForm"].validate(valid=>{
                    if (valid){
                        let url = '/updCleave'
                        let msg = '修改'

                        if (this.cleaveForm.clid==''){
                            url='/addCleave'
                            msg='请假'
                        }

                        this.$http.post(url,this.cleaveForm).then((res)=>{
                            if (res.data=="success"){
                                this.$message.success(msg+"成功")
                            }else if(res.data=="error1") {
                                this.$message.error("请假信息提交或者通过审核，无法修改信息")
                            }else if (res.data=="error2"){
                                this.$message.error("请假信息提交或者通过审核，想要再次请假，请先销假后再申请")
                            }else {
                                this.$message.error(msg+"失败")
                            }
                            this.dialogFormVisible=false
                            this.getAllLeave()
                        }).catch(()=>{
                            this.$message.error(msg+"失败,请联系管理员")
                        })
                    }

                })
            },
            updateLeave(index, rows){
                if (this.$refs["cleaveForm"] != null) {
                    this.$refs["cleaveForm"].resetFields()
                }
                this.cleaveForm={
                    clid:'',
                    cname:sessionStorage.getItem("uname"),
                    statrt:"",
                    end:"",
                    lid:"",
                    reason:"",
                    day:"",
                    pid:""
                }
                this.cleaveForm = this.leaveList[index]
                this.$http.post("/upd",this.cleaveForm).then(res=>{
                    if (res.data=="success"){
                        this.dialogFormVisible = true;
                        /*this.dialogFormVisible = true;

                        if (this.$refs["cleaveForm"] != null) {
                            this.$refs["cleaveForm"].resetFields()
                        }

                        this.cleaveForm={
                            clid:'',
                            cname:sessionStorage.getItem("uname"),
                            statrt:"",
                            end:"",
                            lid:"",
                            reason:"",
                            day:"",
                            pid:""
                        }*/
                    }else {
                        this.$message.error("已提交，无法修改")
                        this.cleaveForm={
                            clid:'',
                            cname:sessionStorage.getItem("uname"),
                            statrt:"",
                            end:"",
                            lid:"",
                            reason:"",
                            day:"",
                            pid:""
                        }
                    }
                })

                /*if (this.$refs["cleaveForm"] != null) {
                    this.$refs["cleaveForm"].resetFields()
                }
                this.cleaveForm={
                    clid:'',
                    cname:sessionStorage.getItem("uname"),
                    statrt:"",
                    end:"",
                    lid:"",
                    reason:"",
                    day:"",
                    pid:""
                }
                this.cleaveForm = this.leaveList[index]
                this.dialogFormVisible = true;*/
                
            },
            submitLeave(index, rows){
                if (this.$refs["cleaveForm"] != null) {
                    this.$refs["cleaveForm"].resetFields()
                }
                this.cleaveForm={
                    clid:'',
                    cname:sessionStorage.getItem("uname"),
                    statrt:"",
                    end:"",
                    lid:"",
                    reason:"",
                    day:"",
                    pid:""
                }
                this.cleaveForm = this.leaveList[index]

                this.$http.post("/submitLeave",this.cleaveForm).then(res=>{
                    if (res.data=="success"){
                        this.$message.success("提交成功")
                    }else if (res.data=="error1"){
                        this.$message.error("无法二次提交")
                    }else {
                        this.$message.error("提交失败")
                    }
                    this.getAllLeave()
                }).catch(()=>{
                    this.$message.error("提交失败,请联系管理员")
                })
            },
            deleteLeave(index, rows){
                if (this.$refs["cleaveForm"] != null) {
                    this.$refs["cleaveForm"].resetFields()
                }
                this.cleaveForm={
                    clid:'',
                    cname:sessionStorage.getItem("uname"),
                    statrt:"",
                    end:"",
                    lid:"",
                    reason:"",
                    day:"",
                    pid:""
                }
                this.cleaveForm = this.leaveList[index]
                this.$confirm('此操作不可逆，请谨慎选择','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'}).then(()=>{

                    this.$http.post("/deleteLeave",this.cleaveForm).then(res=>{
                        if (res.data=="success"){
                            this.$message.success("删除成功")
                            this.getAllLeave()
                        }else if (res.data=="error1"){
                            this.$message.error("已经提交审核，无法删除")
                        } else {
                            this.$message.error("删除失败")
                        }

                    }).catch(()=>{
                        this.$message.error("删除失败,请联系管理员")
                    })
                })
            },
            logoutLeave(index, rows){
                if (this.$refs["cleaveForm"] != null) {
                    this.$refs["cleaveForm"].resetFields()
                }
                this.cleaveForm={
                    clid:'',
                    cname:sessionStorage.getItem("uname"),
                    statrt:"",
                    end:"",
                    lid:"",
                    reason:"",
                    day:"",
                    pid:""
                }
                this.cleaveForm = this.leaveList[index]
                this.$http.post("/logoutLeave",this.cleaveForm).then(res=>{
                    if (res.data=="success"){
                        this.$message.success("销假成功")
                        this.getAllLeave()
                    }else if (res.data=="error1"){
                        this.$message.error("请假申请没有通过，无法销假")
                    } else {
                        this.$message.error("销假失败")
                    }
                }).catch(()=>{
                    this.$message.error("删除失败,请联系管理员")
                })
            },
            DateDiff(end, start){
                let aDate, oDate1, oDate2, iDays;
                end = end.split(" ");
                aDate = end[0].split("-");
                oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2]);
                start = start.split(" ");
                aDate = start[0].split("-");
                oDate2 = new Date(aDate[0] , aDate[1] , aDate[2]);
                iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
                return iDays;
            },
            getDate(){
                this.cleaveForm.day=this.DateDiff(this.cleaveForm.end,this.cleaveForm.statrt)
            },
            handleSizeChange(val) {
                this.query.limit=val;
                this.getAllLeave()
            },
            handleCurrentChange(val) {
                this.query.page=val;
                this.getAllLeave()
            },
            currentDate(){
                let aDate = new Date();
                let dateValue = aDate.getFullYear()+"-"+(aDate.getMonth() + 1)+"-"+aDate.getDate();
                this.current=dateValue
            }
        },
        created() {
            this.getAllLeave()
            this.getAllLeaveType()
            this.getDate()
            this.getRelation()
            this.currentDate()
        }
    }
</script>

<style scoped>
.el-form{
    height: 800px;

}
</style>