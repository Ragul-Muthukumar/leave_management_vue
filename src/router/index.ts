import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import Leaves from '../pages/Leaves.vue'
import UserDashboard from '../pages/UserDashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaves',
    name: 'Leaves',
    component: Leaves
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/userDashboard',
    name: 'User Dashboard',
    component: UserDashboard
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;
  const isManager = user.role === 1;

  if (!isLoggedIn && to.path !== '/login') {
    return next('/login');
  }

  if (isLoggedIn && to.path === '/login') {
    return next(isManager ? '/dashboard' : '/userDashboard');
  }

  if (to.path === '/') {
    return next(isManager ? '/dashboard' : '/userDashboard');
  }
  const adminRoutes = ['/dashboard', '/register', '/leaves'];

  if (adminRoutes.includes(to.path) && !isManager) {
    return next('/userDashboard');
  }

  next();
});



export default router
