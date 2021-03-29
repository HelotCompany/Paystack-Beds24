import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

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

router.beforeEach((to, from, next) => {
  if (to.name !== 'Register' && !store.getters['isConnect']) next({ name: 'Login' })
  else next()
})

export default router
