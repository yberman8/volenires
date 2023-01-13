import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
 
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/adminManage',
    name: 'superManager',
    component: () => import( '../views/AdminView.vue'),
    // beforeEnter: (to, from, next) => {

    //   onAuthStateChanged(auth, user => {
    //     if (user.uid === "1A4fqS8qKKWIAo1aeicbVqb7EL63" || user.uid === "3E6w2DKWOvU4scfanw0N2KCukiI2") {
    //       next();
    //     }
    //     else {
    //       next("./");
    //     }
    //   })
    // }
  },
  {
    path: '/amutaManage',
    name: 'amutaManage',
    component: () => import( '../views/AmutaManagerView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import( '../views/AboutView.vue')
  },
  {
    path: '/pirsum/:id',
    name: 'singlePirsum',
    component: () => import( '../views/SingleLinkPirsumView.vue')
  },
  {
    path: '/adminEditor',
    name: 'editPirsumimAdmih',
    component: () => import( '../views/adminPirsumimEditView.vue'),
    props: true
  },
  {
    path: '/resetPassword/:id/:token',
    name: 'resetPassword',
    component: () => import( '../views/ResetPasswordView.vue'),
    props: true
  },
  {
    path: '/resetPasswordAdmin',
    name: 'resetPasswordAdmin',
    component: () => import( '../views/ResetPasswordAdminView.vue'),
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
