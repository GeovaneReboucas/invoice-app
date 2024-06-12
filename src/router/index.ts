import { createRouter, createWebHistory } from "vue-router";
import * as views from '../views/index'

const routes: any = [
  {
    path: '/home',
    name: 'Home',
    component: views.Home
  },
  {
    path: '/invoice/:id',
    name: 'Invoice',
    component: views.Home
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export { router }