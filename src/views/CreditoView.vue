<script setup>
import axios from "axios";

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'
import CHOICES from '../util/choicesDeRecaudacion'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const indice = indiceActualizado //VARIABLE QUE CONTROLA EL COMPORTAMIENTO DEL FORMULARIO DEPENDIENDO SI SE CREAR O SE EDITA
const expandir = expandirActualizado //VARIABLE QUE CONTROLA SI SE EXPANDE O SE CONTRAE EL FORMULARIO
const creditoAPI = ref([])
const recaudacionAPI = ref([])
const utilizadorAPI = ref([])
const sucursalAPI = ref([])
const dataPost = ref({
pk: '',
  fk_recaudacion: '',
  fk_utilizador: '',
  fk_sucursal: '',
  provincia: '',
  municipio: '',
  transferencia: '',
  cheque: '',
  factura: '',
  devolucion: '',
  tipoEstatal: '',
})

let loading = ref(false)
let buscar = ref("");
let totalPaginas = 0
let paginaActual = 0


//PETICION GET PARA OBTENER LOS CREDITOS YA PAGINADOS
const getCreditoPaginados = async (NoPagina = 1) => {
try {
let url = `recaudacion/credito/${NoPagina}/paginado`
loading = true
let response = await axios.get(url)
loading = false
  creditoAPI.value = response.data.items
totalPaginas = response.data.totalPaginas
paginaActual = response.data.paginaActual
if (response.status == 200) {
console.log('credito cargados')
}
} catch (error) {
console.log("error: ", error.response.data.detail)
mensaje('error','Error', error.response.data.detail)
}
}

//FUNCION QUE BUSCAR El CREDITO A EDITAR Y PINTAR SUS DATOS EN EL FORMULARIO PARA SU POSTERIOR EDICION
const editarCredito = async (item, index) => {
expandir.value = false
indice.value = index
let url = `recaudacion/credito/${item.id}/`
axios.get(url)
.then((response) => {
dataPost.value.pk = response.data.data.id
dataPost.value.fk_recaudacion = response.data.data.fk_recaudacion
dataPost.value.fk_utilizador = response.data.data.fk_utilizador
dataPost.value.fk_sucursal = response.data.data.fk_sucursal
dataPost.value.provincia = response.data.data.provincia
dataPost.value.municipio = response.data.data.municipio
dataPost.value.transferencia = response.data.data.transferencia
dataPost.value.cheque = response.data.data.cheque
dataPost.value.factura = response.data.data.factura
dataPost.value.devolucion = response.data.data.devolucion
dataPost.value.tipoEstatal = response.data.data.tipoEstatal
})
.catch((error) => {
mensaje('error','Error', error.response.data.error)
})
}

//PROCEDIMIENTO PARA FILTRAR EN LA TABLA
const listaFiltrada = () => creditoAPI.value.filter((item) =>
item.fk_utilizador.toLowerCase().includes(buscar.value.toLowerCase())
);

//PROCEDIMIENTO PARA EL PAGINADO
const getPaginaAnterior = () => {
if (paginaActual > 1) {
paginaActual--
}
getCargosPaginados(paginaActual)
}
const getPaginaSiguiente = () => {
if (paginaActual < totalPaginas) {
paginaActual++
}
getCargosPaginados(paginaActual)
}
const isActive = (pagina) => {
return pagina == paginaActual ? 'active' : ''
}

onMounted(() => {
  getCreditoPaginados()
  GET("recaudacion/recaudacion/", recaudacionAPI)
  GET("recaudacion/sucursal/", sucursalAPI)
  GET("licenciamiento/utilizador/", utilizadorAPI)
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="router.push('/home')"><i class="bi bi-house-fill"></i></a></li>
          <li class="breadcrumb-item active">Credito</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <!--      RENDERIZADO DEL FORMULARIO-->
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <ul class="sidebar-nav p-2" id="cardFormulario">
              <a class="nav-link collapsed" style="background: None" data-bs-target="#formularioCargo"
                 data-bs-toggle="collapse" href="#"
                 aria-expanded="false"> <i class="bi-plus-circle"></i>
                <strong>{{ indice == -1 ? 'Nuevo credito' : 'Actualizar credito' }}</strong><i
                    class="bi bi-chevron-down ms-auto"></i>  </a>

            </ul>
            <div class="card-body nav-content" :class="expandir ? 'collapse':''" id="formularioCargo"
                 data-bs-parent="#cardFormulario">
              <form class="row g-3">
                <div class="col-md-4">
                  <label for="inputState" class="form-label" style="margin-left: 15px"><span class="text-danger">* </span>Recaudacion</label>
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_recaudacion">
                    <option v-for="item in recaudacionAPI" :key="item.id" :value="item.id">{{ item.fechaCreacion }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="inputState" class="form-label" style="margin-left: 15px"><span class="text-danger">* </span>Sucursal</label>
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_sucursal">
                    <option v-for="item in sucursalAPI" :key="item.id" :value="item.id">{{ item.codigo }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="inputState" class="form-label" style="margin-left: 15px"><span class="text-danger">* </span>Utilizador</label>
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_utilizador">
                    <option v-for="item in utilizadorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.provincia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Provincia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.municipio"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Municipio</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.transferencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Transferencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.cheque"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Cheque</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.factura"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Factura</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.devolucion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Devolucion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.tipoEstatal">
                      <option v-for="item in CHOICES[0].CREDITO" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Tipo</label>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('recaudacion/credito/', dataPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> {{ indice == -1 ? 'Agregar' : 'Actualizar' }}</button>
                  <button v-if="indice==-1" type="reset" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!--      RENDERIZADO DE LA TABLA-->
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-layout-text-window-reverse"></i><strong> Listado de Creditos</strong></h5>
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
                    <li v-for="pagina in totalPaginas" @click="getCargosPaginados(pagina)" class="page-item"
                        :class="isActive(pagina)"><a class="page-link" href="#">{{ pagina }}</a></li>
                    <li class="page-item" @click="getPaginaSiguiente()"><a class="page-link" href="#" aria-label="Next"> <span
                        aria-hidden="true">»</span> </a></li>
                    <li class="page-item" @click="getCreditoPaginados(paginaActual)"><a class="page-link" title="Refrescar" href="#" aria-label="Next">
                      <i class="bi bi-arrow-repeat"></i> </a></li>
                  </ul>
                </nav>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Acciones</th>
                    <th scope="col">Utilizador</th>
                    <th scope="col">sucursal</th>
                    <th scope="col">Provincia</th>
                    <th scope="col">Municipio</th>
                    <th scope="col">Transferencia</th>
                    <th scope="col">Cheque</th>
                    <th scope="col">Factura</th>
                    <th scope="col">Devolucion</th>
                    <th scope="col">Tipo</th>
                  </tr>
                  </thead>
                  <tbody>
                  <div v-if="loading"><span class="loader"></span></div>
                  <tr v-for="(item, index) in listaFiltrada()" :key="item.id">
                    <td>
                        <span class="sombra badge bg-primary" @click="editarCredito(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                      <span class="sombra badge bg-danger m-lg-1" @click="DELETE('recaudacion/credito/'+item.id)"
                            title="Eliminar"><i class="bi bi-trash"></i></span>
                    </td>
                    <td>{{ item.fk_utilizador }}</td>
                    <td>{{ item.fk_sucursal }}</td>
                    <td>{{ item.provincia }}</td>
                    <td>{{ item.municipio }}</td>
                    <td>{{ item.transferencia }}</td>
                    <td>{{ item.cheque }}</td>
                    <td>{{ item.factura }}</td>
                    <td>{{ item.devolucion }}</td>
                    <td>{{ item.tipoEstatal }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
</style>