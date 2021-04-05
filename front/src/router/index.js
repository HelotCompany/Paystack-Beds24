import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/VerifyEmail',
    name: 'VerifyEmail',
    component: () => import('../views/VerifyEmail.vue')
  },
  {
    path: '/CreateAccount',
    name: 'CreateAccount',
    component: () => import('../views/CreateAccount.vue')
  },
  {
    path: '/PaystackBeds24',
    name: 'PaystackBeds24',
    component: () => import('../views/PaystackBeds24.vue')
  },
  {
    path: '/Dashboard',
    component: () => import('../views/Dashboard/Index.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard/Home.vue'),
      },
      {
        path: 'Profile',
        name: 'Profile',
        component: () => import('../views/Dashboard/Profile.vue'),
      },
      {
        path: 'Settings',
        name: 'Settings',
        component: () => import('../views/Dashboard/Settings.vue'),
      },
      {
        path: 'Help',
        name: 'Help',
        component: () => import('../views/Dashboard/Help.vue'),
      },
    ]
  },
  {
    path: '/RedirectPay/:id/:bookId',
    name: 'RedirectPay',
    component: () => import('../views/RedirectPay.vue')
  },
  {
    path: '/RedirectPayStripe',
    name: 'RedirectPayStripe',
    component: () => import('../views/RedirectPayStripe.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
