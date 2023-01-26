import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '@/views/DashBoard.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/home',
      name: 'dashboard',
      component: DashBoard,
      meta: {requiresAuth:true}

    },
    {
      path: '/cargo',
      name: 'cargo',
      component: () => import('../views/CargoView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/concepto',
      name: 'concepto',
      component: () => import('../views/ConceptoView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/modalidad',
      name: 'modalidad',
      component: () => import('../views/ModalidadView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/sector',
      name: 'sector',
      component: () => import('../views/SectorView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/licenciamiento',
      name: 'licenciamiento',
      component: () => import('../views/LicenciamientoView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/contratoLicencia',
      name: 'contratoLicencia',
      component: () => import('../views/ContratoLicenciaView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/recaudacion',
      name: 'recaudacion',
      component: () => import('../views/RecaudacionView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/reporteCobro',
      name: 'reporteCobro',
      component: () => import('../views/ReportesView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/reclamaciones',
      name: 'reclamaciones',
      component: () => import('../views/ReclamacionesView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/contratos',
      name: 'contratos',
      component: () => import('../views/ContratosView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/controlServiciosJuridicos',
      name: 'controlServiciosJuridicos',
      component: () => import('../views/ControlServiciosJuridicosView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/controlPagosServiciosJuridicos',
      name: 'controlPagosServiciosJuridicos',
      component: () => import('../views/ControlPagosServiciosJuridicosView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/ReportesView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/grupos',
      name: 'grupos',
      component: () => import('../views/GruposView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/UsuariosView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/trazas',
      name: 'trazas',
      component: () => import('../views/TrazasView.vue'),
      meta: {requiresAuth:true}
    },
    {
      path: '/jugadores',
      name: 'jugadores',
      component: () => import('../views/Jugadores.vue'),
      meta: {requiresAuth:true}
    },
  ]
})

// PROTECCION DE RUTAS
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if(to.matched.some(route => route.meta.requiresAuth)){
    if(!token){
      next('/')
    }else {
      next()
    }
  }else {
    console.log('no match')
    next()
  }
})

export default router
