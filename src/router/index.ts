import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DesignView from '../views/DesignView.vue'
import DashboardView from '../views/DashboardView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import AdminPanelView from '../views/AdminPanelView.vue'
import ProductListView from '../views/ProductListView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      component: ProductListView
    },
    {
      path: '/design',
      name: 'design',
      component: DesignView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanelView
    }
  ]
})

export default router
