<script setup>
import axios from "axios";
import 'form-wizard-vue3/dist/form-wizard-vue3.css';
import Wizard from 'form-wizard-vue3';

import Base from '@/components/base/Base.vue';
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'





//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const indice = indiceActualizado
const equiposAPI = ref([])
const listaPosiciones = [
  {clave: 'POR', valor: 'Portero'},
  {clave: 'DEF', valor: 'Defensa'},
  {clave: 'LI', valor: 'Lateral Izquierdo'},
  {clave: 'LD', valor: 'Lateral Derecho'},
  {clave: 'MC', valor: 'Medio Campo'},
  {clave: 'EXI', valor: 'Extremo Izquierdo'},
  {clave: 'EXD', valor: 'Extremo Derecho'},
  {clave: 'DEL', valor: 'Delantero'},
]
const jugadoresAPI = ref([])
const expandir = expandirActualizado
const dataPost = {
  pk: '',
  nombre: '',
  apellidos: '',
  fk_equipo: '',
  posicion: '',
  dorsal: '',
  goles: '',
  asistencias: '',
  nivel: '',
  tieneBalonDeOro: false,
  esTitular: false,
}

let loading = ref(false)
let buscar = ref("");
let totalPaginas = 0
let paginaActual = 0
let currentTabIndex = 0


//PETICION GET PARA OBTENER LOS ELEMENTOS YA PAGINADOS
const getJugadoresPaginados = async (NoPagina = 1) => {
  try {
    let url = `uefa/jugador/${NoPagina}/paginado`
    loading = true
    let response = await axios.get(url)
    loading = false
    jugadoresAPI.value = response.data.jugadores
    totalPaginas = response.data.totalPaginas
    paginaActual = response.data.paginaActual
    if (response.status == 200) {
      console.log('jugadores cargados')
    }
  } catch (error) {
    console.log("error: ", error.response.data.detail)
    mensaje('error','Error', error.response.data.detail)
  }
}


//FUCION PARA PASAR LOS DATOS DEL JUGADOR DESDE LA TABLA AL FORMULARIO PARA SU POSTERIOR ELIMINACION
const editarJugador = (item, index) => {
  expandir.value = false
  dataPost.pk = item.id
  indice.value = index
  dataPost.nombre = item.nombre
  dataPost.apellidos = item.apellidos
  dataPost.fk_equipo = item.equipo
  dataPost.posicion = item.posicion
  dataPost.dorsal = item.dorsal
  dataPost.goles = item.goles
  dataPost.asistencias = item.asistencias
  dataPost.nivel = item.nivel
  dataPost.tieneBalonDeOro = item.tieneBalonOro
  dataPost.esTitular = item.esTitular
}

//PARA FILTRAR EN LA TABLA
const listaFiltrada = () => jugadoresAPI.value.filter((item) =>
    item.nombre.toLowerCase().includes(buscar.value.toLowerCase())
);

//PARA EL PAGINADO
const getPaginaAnterior = () => {
  if (paginaActual > 1) {
    paginaActual--
  }
  getJugadoresPaginados(paginaActual)
}
const getPaginaSiguiente = () => {
  if (paginaActual < totalPaginas) {
    paginaActual++
  }
  getJugadoresPaginados(paginaActual)
}
const isActive = (p) => {
  return p == paginaActual ? 'active' : ''
}

//PARA EL WIZARD
const onChangeCurrentTab = (index, oldIndex) => {
  currentTabIndex = index;
}
const onTabBeforeChange = () => {
  if (currentTabIndex === 0) {
    alert('First Tab')
  }
  alert('All Tabs')
}
const wizardCompleted = () => {
  alert('Wizard Completed')
}

onMounted(() => {
  getJugadoresPaginados()
  GET("uefa/equipo/", equiposAPI)
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="router.push('/home')"><i class="bi bi-house-fill"></i></a></li>
          <li class="breadcrumb-item active">Jugadores</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <ul class="sidebar-nav p-2" id="cardFormulario">
              <a class="nav-link collapsed" style="background: None" data-bs-target="#formularioJugador"
                 data-bs-toggle="collapse" href="#"
                 aria-expanded="false"> <i class="bi-plus-circle"></i>
                <strong>{{ indice == -1 ? 'Nuevo jugador' : 'Actualizar jugador' }}</strong><i
                    class="bi bi-chevron-down ms-auto"></i>{{indiceActualizado}}{{expandirActualizado}} </a>

            </ul>
            <div class="card-body nav-content" :class="expandir ? 'collapse':''" id="formularioJugador"
                 data-bs-parent="#cardFormulario">
              <form class="row g-3" id="formPrueba">
                <div class="col-md-12">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombre"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.apellidos"
                                                    id="floatingEmail" placeholder="Apellidos"> <label
                      for="floatingEmail">Apellidos</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Equipo" v-model="dataPost.fk_equipo">
                      <option v-for="item in equiposAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Equipo</label>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Posicion" v-model="dataPost.posicion">
                      <option v-for="(item, index) in listaPosiciones" :key="index" :value="item.clave">
                        {{ item.valor }}
                      </option>
                    </select>
                    <label for="floatingSelect">Posicion</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.nivel"
                                                    id="floatingEmail" placeholder="nivel"> <label for="floatingEmail">Nivel</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.dorsal"
                                                    id="floatingPassword" placeholder="Dorsal"> <label
                      for="floatingPassword">Dorsal</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.goles"
                                                    id="floatingPassword" placeholder="Goles"> <label
                      for="floatingPassword">Goles</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.asistencias"
                                                    id="floatingPassword" placeholder="Asistencias"> <label
                      for="floatingPassword">Asistencias</label></div>
                </div>
                <div class="col-md-6">
                  <div class="col-sm-10">
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"
                                                               v-model="dataPost.tieneBalonDeOro" id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">Tiene balon de oro</label></div>
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"
                                                               v-model="dataPost.esTitular" id="flexSwitchCheckChecked"
                                                               checked="">
                      <label class="form-check-label" for="flexSwitchCheckChecked">Es titular</label></div>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('uefa/jugador/', dataPost,  indice)"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> {{ indice == -1 ? 'Agregar' : 'Actualizar' }}</button>
                  <button v-if="indice==-1" type="reset" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-layout-text-window-reverse"></i><strong> Listado de Jugadores</strong></h5>
              <div class="row">
                <div class="col-sm-2">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="buscar"
                                                    id="floatingEmail" placeholder="Apellidos"> <label
                      for="floatingEmail">Buscar</label></div>
                </div>
              </div>
              <div class="table-responsive">
                <nav aria-label="Page navigation example">
                  <ul class="pagination justify-content-end">
                    <li class="page-item" @click="getPaginaAnterior()"><a class="page-link" href="#"
                                                                        aria-label="Previous"> <span aria-hidden="true">«</span>
                    </a></li>
                    <li v-for="pagina in totalPaginas" @click="getJugadoresPaginados(pagina)" class="page-item"
                        :class="isActive(pagina)"><a class="page-link" href="#">{{ pagina }}</a></li>
                    <li class="page-item" @click="getPaginaSiguiente()"><a class="page-link" href="#" aria-label="Next"> <span
                        aria-hidden="true">»</span> </a></li>
                    <li class="page-item" @click="getJugadoresPaginados(paginaActual)"><a class="page-link" title="Refrescar" href="#" aria-label="Next">
                      <i class="bi bi-arrow-repeat"></i> </a></li>
                  </ul>
                </nav>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Acciones</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Equipo</th>
                    <th scope="col">Posicion</th>
                    <th scope="col">Nivel</th>
                    <th scope="col">Dorsal</th>
                    <th scope="col">Goles en la temp</th>
                    <th scope="col">Asist en la temp</th>
                    <th scope="col">Posee Balones de Oro</th>
                    <th scope="col">es Titular</th>
                  </tr>
                  </thead>
                  <tbody>
                  <div v-if="loading"><span class="loader"></span></div>
                  <tr v-for="(item, index) in listaFiltrada()" :key="item.id">
                    <td>
                        <span class="sombra badge bg-primary" @click="editarJugador(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                      <span class="sombra badge bg-danger m-lg-1" @click="DELETE('uefa/jugador/'+item.id)"
                            title="Eliminar"><i class="bi bi-trash"></i></span>
                    </td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.apellidos }}</td>
                    <td>{{ item.equipo }}</td>
                    <td>{{ item.posicion }}</td>
                    <td>{{ item.nivel }}</td>
                    <td>{{ item.dorsal }}</td>
                    <td>{{ item.goles }}</td>
                    <td>{{ item.asistencias }}</td>
                    <td><i :class="item.tieneBalonOro?'bi bi-check-circle-fill':'bi bi-x-circle-fill'"
                           :style="item.tieneBalonOro?'color: green':'color: red'"></i></td>
                    <td><i :class="item.esTitular?'bi bi-check-circle-fill':'bi bi-x-circle-fill'"
                           :style="item.esTitular?'color: green':'color: red'"></i></td>
                  </tr>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
              <Wizard
                  squared-tabs
                  card-background
                  scrollable-tabs
                  :nextButton="{text: 'Siguiente',
                                icon: 'arrow-right',
                                hideText: false,
                                hideIcon: false,
                                disabled: false}"
                  :backButton="{text: 'Anterior',
                                icon: 'arrow-left',
                                hideText: false,
                                hideIcon: false,
                                disabled: false}"
                  :custom-tabs="[
                                  {
                                    title: 'Step 1',
                                  },
                                  {
                                    title: 'Step 2',
                                  },
                                  {
                                    title: 'Step 3',
                                  },
                                  {
                                    title: 'Step 4',
                                  },
                                  {
                                    title: 'Step 5',
                                  },
                                ]"
                  :beforeChange="onTabBeforeChange"
                  @change="onChangeCurrentTab"
                  @complete:wizard="wizardCompleted"
              >
                <h5 v-if="currentTabIndex === 0">Tab 0</h5>
                <h5 v-if="currentTabIndex === 1">Tab 1</h5>
                <h5 v-if="currentTabIndex === 2">Tab 2</h5>
                <h5 v-if="currentTabIndex === 3">Tab 3</h5>
                <h5 v-if="currentTabIndex === 4">Tab 4</h5>
              </Wizard>
        </div>
      </div>
    </section>
  </main>
  <Base/>
</template>


<style scoped>
.glassmorphism {
  border-radius: 10px;
  background: linear-gradient(to top right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5));
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
  transition: linear 4s ease;
}

.styleInput {
  background: none;
  border-bottom-color: black;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
.miBtn{
  border-radius: 10px;
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
.miBtn:hover{
  box-shadow: none;
}
.sombra {
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}

.sombra:hover {
  box-shadow: none;
}


.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 4px solid #FFF;
  border-right: 4px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border-left: 4px solid #0c63e4;
  border-bottom: 4px solid transparent;
  animation: rotation 0.5s linear infinite reverse;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fw-card{
  background: linear-gradient(to top right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5));
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
  transition: linear 4s ease;
}

.fw-btn{
  background: red !important;
}
</style>