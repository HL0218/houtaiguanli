<template>
  <div class="login">
    <div class="box">
        <div class="touxiang">
            <img src="../assets/logo.png" alt="">
        </div>
        <el-form :model="form" :rules='loginrules' ref="loginRef" label-width="" class="formLogin">
        <el-form-item prop="name">
            <el-input v-model="form.name" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type='password' v-model="form.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item> 
        <el-form-item class="btnLogin">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="reset">重置</el-button>            
        </el-form-item>               
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      //表单内容
      form:{
        name:'',
        password:''
      },
      //表单验证
      loginrules:{
        name:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }          
        ],
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }              
        ]
      }
    }
  },
  methods:{
    // 重置表单
    reset(){
      // ////console.log(this)
      this.$refs.loginRef.resetFields()
    },
    login(){
      let {name,password} = this.form
       this.$refs.loginRef.validate(async (vield)=>{
         //console.log(vield)
         if(!vield) return false;
        const {data} =await this.$axios.post('login',{
           username:name,
           password:password
         })
         //console.log(data)
         if(data.meta.status == 200){
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            // 1.登陆成功存储token
            //2.跳转首页
            let token = data.data.token
            window.sessionStorage.setItem('token',token)   
            this.$router.push('/home')
         }else{
            this.$message.error('登录失败');           
         }
       })
    }
  },
  components: {
    // HelloWorld
  }
}
</script>
<style lang='less' scoped>
.login{
    background-color: #2b4b6b;
    height: 100vh;
}
.box{
    width: 450px;
    height: 300px;
    background: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%)
}
.touxiang{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee
    }
}
.formLogin{
  padding: 120px 20px 0;
  .btnLogin{
    display: flex;
    justify-content: flex-end
  }
}
</style>
