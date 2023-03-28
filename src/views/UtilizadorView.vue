<script setup>
import axios from "axios";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'
import CHOICES from '../util/choicesDeLicenciamiento'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const indice = indiceActualizado //VARIABLE QUE CONTROLA EL COMPORTAMIENTO DEL FORMULARIO DEPENDIENDO SI SE CREAR O SE EDITA
const expandir = expandirActualizado //VARIABLE QUE CONTROLA SI SE EXPANDE O SE CONTRAE EL FORMULARIO
const utilizadorAPI = ref([])
const sectorAPI = ref([])
const dataPost = ref({
  pk: '',
  fk_sector: '',
  nombre: '',
  tipo: '',
  tipoNoEstatal: '',
  tipoDerecho: '',
})

let loading = ref(false)
let buscar = ref("");
let totalPaginas = 0
let paginaActual = 0


//PETICION GET PARA OBTENER LOS UTILIZADORES YA PAGINADOS
const getUtilizadorPaginados = async (NoPagina = 1) => {
  try {
    let url = `licenciamiento/utilizador/${NoPagina}/paginado`
    loading = true
    let response = await axios.get(url)
    loading = false
    utilizadorAPI.value = response.data.items
    totalPaginas = response.data.totalPaginas
    paginaActual = response.data.paginaActual
    if (response.status == 200) {
      console.log('utilizadores cargados')
    }
  } catch (error) {
    console.log("error: ", error.response.data.detail)
    mensaje('error','Error', error.response.data.detail)
  }
}

//FUNCION QUE BUSCAR EL UTILIZADOR A EDITAR Y PINTAR SUS DATOS EN EL FORMULARIO PARA SU POSTERIOR EDICION
const editarUtilizador = async (item, index) => {
  expandir.value = false
  indice.value = index
  let url = `licenciamiento/utilizador/${item.id}/`
  axios.get(url)
      .then((response) => {
        dataPost.value.pk = response.data.data.id
        dataPost.value.nombre = response.data.data.nombre
        dataPost.value.fk_sector = response.data.idSector
        dataPost.value.tipo = response.data.tipo
        dataPost.value.tipoNoEstatal = response.data.data.tipoNoEstatal
        dataPost.value.tipoDerecho = response.data.data.tipoDerecho
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//PROCEDIMIENTO PARA FILTRAR EN LA TABLA
const listaFiltrada = () => utilizadorAPI.value.filter((item) =>
    item.nombre.toLowerCase().includes(buscar.value.toLowerCase())
);

//PROCEDIMIENTO PARA EL PAGINADO
const getPaginaAnterior = () => {
  if (paginaActual > 1) {
    paginaActual--
  }
  getUtilizadorPaginados(paginaActual)
}
const getPaginaSiguiente = () => {
  if (paginaActual < totalPaginas) {
    paginaActual++
  }
  getUtilizadorPaginados(paginaActual)
}
const isActive = (pagina) => {
  return pagina == paginaActual ? 'active' : ''
}

// FUNCION PARA HABILITAR EL CAMPO TIPO NO ESTATAL EN CASO DE SER SELECCIONADO EL VALOR NO ESTATAL EN EL CAMPO TIPO
const habilitarTipoNoEstatal = (event) => {
  let tipoNoEstatal = document.getElementById('tipoNoEstatal')
  event.target.value=='2'?tipoNoEstatal.disabled=false:tipoNoEstatal.disabled=true
}

onMounted(() => {
  getUtilizadorPaginados()
  GET("licenciamiento/sector/", sectorAPI)
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="router.push('/home')"><i class="bi bi-house-fill"></i></a></li>
          <li class="breadcrumb-item active">Utilizador</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <!--      RENDERIZADO DEL FORMULARIO-->
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <ul class="sidebar-nav p-2" id="cardFormulario">
              <a class="nav-link collapsed" style="background: None" data-bs-target="#formularioUtilizador"
                 data-bs-toggle="collapse" href="#"
                 aria-expanded="false"> <i class="bi-plus-circle"></i>
                <strong>{{ indice == -1 ? 'Nuevo utilizador' : 'Actualizar utilizador' }}</strong><i
                    class="bi bi-chevron-down ms-auto"></i>  </a>

            </ul>
            <div class="card-body nav-content" :class="expandir ? 'collapse':''" id="formularioUtilizador"
                 data-bs-parent="#cardFormulario">
              <form class="row g-3">
                <div class="col-md-12">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombre" required
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Nombre</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_sector">
                      <option  value="">----------</option>
                      <option v-for="item in sectorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Sector</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="habilitarTipoNoEstatal" v-model="dataPost.tipo">
                      <option  value="">----------</option>
                      <option v-for="item in CHOICES[0].UTILIZADOR" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Tipo</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="tipoNoEstatal" aria-label="Cargo" v-model="dataPost.tipoNoEstatal" disabled>
                      <option  value="">----------</option>
                      <option v-for="item in CHOICES[3].UTILIZADOR_NO_ESTATAL" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">No estatal</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.tipoDerecho">
                      <option  value="">----------</option>
                      <option v-for="item in CHOICES[2].DERECHOS" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Derecho</label>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/utilizador/', dataPost, indice)"  class="miBtn btn btn-outline-light" type="button">
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
              <h5 class="card-title"><i class="bi bi-layout-text-window-reverse"></i><strong> Listado de Utilizadores</strong></h5>
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
                    <li v-for="pagina in totalPaginas" @click="getUtilizadorPaginados(pagina)" class="page-item"
                        :class="isActive(pagina)"><a class="page-link" href="#">{{ pagina }}</a></li>
                    <li class="page-item" @click="getPaginaSiguiente()"><a class="page-link" href="#" aria-label="Next"> <span
                        aria-hidden="true">»</span> </a></li>
                    <li class="page-item" @click="getUtilizadorPaginados(paginaActual)"><a class="page-link" title="Refrescar" href="#" aria-label="Next">
                      <i class="bi bi-arrow-repeat"></i> </a></li>
                  </ul>
                </nav>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Acciones</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Sector</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Tipo no estatal</th>
                    <th scope="col">Tipo derecho</th>
                    <th scope="col">Tiene Contrato</th>
                  </tr>
                  </thead>
                  <tbody>
                  <div v-if="loading"><span class="loader"></span></div>
                  <tr v-for="(item, index) in listaFiltrada()" :key="item.id">
                    <td>
                        <span class="sombra badge bg-primary" @click="editarUtilizador(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                      <span class="sombra badge bg-danger m-lg-1" @click="DELETE('licenciamiento/utilizador/'+item.id)"
                            title="Eliminar"><i class="bi bi-trash"></i></span>
                    </td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.fk_sector }}</td>
                    <td>{{ item.tipo }}</td>
                    <td><i :class="item.tipoNoEstatal == ''?'bi bi-x-circle-fill':''"
                           :style="item.tipoNoEstatal == ''?'color: red':''"></i>{{item.tipoNoEstatal}}</td>
                    <td>{{ item.tipoDerecho }}</td>
                    <td><i :class="item.tieneContrato?'bi bi-check-circle-fill':'bi bi-x-circle-fill'"
                           :style="item.tieneContrato?'color: green':'color: red'"></i></td>
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