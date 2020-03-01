import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import About from '../views/About.vue'
import Login from '../components/Login.vue'
import Welcome from '../components/home/Welcome.vue'
import Users from '../components/users/Users.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children:[
      {
        path: '/users',
        name: 'Users',
        component: Users,
      },
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
    // () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 导航守卫，判断用户是否登录
  if(to.path == '/login'){ return next()};
  const tokenVal = window.sessionStorage.getItem('token');
  if(!tokenVal){ return next('/login')}
  next();
})
export default router
