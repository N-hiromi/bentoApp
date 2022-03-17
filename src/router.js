import { createRouter, createWebHistory } from "vue-router";
import BentoIndex from "@/views/BentoIndex.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import store from './store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "bentoIndex",
      component: BentoIndex,
      beforeEnter(to, from, next) {
        if(store.getters.idToken) {
          next()
        } else {
          next("/login")
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter(to, from, next) {
        if(store.getters.idToken) {
          next("/")
        }else {
          next();
        }
      }
  },
    {
      path: "/register",
      name: "Register",
      component: Register,
    beforeEnter(to, from, next) {
      if(store.getters.idToken) {
        next("/")
      } else {
        next()
      }
    }
    },
  ],
});

export default router;
