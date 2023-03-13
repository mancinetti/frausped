import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/LoginPage.vue'
import LeggiEtichetta from '../views/LeggiEtichetta.vue'
import LeggiCollo from '../views/LeggiCollo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
     redirect: '/folder/etichetta'
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/folder/etichetta/:isLogin'
  },
  {
    path: '/folder/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/folder/etichetta',
    component: LeggiEtichetta
  },
  {
    path: '/folder/collo',
    name: 'Collo',
    component: LeggiCollo
  },
  {
    path: '/folder/:id',
    component: () => import ('../views/FolderPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
