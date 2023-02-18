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
const representanteAPI = ref([])
const municipioAPI = ref([])
const utilizadorAPI = ref([])
const sectorAPI = ref([])
const usuarioAPI = ref([])
const dataPost = ref({
  pk: '',
  nombre: '',
  apellidos: '',
  ci: '',
  provincia: '',
  fk_municipio: '',
  fk_utilizador: '',
  fk_sector: '',
  fk_usuario: '',
  direccion: '',
  nivelEscolaridad: '',
  codigo: '',
  email: '',
})

let loading = ref(false)
let buscar = ref("");
let totalPaginas = 0
let paginaActual = 0


//PETICION GET PARA OBTENER LOS REPRESENTANTES YA PAGINADOS
const getRepresentantesPaginados = async (NoPagina = 1) => {
  try {
    let url = `licenciamiento/representante/${NoPagina}/paginado`
    loading = true
    let response = await axios.get(url)
    loading = false
    representanteAPI.value = response.data.items
    totalPaginas = response.data.totalPaginas
    paginaActual = response.data.paginaActual
    if (response.status == 200) {
      console.log('representante cargados', response.data.items)
    }
  } catch (error) {
    console.log("error: ", error.response.data.detail)
    mensaje('error','Error', error.response.data.detail)
  }
}

//FUNCION QUE BUSCAR EL REPRESENTANTES A EDITAR Y PINTAR SUS DATOS EN EL FORMULARIO PARA SU POSTERIOR EDICION
const editarRepresentante = async (item, index) => {
  expandir.value = false
  indice.value = index
  let url = `licenciamiento/representante/${item.id}/`
  axios.get(url)
      .then((response) => {
        console.log(response.data)
        dataPost.value.pk = response.data.data.id
        dataPost.value.nombre = response.data.data.nombre
        dataPost.value.apellidos = response.data.data.apellidos
        dataPost.value.ci = response.data.data.ci
        dataPost.value.provincia = response.data.data.provincia
        dataPost.value.fk_municipio = response.data.data.fk_municipio
        dataPost.value.fk_utilizador = response.data.data.fk_utilizador
        dataPost.value.fk_sector = response.data.data.fk_sector
        dataPost.value.fk_usuario = response.data.data.fk_usuario
        dataPost.value.direccion = response.data.data.direccion
        dataPost.value.nivelEscolaridad = response.data.data.nivelEscolaridad
        dataPost.value.codigo = response.data.data.codigo
        dataPost.value.email = response.data.data.email
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//PROCEDIMIENTO PARA FILTRAR EN LA TABLA
const listaFiltrada = () => representanteAPI.value.filter((item) =>
    item.nombre.toLowerCase().includes(buscar.value.toLowerCase())
);

//PROCEDIMIENTO PARA EL PAGINADO
const getPaginaAnterior = () => {
  if (paginaActual > 1) {
    paginaActual--
  }
  getRepresentantesPaginados(paginaActual)
}
const getPaginaSiguiente = () => {
  if (paginaActual < totalPaginas) {
    paginaActual++
  }
  getRepresentantesPaginados(paginaActual)
}
const isActive = (pagina) => {
  return pagina == paginaActual ? 'active' : ''
}

onMounted(() => {
  getRepresentantesPaginados()
  GET("licenciamiento/municipio/", municipioAPI)
  GET("licenciamiento/utilizador/", utilizadorAPI)
  GET("licenciamiento/sector/", sectorAPI)
  GET("usuario/", usuarioAPI)
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="router.push('/home')"><i class="bi bi-house-fill"></i></a></li>
          <li class="breadcrumb-item active">Representante</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <!--      RENDERIZADO DEL FORMULARIO-->
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <ul class="sidebar-nav p-2" id="cardFormulario">
              <a class="nav-link collapsed" style="background: None" data-bs-target="#formularioRepresentante"
                 data-bs-toggle="collapse" href="#"
                 aria-expanded="false"> <i class="bi-plus-circle"></i>
                <strong>{{ indice == -1 ? 'Nuevo representante' : 'Actualizar representante' }}</strong><i
                    class="bi bi-chevron-down ms-auto"></i>  </a>

            </ul>
            <div class="card-body nav-content" :class="expandir ? 'collapse':''" id="formularioRepresentante"
                 data-bs-parent="#cardFormulario">
              <form class="row g-3">
                <div class="col-md-12">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombre"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.apellidos"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Apellidos</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.ci"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Carnet Identidad</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.provincia">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Provincia</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_municipio" multiple>
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Municipio</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_utilizador" multiple>
                      <option v-for="item in utilizadorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Utilizador</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_sector" multiple>
                      <option v-for="item in sectorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Sector</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_usuario">
                      <option v-for="item in usuarioAPI" :key="item.id" :value="item.id">{{ item.first_name }}
                      </option>
                    </select>
                    <label for="floatingSelect">Atendido por</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.nivelEscolaridad">
                      <option v-for="item in CHOICES[4].NIVEL_ESCOLARIDAD" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Escolaridad</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="email" class="styleInput form-control" v-model="dataPost.email"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Correo</label></div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/representante/', dataPost, indice)"  class="miBtn btn btn-outline-light" type="button">
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
              <h5 class="card-title"><i class="bi bi-layout-text-window-reverse"></i><strong> Listado de Representantes</strong></h5>
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
                    <li v-for="pagina in totalPaginas" @click="getRepresentantesPaginados(pagina)" class="page-item"
                        :class="isActive(pagina)"><a class="page-link" href="#">{{ pagina }}</a></li>
                    <li class="page-item" @click="getPaginaSiguiente()"><a class="page-link" href="#" aria-label="Next"> <span
                        aria-hidden="true">»</span> </a></li>
                    <li class="page-item" @click="getRepresentantesPaginados(paginaActual)"><a class="page-link" title="Refrescar" href="#" aria-label="Next">
                      <i class="bi bi-arrow-repeat"></i> </a></li>
                  </ul>
                </nav>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Acciones</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">CI</th>
                    <th scope="col">Provincia</th>
                    <th scope="col">Municipios</th>
                    <th scope="col">Utilizadores</th>
                    <th scope="col">Sectores</th>
                    <th scope="col">Direccion</th>
                    <th scope="col">Escolaridad</th>
                    <th scope="col">Codigo</th>
                    <th scope="col">Correo</th>
                  </tr>
                  </thead>
                  <tbody>
                  <div v-if="loading"><span class="loader"></span></div>
                  <tr v-for="(item, index) in listaFiltrada()" :key="item.id">
                    <td>
                        <span class="sombra badge bg-primary" @click="editarRepresentante(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                      <span class="sombra badge bg-danger m-lg-1" @click="DELETE('licenciamiento/representante/'+item.id)"
                            title="Eliminar"><i class="bi bi-trash"></i></span>
                    </td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.apellidos }}</td>
                    <td>{{ item.ci }}</td>
                    <td>{{item.provincia}}</td>
                    <td><span class="badge bg-primary"  style="margin-left: 5px" v-for="i in item.fk_municipio">{{ i.nombre }}</span></td>
                    <td><span class="badge bg-primary"  style="margin-left: 5px" v-for="i in item.fk_utilizador">{{ i.nombre }}</span></td>
                    <td><span class="badge bg-primary"  style="margin-left: 5px" v-for="i in item.fk_sector">{{ i.nombre }}</span></td>
                    <td>{{ item.direccion }}</td>
                    <td>{{ item.nivelEscolaridad }}</td>
                    <td>{{ item.codigo }}</td>
                    <td>{{ item.email }}</td>
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