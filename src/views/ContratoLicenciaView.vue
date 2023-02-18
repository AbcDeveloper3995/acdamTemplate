<script setup>
import axios from "axios";

import 'form-wizard-vue3/dist/form-wizard-vue3.css';
import Wizard from 'form-wizard-vue3';
import Base from "@/components/base/Base.vue";

import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const utilizadorAPI = ref([])
const objUtilizador = ref({
  pk:'',
  tipo:'',
  tipoNoEstatal:'',
  sector:'',
  derecho:''
})

let currentTabIndex = 0

//PARA EL WIZARD
const onChangeCurrentTab = (index, oldIndex) => {
  currentTabIndex = index;
}
const onTabBeforeChange = () => {
  if (currentTabIndex === 0) {
    alert('First Tab')
  }
  alert('All Tabs')
}
const wizardCompleted = () => {
  alert('Wizard Completed')
}
function alerta(event){
  let id = event.target.value
  let url = `licenciamiento/utilizador/${id}/`
  axios.get(url)
      .then((response) => {
        objUtilizador.value.pk = response.data.data.id
        objUtilizador.value.tipo = response.data.data.tipo
        objUtilizador.value.tipoNoEstatal = response.data.data.tipoNoEstatal
        objUtilizador.value.derecho = response.data.data.tipoDerecho
        objUtilizador.value.sector = response.data.data.fk_sector
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}
onMounted(() => {
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
          <li class="breadcrumb-item active">Contrato Licencia</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <Wizard
              squared-tabs
              card-background
              scrollable-tabs
              :nextButton="{text: 'Siguiente',
                                icon: 'arrow-right',
                                hideText: false,
                                hideIcon: false,
                                disabled: false}"
              :backButton="{text: 'Anterior',
                                icon: 'arrow-left',
                                hideText: false,
                                hideIcon: false,
                                disabled: false}"
              :custom-tabs="[
                                  {
                                    title: 'Step 1',
                                  },
                                  {
                                    title: 'Step 2',
                                  },
                                  {
                                    title: 'Step 3',
                                  },
                                  {
                                    title: 'Step 4',
                                  },
                                  {
                                    title: 'Step 5',
                                  },
                                ]"
              :beforeChange="onTabBeforeChange"
              @change="onChangeCurrentTab"
              @complete:wizard="wizardCompleted"
          >
            <div class="row" v-if="currentTabIndex === 0">
              <p>{{objUtilizador.tipo}}</p>
              <p>{{objUtilizador.tipoNoEstatal}}</p>
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="alerta($event)">
                    <option  value="">----------</option>
                    <option v-for="item in utilizadorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <label for="floatingSelect">Utilizadores</label>
                </div>
              </div>
            </div>
            <h5 v-if="currentTabIndex === 1 && objUtilizador.tipo == 1">Estatal</h5>
            <h5 v-if="currentTabIndex === 1 && objUtilizador.tipo == 2 && objUtilizador.tipoNoEstatal == 'PN' ">No estatal Natural</h5>
            <h5 v-if="currentTabIndex === 1 && objUtilizador.tipo == 2 && objUtilizador.tipoNoEstatal == 'PJ'">No estatal Juridico</h5>
            <h5 v-if="currentTabIndex === 2">Tab 2</h5>
            <h5 v-if="currentTabIndex === 3">Tab 3</h5>
            <h5 v-if="currentTabIndex === 4">Tab 4</h5>
          </Wizard>
        </div>
      </div>
    </section>
  </main>
  <Base/>
</template>

<style scoped>
.fw-card{
  background: linear-gradient(to top right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5));
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
  transition: linear 4s ease;
}

.fw-btn{
  background: red !important;
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
</style>