import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/LoginPage.vue'
import LeggiEtichetta from '../views/LeggiEtichetta.vue'
import LeggiCollo from '../views/LeggiCollo.vue'
import VediGiri from '../views/VediGiri.vue'
import ConfermaSciolti from '../views/ConfermaSciolti.vue'
/* import VediDdt from '../views/VediDddt.vue'
import Settings from '../views/Settings.vue'
 */
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
    path: '/folder/sciolti',
    component: ConfermaSciolti
  },
  {
    path: '/folder/collo',
    name: 'Collo',
    component: LeggiCollo
  },
  {
    path: '/folder/giri',
    name: 'Giri',
    component: VediGiri
  },
 /*  {
    path: '/folder/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/folder/ddt',
    name: 'Ddt',
    component: VediDdt
  }, */
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
