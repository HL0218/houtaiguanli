<template>
  <div class="home">
  <el-container class="home-container">
    <el-header>
      <span>电商管理后台系统</span>
      <el-button type="info" @click="logout" plain>退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isshow?'64px':'200px'">
        <!-- 侧边导航栏 -->
        <div class="tabBtn" @click="tabBtn">|||</div>
        <el-menu
          :default-active="$route.path"
          router
          :collapse-transition="false"
          :collapse="isshow"
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF">
          <el-submenu :index="item.id+''" v-for='(item) in menus' :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="'/'+childItem.path+''" v-for='childItem in item.children' :key="childItem.id">
                 <i class="el-icon-menu"></i>
                {{childItem.authName}}
              </el-menu-item>
          </el-submenu>
        </el-menu>        
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>    
     
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menus:'',
      iconObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',        
      },
      isshow:false
    }
  },
  created(){
    this.menuList()
  },
  methods:{
    // 退出登录
    logout(){
      window.sessionStorage.removeItem('token');
      this.$router.push('/login')
    },
    tabBtn(){
      this.isshow = !this.isshow
    },
    async menuList(){
      let { data:res } =await this.$axios.get('menus')
      if(res.meta.status != 200) return  this.$message.error(res.meta.msg);     
      this.menus = res.data
      //consol.log(res)
      //consol.log(this.menus)
    }
  }
}
</script>
<style lang='less' scoped>
  .home-container{
    height: 100vh;
  }
  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
      color: #fff;
      font-size: 24px;
    }
  }
  .el-menu{
    border-right: none;
  }
  .el-aside{
    background-color: #333744
  }
  .el-main{
    background-color: #EAEDF1
  }
  .iconfont {
    margin-right: 10px;
  }
  .tabBtn{
    line-height: 30px;
    color: #fff;
    background-color: #4A5064;
    text-align: center;
    cursor: pointer;
  }
</style>