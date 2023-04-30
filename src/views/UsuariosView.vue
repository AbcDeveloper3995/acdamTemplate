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
const cargosAPI = ref([])
const gruposAPI = ref([])
const usuariosAPI = ref([])
const dataPost = ref({
  pk: '',
  first_name: '',
  last_name: '',
  fk_cargo: '',
  username: '',
  provincia: '',
  password: '',
  email: '',
  groups: '',
})

let loading = ref(false)
let buscar = ref("");
let totalPaginas = 0
let paginaActual = 0


//PETICION GET PARA OBTENER LOS USUARIOS YA PAGINADOS
const getUsuariosPaginados = async (NoPagina = 1) => {
  try {
    let url = `usuario/${NoPagina}/paginado`
    loading = true
    let response = await axios.get(url)
    loading = false
    usuariosAPI.value = response.data.items
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

//FUNCION QUE BUSCAR EL USUARIO A EDITAR Y PINTAR SUS DATOS EN EL FORMULARIO PARA SU POSTERIOR EDICION
const editarUsuario = async (item, index) => {
  expandir.value = false
  indice.value = index
  let url = `usuario/${item.id}/`
  axios.get(url)
      .then((response) => {
        dataPost.value.pk = response.data.data.id
        dataPost.value.first_name = response.data.data.first_name
        dataPost.value.last_name = response.data.data.last_name
        dataPost.value.fk_cargo = response.data.data.fk_cargo
        dataPost.value.username = response.data.data.username
        dataPost.value.provincia = response.data.data.provincia
        dataPost.value.password = response.data.data.password
        dataPost.value.email = response.data.data.email
        dataPost.value.groups = response.data.data.groups
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//PROCEDIMIENTO PARA FILTRAR EN LA TABLA
const listaFiltrada = () => usuariosAPI.value.filter((item) =>
    item.first_name.toLowerCase().includes(buscar.value.toLowerCase())
);

//PROCEDIMIENTO PARA EL PAGINADO
const getPaginaAnterior = () => {
  if (paginaActual > 1) {
    paginaActual--
  }
  getUsuariosPaginados(paginaActual)
}
const getPaginaSiguiente = () => {
  if (paginaActual < totalPaginas) {
    paginaActual++
  }
  getUsuariosPaginados(paginaActual)
}
const isActive = (pagina) => {
  return pagina == paginaActual ? 'active' : ''
}

onMounted(() => {
  getUsuariosPaginados()
  GET("usuario/cargo/", cargosAPI)
  GET("usuario/grupo/", gruposAPI)
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="router.push('/home')"><i class="bi bi-house-fill"></i></a></li>
          <li class="breadcrumb-item active">Usuario</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <!--      RENDERIZADO DEL FORMULARIO-->
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <ul class="sidebar-nav p-2" id="cardFormulario">
              <a class="nav-link collapsed" style="background: None" data-bs-target="#formularioUsuario"
                 data-bs-toggle="collapse" href="#"
                 aria-expanded="false"> <i class="bi-plus-circle"></i>
                <strong>{{ indice == -1 ? 'Nuevo usuario' : 'Actualizar usuario' }}</strong><i
                    class="bi bi-chevron-down ms-auto"></i>  </a>

            </ul>
            <div class="card-body nav-content" :class="expandir ? 'collapse':''" id="formularioUsuario"
                 data-bs-parent="#cardFormulario">
              <form class="row g-3" id="formPrueba">
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.first_name"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.last_name"
                                                    id="floatingEmail" placeholder="Apellidos"> <label
                      for="floatingEmail">Apellidos</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.provincia">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Provincia que atiende</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_cargo">
                      <option v-for="item in cargosAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Cargo</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.username"
                                                    id="floatingEmail" placeholder="nivel"> <label for="floatingEmail">Nombre usuario</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="password" class="styleInput form-control" v-model="dataPost.password"
                                                    id="floatingPassword" placeholder="Dorsal"> <label
                      for="floatingPassword">Contraseña</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="email" class="styleInput form-control" v-model="dataPost.email"
                                                    id="floatingPassword" placeholder="Goles"> <label
                      for="floatingPassword">Correo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Posicion" v-model="dataPost.groups" multiple>
                      <option v-for="(item, index) in gruposAPI" :key="index" :value="item.id">
                        {{ item.name }}
                      </option>
                    </select>
                    <label for="floatingSelect">Rol</label>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('usuario/', dataPost, indice)"  class="miBtn btn btn-outline-light" type="button">
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
              <h5 class="card-title"><i class="bi bi-layout-text-window-reverse"></i><strong> Listado de Usuarios</strong></h5>
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
                    <li v-for="pagina in totalPaginas" @click="getUsuariosPaginados(pagina)" class="page-item"
                        :class="isActive(pagina)"><a class="page-link" href="#">{{ pagina }}</a></li>
                    <li class="page-item" @click="getPaginaSiguiente()"><a class="page-link" href="#" aria-label="Next"> <span
                        aria-hidden="true">»</span> </a></li>
                    <li class="page-item" @click="getUsuariosPaginados(paginaActual)"><a class="page-link" title="Refrescar" href="#" aria-label="Next">
                      <i class="bi bi-arrow-repeat"></i> </a></li>
                  </ul>
                </nav>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Acciones</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Cargo</th>
                    <th scope="col">Username</th>
                    <th scope="col">Provincia que atiende</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Rol</th>
                  </tr>
                  </thead>
                  <tbody>
                  <div v-if="loading"><span class="loader"></span></div>
                  <tr v-for="(item, index) in listaFiltrada()" :key="item.id">
                    <td>
                        <span class="sombra badge bg-primary" @click="editarUsuario(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                      <span class="sombra badge bg-danger m-lg-1" @click="DELETE('usuario/'+item.id)"
                            title="Eliminar"><i class="bi bi-trash"></i></span>
                    </td>
                    <td>{{ item.first_name }}</td>
                    <td>{{ item.last_name }}</td>
                    <td>{{ item.fk_cargo }}</td>
                    <td>{{ item.username }}</td>
                    <td>{{ item.provincia }}</td>
                    <td>{{ item.email }}</td>
                    <td><span class="badge bg-primary"  style="margin-left: 5px" v-for="i in item.groups">{{ i.name }}</span></td>
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