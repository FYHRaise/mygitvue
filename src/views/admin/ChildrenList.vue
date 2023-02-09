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
                :data="children"
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
                    prop="cname"
                    label="姓名"
            >
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别"
                    width="120">
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
        <el-dialog :title="titles" :visible.sync="dialogFormVisible" width="25%">
            <el-form ref="childForm" :model="childForm" :rules="rules">
                <el-form-item v-if="childForm.cid != ''" label="学生编号" :label-width="formLabelWidth" prop="cid" style="width: 400px">
                    <el-input readonly v-model="childForm.cid" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="cname" style="width: 400px">
                    <el-input v-model="childForm.cname" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="sex" style="width: 400px">
                    <el-radio v-model="childForm.sex" label="男">男</el-radio>
                    <el-radio v-model="childForm.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="生日" :label-width="formLabelWidth" prop="birthday" style="width: 400px">
                    <el-date-picker
                            style="width: 100%"
                            v-model="childForm.birthday"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="班级" :label-width="formLabelWidth" prop="cno" style="width: 400px">
                    <el-select v-model="childForm.cno" placeholder="请选择班级" clearable style="width: 100%">
                        <el-option v-for="cl in classList"  :label="cl.clname" :value="cl.cno"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveChildren">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ChildrenList",
        data(){
            return{
                query:{
                    cname:"",
                    cno:"",
                    page:1,
                    limit:10,
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
                titles:'',
                rules:{
                    cname:[
                        {required:true,message:"幼儿姓名不能为空",trigger:"blur"}
                    ],
                    birthday:[
                        {required:true,message:"生日不能为空",trigger:"chang"}
                    ],
                    cno:[
                        {required:true,message:"班级不能为空",trigger:"change"}
                    ]
                },
            }
        },
        methods:{
            getChildren(){
                this.$http.post("/getChildren",this.query).then(res=>{
                    this.children = res.data.data
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
            add(){
                this.dialogFormVisible=true
                this.titles="新增幼儿"

                if (this.$refs["childForm"] != null) {
                    this.$refs["childForm"].resetFields()
                }

                this.childForm={
                    cid:'',
                    cname:'',
                    sex:'男',
                    birthday:'',
                    cno:'',
                }
            },
            saveChildren(){
                this.$refs["childForm"].validate(valid=>{

                    if (valid){
                        let url = '/updateChildren'
                        let msg = '修改'

                        if (this.childForm.cid==''){
                            url='/addChildren'
                            msg='新增'
                        }

                        this.$http.post(url,this.childForm).then((res)=>{
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
                this.titles="修改学生信息"

                if (this.$refs["childForm"] != null) {
                    this.$refs["childForm"].resetFields()
                }

                this.childForm=selections[0]
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
                      arr.push(selection[i].cid)
                  }
                  this.$http.post("/delChildren",arr).then(res=>{
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
                        arr.push(selection[i].cid)
                    }
                    this.$http.post("/resetChildrenPassword",arr).then(res=>{
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