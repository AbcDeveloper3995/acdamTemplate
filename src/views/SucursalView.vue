<script setup>
import axios from "axios";

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'
import CHOICES from '../util/choicesDeLicenciamiento'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const indice = indiceActualizado //VARIABLE QUE CONTROLA EL COMPORTAMIENTO DEL FORMULARIO DEPENDIENDO SI SE CREAR O SE EDITA
const expandir = expandirActualizado //VARIABLE QUE CONTROLA SI SE EXPANDE O SE CONTRAE EL FORMULARIO
const sucursalAPI = ref([])
const municipioAPI = ref([])
const dataPost = ref({
  pk: '',
  fk_municipio: '',
  codigo: '',
  provincia: '',
})

let loading = ref(false)
let buscar = ref("");
let totalPaginas = 0
let paginaActual = 0


//PETICION GET PARA OBTENER LAS SUCURSALES YA PAGINADAS
const getSucursalPaginados = async (NoPagina = 1) => {
  try {
    let url = `recaudacion/sucursal/${NoPagina}/paginado`
    loading = true
    let response = await axios.get(url)
    loading = false
    sucursalAPI.value = response.data.items
    totalPaginas = response.data.totalPaginas
    paginaActual = response.data.paginaActual
    if (response.status == 200) {
      console.log('sucursal cargados')
    }
  } catch (error) {
    console.log("error: ", error.response.data.detail)
    mensaje('error','Error', error.response.data.detail)
  }
}

//FUNCION QUE BUSCAR LA SUCURSAL A EDITAR Y PINTAR SUS DATOS EN EL FORMULARIO PARA SU POSTERIOR EDICION
const editarSucursal = async (item, index) => {
  expandir.value = false
  indice.value = index
  let url = `recaudacion/sucursal/${item.id}/`
  axios.get(url)
      .then((response) => {
        dataPost.value.pk = response.data.data.id
        dataPost.value.fk_municipio = response.data.data.fk_municipio
        dataPost.value.codigo = response.data.data.codigo
        dataPost.value.provincia = response.data.data.provincia
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//PROCEDIMIENTO PARA FILTRAR EN LA TABLA
const listaFiltrada = () => sucursalAPI.value.filter((item) =>
    item.codigo.toString().toLowerCase().includes(buscar.value.toLowerCase())
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

//FUNCION PARA OBTENER LOS MUNICIPIOS SEGUN LA PROVINCIA SELECCIONADA
const getMunicipios = (event) => {
  let slug = event.target.value
  let url = `licenciamiento/representante/${slug}/getMunicipios/`
  axios.get(url)
      .then((response) => {
        municipioAPI.value = response.data
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

onMounted(() => {
  getSucursalPaginados()
  GET("licenciamiento/municipio/", municipioAPI)
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="router.push('/home')"><i class="bi bi-house-fill"></i></a></li>
          <li class="breadcrumb-item active">Sucursal</li>
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
                <strong>{{ indice == -1 ? 'Nueva sucursal' : 'Actualizar sucursal' }}</strong><i
                    class="bi bi-chevron-down ms-auto"></i>  </a>

            </ul>
            <div class="card-body nav-content" :class="expandir ? 'collapse':''" id="formularioCargo"
                 data-bs-parent="#cardFormulario">
              <form class="row g-3">
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo" required
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Codigo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getMunicipios" v-model="dataPost.provincia">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Provincia</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_municipio">
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Municipio</label>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('recaudacion/sucursal/', dataPost, indice)"  class="miBtn btn btn-outline-light" type="button">
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
              <h5 class="card-title"><i class="bi bi-layout-text-window-reverse"></i><strong> Listado de Sucursal</strong></h5>
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
                    <li class="page-item" @click="getSucursalPaginados(paginaActual)"><a class="page-link" title="Refrescar" href="#" aria-label="Next">
                      <i class="bi bi-arrow-repeat"></i> </a></li>
                  </ul>
                </nav>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Acciones</th>
                    <th scope="col">Codigo</th>
                    <th scope="col">Provincia</th>
                    <th scope="col">Municipio</th>
                  </tr>
                  </thead>
                  <tbody>
                  <div v-if="loading"><span class="loader"></span></div>
                  <tr v-for="(item, index) in listaFiltrada()" :key="item.id">
                    <td>
                        <span class="sombra badge bg-primary" @click="editarSucursal(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                      <span class="sombra badge bg-danger m-lg-1" @click="DELETE('recaudacion/sucursal/'+item.id)"
                            title="Eliminar"><i class="bi bi-trash"></i></span>
                    </td>
                    <td>{{ item.codigo }}</td>
                    <td>{{ item.provincia }}</td>
                    <td>{{ item.fk_municipio }}</td>
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