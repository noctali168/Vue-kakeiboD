import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import FormPage from '../pages/FormPage.vue'
import ListPage from '../pages/ListPage.vue'
import NotifyPage from '../pages/NotifyPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/form', component: FormPage },
  { path: '/list', component: ListPage },
  { path: '/notify', component: NotifyPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
