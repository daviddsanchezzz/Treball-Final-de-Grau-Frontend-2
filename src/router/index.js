import { createRouter, createWebHistory } from 'vue-router'

// Vistas principales
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDashboard from '../views/UserDashboard.vue'
import UserLogin from '../views/UserLogin.vue'
import CambiarContrasenya from '../views/User/CambiarContrasenya.vue'

// Vistas admin
import ListaUsuarios from '../views/Admin/ListaUsuarios.vue'
import ListaTrabajos from '../views/Admin/ListaTrabajos.vue'
import ListaRubricas from '../views/Admin/ListaRubricas.vue'
import ListaAreas from '../views/Admin/ListaAreas.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: UserLogin
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin
  },
  {
    path: '/admin/:id',
    name: 'AdminDashboard',
    component: AdminDashboard,
    children: [
      {
        path: 'usuarios',
        name: 'ListaUsuarios',
        component: ListaUsuarios
      },
      {
        path: 'trabajos',
        name: 'ListaTrabajos',
        component: ListaTrabajos
      },
      {
        path: 'areas',
        name: 'ListaAreas',
        component: ListaAreas,
      },
      {
        path: 'rubricas',
        name: 'ListaRubricas',
        component: ListaRubricas
      }
    ]
  },
  {
    path: '/user/:id',
    name: 'UserDashboard',
    component: UserDashboard,
  },
  {
    path: '/user/:id/cambiar-contrasenya',
    name: 'CambiarContrasenya',
    component: CambiarContrasenya
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
