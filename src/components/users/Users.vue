<template>
 <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>    
    <el-card class="box-card">
        <el-row :gutter="20">
        <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select" clearable @clear='getuserList'>
                <el-button slot="append" icon="el-icon-search" @click="shousuo"></el-button>
            </el-input>            
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="dialogVisible=true" plain>添加用户</el-button>
        </el-col>
        </el-row>        
        <el-table
            :data="usersList"
            border
            style="width: 100%">
            <el-table-column type='index' label="#"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>                                         
            <el-table-column prop="mg_state" label="状态">
                <template slot-scope="scope">
                    <!-- {{scope.row.mg_state}} -->
                    <el-switch v-model="scope.row.mg_state" @change="tabMgstate(scope.row)"></el-switch>
                </template>

            </el-table-column>
            <el-table-column label="操作" width="180">
                <template  slot-scope="scope">                                               
                    <el-tooltip :enterable='false' content="编辑角色" placement="top">
                        <el-button type="primary"  @click="showEditDialog(scope.row.id)" size='mini' icon="el-icon-edit"></el-button>
                    </el-tooltip>       
                    <el-tooltip :enterable='false'  content="删除角色" placement="top">
                        <el-button type="danger" @click="delUsers(scope.row.id)" size='mini' icon="el-icon-delete"></el-button>
                    </el-tooltip> 
                    <el-tooltip :enterable='false'  content="分配角色" placement="top">
                        <el-button type="warning" size='mini' icon="el-icon-setting"></el-button>  
                    </el-tooltip>                      
                </template>                              
            </el-table-column>
        </el-table>    
        <!-- 分页-->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
        </el-pagination>        
        <!-- 消息弹框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close='closeUser'
        >
        <el-form :model="formUser" :rules="addRules" ref="userRef" label-width="100px" >
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="formUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="formUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="formUser.mobile"></el-input>
        </el-form-item>                              
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>        
        <!-- //编辑用户 -->
        <el-dialog
        title="编辑用户"
        :visible.sync="VisibleEdit"
         @close='closeEdit'
        width="50%">
        <el-form  ref="editFormref" :rules="editRules" :model="editForm" label-width="80px">
        <el-form-item label="用户名" prop='username'>
            <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop='mobile'>
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>                     
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="VisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="EditUserinfo">确 定</el-button>
        </span>
        </el-dialog>        
    </el-card>    
 </div>
</template>

<script>
 export default {
  name: 'Users',
  data () {
    //   自定义验证
  var emailAge = (rule, value, callback)=>{
      var regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      if(regEmail.test(value)){
          return callback();
      }
      callback(new Error('请输入合法邮箱'))
  }         
    var mobileAge = (rule, value, callback)=>{
      var regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if(regMobile.test(value)){
          return callback();
      }
      callback(new Error('请输入合法手机号'))
  }     

   return {
       dialogVisible:false,
       VisibleEdit:false,//编辑用户
       queryinfo:{
           query:'',
           pagenum:1,
           pagesize:5
       },

       usersList:[],
       total:0,
      //表单内容
      formUser: {
        username:'hl2020',
        password:'hl2020',
        email:'12344@qq.com',
        mobile:'18735420435'
      },   
      //表单验证
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailAge, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileAge, trigger: 'blur' }
        ]
      }, 
       //编辑用户
       editForm:{},
       //编辑用户验证
       editRules: {
         email:[
             { required: true, message: '请输入邮箱', trigger: 'blur' },
             { validator: emailAge, trigger: 'blur' }
         ],
         mobile:[
             { required: true, message: '请输入电话', trigger: 'blur' },
             { validator: mobileAge, trigger: 'blur' }
         ]         
       }   

   }
  },
  created(){
      this.getuserList()
  },
  methods:{
      //获取列表
     async getuserList(){
        let {data:res} =await this.$axios.get('users',{params:this.queryinfo})
         //console.log(res)
        this.usersList = res.data.users
        this.total = res.data.total
      },
      //监听pagesize改变
      handleSizeChange(sizeVal){
          this.queryinfo.pagesize = sizeVal;
          this.getuserList()
        //   console.log(sizeVal)
      },
      //监听页码
      handleCurrentChange(curentVal){
          this.queryinfo.pagenum = curentVal;
          this.getuserList()
        //   console.log(curentVal)
      },
    //   改变用户状态
    async tabMgstate(tabinfo){
        //console.log(tabinfo)
        const {id,mg_state} = tabinfo
        let { data:res} = await this.$axios.put(`users/${id}/state/${mg_state}`)
        if(res.meta.status !==200) {
            tabinfo.mg_state = !tabinfo.mg_state
            return this.$message.error('更改用户状态失败！'); 
        }
        this.$message.success('更改用户状态成功！');
        //console.log(res)
    },
    shousuo(){
        this.queryinfo.pagenum = 1;
        this.getuserList()
    },
    // 清空对话框
    closeUser(){
        this.$refs.userRef.resetFields()
    },
    //添加用户
    addUser(){
        this.$refs.userRef.validate(async (vield)=>{
            if(!vield) return false;
            let { data:res} = await this.$axios.post('users',this.formUser);
            if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败！')
            }

            this.$message.success('添加用户成功！')
            // 隐藏添加用户的对话框
            this.dialogVisible = false
            // 重新获取用户列表数据
            this.getuserList()            
            //console.log(res)
        })
    },
    //编辑用户
    async showEditDialog(id){
       this.VisibleEdit = true;
       let { data:res } = await this.$axios.get(`users/${id}`);
        if (res.meta.status !== 200) {
        return this.$message.error('编辑用户失败！')
        }       
       //console.log(res)
       this.editForm = res.data
    },
    //清空编辑
    closeEdit(){
      this.$refs.editFormref.resetFields()
    },
    //保存编辑
    EditUserinfo(){
      let {id,email,mobile} = this.editForm
      this.$refs.editFormref.validate(async (vield)=>{
        if(!vield) return false;
        let { data:res} = await this.$axios.put(`users/${id}`,{email,mobile});
          if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败！')
          }

          this.$message.success('更新用户成功！')        
          this.VisibleEdit = false;
          this.getuserList()  
        //console.log(res)
      })
    },
    //删除用户
     delUsers(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let { data:res} = await this.$axios.delete(`users/${id}`);
          this.getuserList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }      
  },
  components: {
      
  }
 }
</script>

<style lang='less' scoped>
  .text {
    font-size: 14px;
  }
  .item {
    padding: 18px 0;
  }
  .box-card {
    // width: 480px;
    margin-top:15px;
  }
  .el-table{
      margin-top: 20px;
      font-size: 12px;
  }
  .el-pagination{
      margin-top: 15px
  }
</style>
