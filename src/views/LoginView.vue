<script setup>
import axios from "axios";

import {inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import {notificaciones} from '@/util/notificacionesGlobal'

const usuario = ref('')
const password = ref('')
const swal = inject('$swal')
const router =useRouter()
const {mensaje} = notificaciones()

// Estrucutra base de peticion POST con axios y async await
const logearse = async (e) => {
  e.preventDefault()
  try {
    let url = "login/"
    let dataPost = {
      username: usuario.value,
      password: password.value
    }
    let response = await axios.post(url, dataPost)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('idUser', response.data.usuario.id)
    localStorage.setItem('username', response.data.usuario.username)
    localStorage.setItem('nombre', response.data.usuario.nombre)
    localStorage.setItem('apellidos', response.data.usuario.apellidos)
    localStorage.setItem('provincia', response.data.usuario.provincia)
    if (response.status == 200) {
      mensaje('success','Exito', response.data.message)
      await router.push('/home')
    }
  } catch (error) {
    error.code=='ERR_NETWORK' ? mensaje('error','Error', 'Ha ocurrido un error al intentar conectar con el servidor.'):mensaje('error','Error', error.response.data.error)
  }
}
</script>

<template>
  <main>
    <div class="container">
      <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div class="d-flex justify-content-center py-4"><a href="index.html"
                                                                 class="d-flex align-items-center w-auto"> <img
                  id="logo" src="@/assets/img/logo3.jpg" alt=""></a></div>
              <div class="glassmorphism card mb-3">
                <div class="card-body">
                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Inicio Sesión</h5>
                    <hr>
                  </div>
                  <form class="row g-3 needs-validation" novalidate="">
                    <div class="col-12">
                      <div class="form-floating"><input v-model="usuario" type="text"
                                                        class="styleInput form-control" id="floatingName"
                                                        placeholder="Your Name"> <label for="floatingName">Ingrese
                        usuario</label></div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating"><input v-model="password" type="password"
                                                        class="styleInput form-control" id="floatingName"
                                                        placeholder="Your Name"> <label for="floatingName">Ingrese
                        contrasena</label></div>
                    </div>
                    <div class="col-12">
                      <button @click="logearse" class="miBtn btn btn-outline-light w-100" type="submit">Aceptar <i
                          class="bi bi-arrow-bar-right"></i></button>
                    </div>
                  </form>
                  <div class="d-flex justify-content-center py-4"><img id="translacion"
                                                                       src="@/assets/img/letraMusical.webp" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.glassmorphism {
  background: linear-gradient(to top right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5));
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
  transition: linear 4s ease;
}

.miBtn{
  border-radius: 10px;
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
.miBtn:hover{
  box-shadow: none;
}

#logo {
  width: 200px;
  animation-name: giro;
  animation-duration: 8s;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes giro {
  0% {transform: rotateY(360deg)}
}

#translacion {
  width: 50px;
  height: 50px;
  z-index: -1;
  position: relative;
  left: 110px;
  animation-name: trasladarse;
  animation-duration: 7s;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes trasladarse {
  0% {
    bottom: 0
  }
  50% {
    bottom: 250px
  }
  100% {
    bottom: 0
  }
}

.styleInput {
  background: none;
  border-bottom-color: black;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

label {
  color: #012970;
}
</style>
