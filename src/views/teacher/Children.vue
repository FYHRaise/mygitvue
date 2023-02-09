<template>
    <div>
        <el-form :inline="true" :model="query" class="demo-form-inline" style="height: 100px">
            <el-form-item label="姓名">
                <el-input v-model="query.cname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
                ref="multipleTable"
                :data="children"
                tooltip-effect="dark"
                style="width: 100%"
                height="500px"
                @select="selectRow"
                @select-all="selectAll">
            <el-table-column
                    prop="cname"
                    label="姓名"
            >
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别"
                    >
            </el-table-column>
            <el-table-column
                    prop="birthday"
                    label="生日"
                    show-overflow-tooltip>
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
    </div>
</template>

<script>
    export default {
        name: "Children",
        data(){
            return{
                query:{
                    cname:"",
                    page:1,
                    limit:10,
                    tname:sessionStorage.getItem("uname")
                },
                children:[],
                total:0,
                classList:[],
                dialogFormVisible:false,
                childForm:{
                    cid:'',
                    cname:'',
                    sex:'男',
                    birthday:'',
                    cno:'',
                },
                formLabelWidth:'50px',
                selectionItems:[],
                titles:''
            }
        },
        methods:{
            getChildren(){
                this.$http.post("/getNotAllChildren",this.query).then(res=>{
                    this.children = res.data.data
                    this.total = res.data.count
                })
            },
            search(){
                this.query.page=1
                this.getChildren()
            },
            handleSizeChange(val) {
                this.query.limit=val;
                this.getChildren()
            },
            handleCurrentChange(val) {
                this.query.page=val;
                this.getChildren()
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