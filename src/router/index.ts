import { createRouter, createWebHistory } from 'vue-router'
import TutorsView from '../views/TutorsView.vue'
import PetsView from '../views/PetsView.vue'
import SchedulesView from '../views/SchedulesView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/tutores',
    alias: '/tutors',
    name: 'Tutors',
    component: TutorsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pets',
    name: 'Pets',
    component: PetsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/agendamentos',
    alias: '/schedules',
    name: 'Schedules',
    component: SchedulesView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('user_token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router