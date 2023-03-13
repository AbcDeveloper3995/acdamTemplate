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

const contratoMandatoAPI = ref([])

const actualizarContratosMandatos = () => GET("licenciamiento/contratoMandato/", contratoMandatoAPI)

onMounted(() => {
  GET("licenciamiento/contratoMandato/", contratoMandatoAPI)
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" @click="router.push('/home')"><i class="bi bi-house-fill"></i></a></li>
          <li class="breadcrumb-item active">Contrato Mandato</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="alert alert-light glassmorphism text-center text-dark alert-dismissible fade show" role="alert">
            <i class="bi bi-layout-text-window-reverse"></i> <strong> Contratos Mandatos</strong>
            <div class="filter">
              <a class="icon" href="#" title="Actualizar"><i class="bi bi-arrow-repeat"
                                                             @click="actualizarContratosMandatos"
                                                             style="color: black"></i></a>
            </div>
          </div>
        </div>
        <!--        Listado de contratos-->
        <div class="col-lg-1" v-for="item in contratoMandatoAPI" :key="item.id" :value="item.id" style="margin-bottom: 15px">
          <img src="../assets/img/img-contrato1.jpg"  class="glassmorphism card-img-top" style="height: 6rem; margin-bottom: 5px" alt="...">
          <span class="sombra badge bg-secondary" data-bs-toggle="modal" :data-bs-target="'#id'+item.id" title="Detalles"><i
              class="bi bi-file-earmark-pdf"></i></span>
          <div class="modal fade" :id="'id'+item.id" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class="bi bi-file-earmark-pdf"></i> <strong> Contrato con:</strong>
                    {{ item.fk_representante }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Numero de contrato
                      <span class="badge bg-primary rounded-pill">{{ item.numeroContrato }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Fecha de creacion
                      <span class="badge bg-primary rounded-pill">{{ item.fechaCreacion }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Actividad
                      <span class="badge bg-primary rounded-pill">{{ item.tipoActividad }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Porcentaje de remuneracion
                      <span class="badge bg-primary rounded-pill">{{ item.remuneracion }}%</span></li>
                  </ul>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button></div>
              </div>
            </div>
          </div>
          <span class="sombra badge bg-primary"  title="Modificar" style="margin-left: 2px"><i
              class="bi bi-pencil"></i></span>
          <span class="sombra badge bg-danger" style="margin-left: 2px"
                title="Eliminar"><i class="bi bi-trash" @click="DELETE('licenciamiento/contratoMandato/'+item.id)"></i></span>
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
.sombra {
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
.sombra:hover {
  box-shadow: none;
}
</style>