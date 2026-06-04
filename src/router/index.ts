import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      const last = localStorage.getItem('marmotte.route')
      const known = ['planning', 'inventaire', 'courses', 'architecture']
      return last && known.includes(last) ? `/${last}` : '/planning'
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { bare: true },
  },
  { path: '/planning', name: 'planning', component: () => import('@/views/PlanningView.vue') },
  { path: '/inventaire', name: 'inventaire', component: () => import('@/views/InventoryView.vue') },
  { path: '/courses', name: 'courses', component: () => import('@/views/CoursesView.vue') },
  {
    path: '/architecture',
    name: 'architecture',
    component: () => import('@/views/ArchitectureView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  if (to.name && to.name !== 'login') {
    localStorage.setItem('marmotte.route', String(to.name))
  }
})

// JWT guard — wired in block 2 (auth). For now everything is reachable.
// router.beforeEach((to) => {
//   if (to.meta.bare) return true
//   const token = localStorage.getItem('jwt')
//   if (!token) return { name: 'login' }
//   return true
// })

export default router
