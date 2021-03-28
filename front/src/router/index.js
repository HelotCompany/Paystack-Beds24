import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/PaystackBeds24',
    name: 'PaystackBeds24',
    component: () => import('../views/PaystackBeds24.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
