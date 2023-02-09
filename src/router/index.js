import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/admin/HomeView.vue'
import LoginView from '../views/Login.vue'
import ChildrenList from '../views/admin/ChildrenList.vue'
import TeacherList from '../views/admin/TeacherList.vue'
import ClassList from '../views/admin/ClassList.vue'
import CleaveList from '../views/admin/CleaveList.vue'
import LeaveList from '../views/admin/LeaveList.vue'
import AdminShow from '../views/admin/AdminShow.vue'
import AdminFirst from '../views/admin/AdminFirst.vue'
import ChildrenHome from '../views/children/ChildrenHome.vue'
import ChildrenLeave from '../views/children/ChildrenLeave.vue'
import ParentsList from '../views/children/ParentsList.vue'
import ChildrenShow from '../views/children/ChildrenShow.vue'
import ChildrenFirst from '../views/children/ChildrenFirst.vue'
import TeacherHome from '../views/teacher/TeacherHome.vue'
import Children from '../views/teacher/Children.vue'
import TeacherLeave from '../views/teacher/TeacherLeave.vue'
import TeacherShow from '../views/teacher/TeacherShow.vue'
import TeacherFirst from '../views/teacher/TeacherFirst.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: LoginView
  },
  {
    path: '/home',
    component: HomeView,
    redirect:"/adminFirst",
    children:[
      {
        path: '/childrenList',
        component: ChildrenList
      },
      {
        path: '/teacherList',
        component: TeacherList
      },
      {
        path: '/classList',
        component: ClassList
      },
      {
        path: '/leaveList',
        component: LeaveList
      },
      {
        path: '/adminShow',
        component: AdminShow
      },
      {
        path: '/cleaveList',
        component: CleaveList
      },
      {
        path: '/adminFirst',
        component: AdminFirst
      }
    ]
  },
  {
    path: '/childrenHome',
    component: ChildrenHome,
    redirect:"/childrenFirst",
    children: [
      {
        path: '/childrenLeave',
        component: ChildrenLeave
      },
      {
        path: '/parentsList',
        component: ParentsList
      },
      {
        path: '/childrenShow',
        component: ChildrenShow
      },
      {
        path: '/childrenFirst',
        component: ChildrenFirst
      }
      ]
  },
  {
    path: '/teacherHome',
    component: TeacherHome,
    redirect:"/teacherFirst",
    children: [
      {
        path: '/children',
        component: Children
      },
      {
        path: '/teacherLeave',
        component: TeacherLeave
      },
      {
        path: '/teacherShow',
        component: TeacherShow
      },
      {
        path: '/teacherFirst',
        component: TeacherFirst
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next) =>{
  let path = to.fullPath
  if (path == "/"){
    next()
    return
  }
  if (sessionStorage.getItem("uname") != null){
    next()
    return;
  }

  next("/")
})
export default router
