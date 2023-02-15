<script setup>
import axios from "axios";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
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

    </section>
  </main>
  <Base/>
</template>

<style scoped>

</style>