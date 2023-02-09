<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
            <el-form-item label="姓名">
                <el-input v-model="query.cname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="班级">
                <el-select v-model="query.cno" placeholder="请选择班级" clearable>
                    <el-option v-for="cl in classList"  :label="cl.clname" :value="cl.cno"></el-option>
                </el-select>
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
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="cname"
                    label="姓名"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="clname"
                    label="班级"
                    width="150px">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="end"
                    label="请假结束日期"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="day"
                    label="请假天数"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="relationship"
                    label="申请人"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="lname"
                    label="请假类型"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="reason"
                    label="请假理由"
                    width="200px">
            </el-table-column>
            <el-table-column
                    prop="stare"
                    label="状态"
                    width="150px">
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
    </div>
</template>

<script>
    export default {
        name: "CleaveList",
        data() {
            return {
                leaveList: [],
                leaveTypeList:[],
                classList:'',
                relationshipList:[],
                query:{
                    cname:"",
                    cno:"",
                    page:1,
                    limit:10,
                },
                total:0,
            }
        },
        methods: {
            getAllLeave(){
                this.$http.post("/getAdminCleave",this.query).then(res=>{
                    this.leaveList = res.data.data
                    this.total = res.data.count
                })
            },
            search(){
                this.query.page=1
                this.getAllLeave()
            },
            getAllClass(){
                this.$http.post("/geAllClass").then(res=>{
                    this.classList = res.data
                }).catch(()=>{
                    this.$message.error("信息加载失败，请联系管理员")
                })
            },
            handleSizeChange(val) {
                this.query.limit=val;
                this.getAllLeave()
            },
            handleCurrentChange(val) {
                this.query.page=val;
                this.getAllLeave()
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