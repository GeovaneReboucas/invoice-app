import { createRouter, createWebHistory } from "vue-router";
import * as views from '../views/index'

const routes: any = [
  {
    path: '/invoices',
    children: [
      {
        path: '',
        name: 'Invoices',
        component: views.InvoicesView
      },
      {
        path: ':id',
        name: 'Invoice',
        component: views.InvoiceView
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export { router }