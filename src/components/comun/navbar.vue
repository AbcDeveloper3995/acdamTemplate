<script setup>
import {useRouter} from "vue-router";

const router =useRouter()
const username = localStorage.getItem('username')
const nombre = localStorage.getItem('nombre')
const apellidos = localStorage.getItem('apellidos')

</script>
<template>
  <header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between"> <a class="logo d-flex align-items-center" @click="router.push('/home')"> <img id="logo" style="width: 150px; height: 650px" src="@/assets/img/acdam.jpg" alt=""> </a></div>

    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown"> <img src="@/assets/img/avatar.jpg" alt="Profile" class="rounded-circle"> <span class="d-none d-md-block dropdown-toggle ps-2">{{username}}</span> </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li class="dropdown-header">
              <h6>{{ nombre }}</h6>
              <span>{{ apellidos }}</span>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li> <a class="dropdown-item d-flex align-items-center" href="#"> <i class="bi bi-box-arrow-right"></i> <span>Salir</span> </a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "navbar"
}
</script>

<style scoped>
header{
  background: linear-gradient( to top right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3) );
}
#logo{
  animation-name: giro;
  animation-duration: 6s;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes giro {
  0% {transform: rotateY(360deg)}
}
</style>