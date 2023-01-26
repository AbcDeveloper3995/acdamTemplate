<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import {onMounted, ref} from "vue";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";

const token = localStorage.getItem('token')
const indice = ref(-1)
const pkJugador = ref('')
const nombre = ref('')
const apellidos = ref('')
const equipo = ref('')
const posicion = ref('')
const dorsal = ref('')
const goles = ref('')
const asistencias = ref('')
const nivel = ref('')
const tieneBalonDeOro = ref(false)
const esTitular = ref(false)
let equiposAPI = []
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
let loading = ref(false)
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})


onMounted(() => getJugadores())
onMounted(() => getEquipos())

const getJugadores = async () => {
  try {
    let url = "uefa/jugador/"
    loading = true
    let response = await axios.get(url)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    loading = false
    jugadoresAPI.value = response.data
    console.log(response.data)
    if (response.status == 200) {
      // response.data.forEach(item => {
      //   console.log(item.nombre)
      // })
      // Toast.fire({
      //   icon: 'success',
      //   title: 'Jugadores cargados con exito.'
      // })
      console.log('jugadores cargados')
    }
  } catch (error) {
    console.log("error: ", error.response.data.detail)
    Swal.fire(error.response.data.detail)
  }
}
const getEquipos = async () => {
  let url = "uefa/equipo/"
  try {
    let response = await axios.get(url)
    // response.data.forEach(item=>{
    //   equiposAPI.push(item.nombreDelEquipo)
    // })
    equiposAPI = response.data
    console.log(equiposAPI)
    if (response.status == 200) {
      console.log('todo ok')
    }
  } catch (error) {
    console.log("error: ", error)
    Swal.fire(error)
  }
}
const submitAjax = async (e) => {
  e.preventDefault()
  try {

    let dataPost = {
      pk:pkJugador.value,
      nombre: nombre.value,
      apellidos: apellidos.value,
      fk_equipo: equipo.value,
      posicion: posicion.value,
      dorsal: dorsal.value,
      goles: goles.value,
      asistencias: asistencias.value,
      nivel: nivel.value,
      tieneBalonDeOro: tieneBalonDeOro.value,
      esTitular: esTitular.value,
    }
    if(indice.value==-1){
      let url = "uefa/jugador/"
      let response = await axios.post(url, dataPost)
      console.log(response.data)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      console.log(1, response)
      if (response.status == 201) {
        Swal.fire(response.data.message)
        getJugadores()
      }
    }else {
      console.log(dataPost)
      let url = "uefa/jugador/"+dataPost.pk+"/"
      let response = await axios.put(url, dataPost)
      console.log(response.data)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      console.log(1, response)
      if (response.status == 200) {
        Swal.fire(response.data.message)
        indice.value = -1
        getJugadores()
      }
    }

  } catch (error) {
    console.log("error: ", error)
    if (error.response.status == 400) {
      let dataError = error.response.data
      let claves = Object.keys(dataError)
      claves.forEach(item => {
        Swal.fire("Error en " + item, dataError[item][0])
      })
    } else if (error.response.status == 500) {
        Swal.fire("Error", "Ha ocurrido un error interno en el servidor.")
    }
  }


}
const eliminarJugador = (id) => {
  Swal.fire({
    title: 'Atencion',
    text: "Estas seguro de querer eliminar este jugador ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'No',
    confirmButtonText: 'Si, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      let url = "uefa/jugador/" + id
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      axios.delete(url).then((response) => {
        if (response.status == 200) {
          getJugadores()
          Toast.fire({
            icon: 'success',
            title: response.data.message
          })
        }
      }).catch((error) => {
        console.log("error: ", error.response.data.error)
        Swal.fire(error.response.data.error)
      })

    }
  })
}

const editarJugador = (item, index) => {
  pkJugador.value = item.id
  indice.value = index
  nombre.value = item.nombre
  apellidos.value = item.apellidos
  equipo.value = item.equipo
  posicion.value = item.posicion
  dorsal.value = item.dorsal
  goles.value = item.goles
  asistencias.value = item.asistencias
  nivel.value = item.nivel
  tieneBalonDeOro.value = item.tieneBalonOro
  esTitular.value = item.esTitular
}

</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
          <li class="breadcrumb-item active">Jugadores</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
              <ul class="sidebar-nav p-2" id="cardFormulario">
                  <a class="nav-link collapsed" style="background: None" data-bs-target="#formularioJugador" data-bs-toggle="collapse" href="#"
                     aria-expanded="false"> <i class="bi-plus-circle"></i> <strong>{{indice==-1?'Nuevo jugador':'Actualizar jugador'}}</strong><i class="bi bi-chevron-down ms-auto"></i> </a>

              </ul>
            <div class="card-body nav-content collapse" id="formularioJugador"  data-bs-parent="#cardFormulario">
              <form class="row g-3" id="formPrueba">
                <div class="col-md-12">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="nombre" id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="apellidos"
                                                    id="floatingEmail" placeholder="Apellidos"> <label
                      for="floatingEmail">Apellidos</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Equipo" v-model="equipo">
                      <option v-for="item in equiposAPI" :key="item.id" :value="item.id">{{ item.nombre}}
                      </option>
                    </select>
                    <label for="floatingSelect">Equipo</label>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Posicion" v-model="posicion">
                      <option v-for="(item, index) in listaPosiciones" :key="index" :value="item.clave">
                        {{ item.valor }}
                      </option>
                    </select>
                    <label for="floatingSelect">Posicion</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="nivel"
                                                    id="floatingEmail" placeholder="nivel"> <label for="floatingEmail">Nivel</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dorsal"
                                                    id="floatingPassword" placeholder="Dorsal"> <label
                      for="floatingPassword">Dorsal</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="goles"
                                                    id="floatingPassword" placeholder="Goles"> <label
                      for="floatingPassword">Goles</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="asistencias"
                                                    id="floatingPassword" placeholder="Asistencias"> <label
                      for="floatingPassword">Asistencias</label></div>
                </div>
                <div class="col-md-6">
                  <div class="col-sm-10">
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"
                                                               v-model="tieneBalonDeOro" id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">Tiene balon de oro</label></div>
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"
                                                               v-model="esTitular" id="flexSwitchCheckChecked"
                                                               checked="">
                      <label class="form-check-label" for="flexSwitchCheckChecked">Es titular</label></div>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="submitAjax" class="miBtn btn btn-primary" type="submit">{{indice==-1?'Agregar':'Actualizar'}}
                    <i class="bi bi-arrow-bar-right"></i></button>
                  <button v-if="indice==-1" type="reset" class="btn btn-secondary m-lg-1">Resetear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="row">
            <div class="col-12">
              <div class="card glassmorphism">
                <div class="card-body">
                  <h5 class="card-title">Tabla</h5>
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
                    <div v-if="loading" class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span>
                    </div>
                    <tr v-for="(item, index) in jugadoresAPI" :key="item.id">
                      <td>
                        <span class="sombra badge bg-primary" @click="editarJugador(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                        <span class="sombra badge bg-danger m-lg-1" @click="eliminarJugador(item.id)"
                              title="Eliminar"><i class="bi bi-trash"></i></span>
                      </td>
                      <td>{{ item.nombre }}</td>
                      <td>{{ item.apellidos }}</td>
                      <td>{{ item.equipo}}</td>
                      <td>{{ item.posicion }}</td>
                      <td>{{ item.nivel }}</td>
                      <td>{{ item.dorsal }}</td>
                      <td>{{ item.goles }}</td>
                      <td>{{ item.asistencias }}</td>
                      <td>{{ item.tieneBalonOro }}</td>
                      <td>{{ item.esTitular }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
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

.sombra {
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}

.sombra:hover {
  box-shadow: none;
}
</style>