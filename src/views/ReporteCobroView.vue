<script setup>
import axios from "axios";
import {computed, onMounted, ref} from "vue";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {PDF} from '../util/functiosGlobal'
import {notificaciones} from '@/util/notificacionesGlobal'
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'

//DECLARACIONES
const {mensaje} = notificaciones()
const indice = indiceActualizado //VARIABLE QUE CONTROLA EL COMPORTAMIENTO DEL FORMULARIO DEPENDIENDO SI SE CREAR O SE EDITA
const expandir = expandirActualizado //VARIABLE QUE CONTROLA SI SE EXPANDE O SE CONTRAE EL FORMULARIO
const representantesAPI = ref([])
const utilizadoresAPI = ref([])
const reporteUtilizadorAPI = ref([])
const representanteSelected = ref('')
const nombreUtilizador = ref('')
const idRepresentante = ref(0)
const dataPost = ref({
  pk:'',
  fk_credito:'',
  numeroReporteFecha:'',
  fecha:'',
  numeroReporte:0.00,
  montoMusicaViva:0.00,
  montoMusicaGrabada:0.00,
  montoDerecho:0.00,
  montoRadio:0.00,
  montoTVmusica:0.00,
  montoMora:0.00,
  montoTVaudiovisual:0.00,
  montoDramatico:0.00,
  montoCineAudiovisual:0.00,
  montoCineDramatico:0.00,
  montoBar:0.00,
  montoCafeteria:0.00,
  montoRestaurante:0.00,
  montoCNocturno:0.00,
})
const totales = ref({
  totalMusicaViva: 0,
  totalMusicaGrabada: 0,
  totalDerecho: 0,
  totalRadio: 0,
  totalTVmusica: 0,
  totalMora: 0,
  totalTVaudiovisual: 0,
  totalDramatico: 0,
  totalCineAudiovisual: 0,
  totalCineDramatico: 0,
  totalBar: 0,
  totalCafeteria: 0,
  totalRestaurante: 0,
  totalCNocturno: 0,
})
const totalesGeneralesConceptos = ref({
  totalRealAcumulado: 0,
  totalEnero: 0,
  totalFebrero: 0,
  totalMarzo: 0,
  totalAbril: 0,
  totalMayo: 0,
  totalJunio: 0,
  totalJulio: 0,
  totalAgosto: 0,
  totalSeptiembre: 0,
  totalOctubre: 0,
  totalNoviembre: 0,
  totalDiciembre: 0,
})
const totalesGeneralesModalidades = ref({
  totalRealAcumulado: 0,
  totalEnero: 0,
  totalFebrero: 0,
  totalMarzo: 0,
  totalAbril: 0,
  totalMayo: 0,
  totalJunio: 0,
  totalJulio: 0,
  totalAgosto: 0,
  totalSeptiembre: 0,
  totalOctubre: 0,
  totalNoviembre: 0,
  totalDiciembre: 0,
})
const resumenGeneralConceptos = ref([])
const resumenGeneralModalidad = ref([])

//FUNCION PARA OBTENER LOS REPRESENTANTES SEGUN LA PROVINCIA DEL USUARIO EN SECCION
const getRepresentantesUnaProvincia = () => {
  let slug = localStorage.getItem('provincia')
  let url = `licenciamiento/representante/${slug}/getRepresentantesProvincia/`
  axios.get(url)
      .then((response) => {
        representantesAPI.value = response.data
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//FUNCION PARA OBTENER LOS UTILIZADORES QUE ATIENDE UN REPRESENTANTE
const getUtilizadoresDelRepresentante = (event) => {
  idRepresentante.value = event.target.value
  //REINICIALIZAR VARIABLES VINCULAS AL REPORTE GENERAL
  resumenGeneralConceptos.value = []
  resumenGeneralModalidad.value = []
  totalesGeneralesConceptos.value.totalRealAcumulado = 0
  totalesGeneralesConceptos.value.totalEnero = 0
  totalesGeneralesConceptos.value.totalFebrero = 0
  totalesGeneralesConceptos.value.totalMarzo = 0
  totalesGeneralesConceptos.value.totalAbril  = 0
  totalesGeneralesConceptos.value.totalMayo = 0
  totalesGeneralesConceptos.value.totalJunio = 0
  totalesGeneralesConceptos.value.totalJulio = 0
  totalesGeneralesConceptos.value.totalAgosto = 0
  totalesGeneralesConceptos.value.totalSeptiembre = 0
  totalesGeneralesConceptos.value.totalOctubre = 0
  totalesGeneralesConceptos.value.totalNoviembre = 0
  totalesGeneralesConceptos.value.totalDiciembre = 0

  totalesGeneralesModalidades.value.totalRealAcumulado = 0
  totalesGeneralesModalidades.value.totalEnero = 0
  totalesGeneralesModalidades.value.totalFebrero = 0
  totalesGeneralesModalidades.value.totalMarzo = 0
  totalesGeneralesModalidades.value.totalAbril  = 0
  totalesGeneralesModalidades.value.totalMayo = 0
  totalesGeneralesModalidades.value.totalJunio = 0
  totalesGeneralesModalidades.value.totalJulio = 0
  totalesGeneralesModalidades.value.totalAgosto = 0
  totalesGeneralesModalidades.value.totalSeptiembre = 0
  totalesGeneralesModalidades.value.totalOctubre = 0
  totalesGeneralesModalidades.value.totalNoviembre = 0
  totalesGeneralesModalidades.value.totalDiciembre = 0

  let url = `licenciamiento/representante/${idRepresentante.value}/getUtilizadores/`
  axios.get(url)
      .then((response) => {
        representanteSelected.value = `${response.data.nombre} ${response.data.apellidos}`
        utilizadoresAPI.value = response.data.utilizadores
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//FUNCION PARA OBTENER LOS REPORTES DEL UTILIZADOR
const getReportesUtilizador = (id) => {
  let url = `recaudacion/reporteCobroUtilizador/${id}/getReportes/`
  axios.get(url)
      .then((response) => {
        reporteUtilizadorAPI.value = response.data
        response.data.forEach(item => {
          totales.value.totalMusicaViva += item.montoMusicaViva
          totales.value.totalMusicaGrabada += item.montoMusicaGrabada
          totales.value.totalDerecho += item.montoDerecho
          totales.value.totalRadio += item.montoRadio
          totales.value.totalTVmusica += item.montoTVmusica
          totales.value.totalMora += item.montoMora
          totales.value.totalTVaudiovisual += item.montoTVaudiovisual
          totales.value.totalDramatico += item.montoDramatico
          totales.value.totalCineAudiovisual += item.montoCineAudiovisual
          totales.value.totalCineDramatico += item.montoCineDramatico
          totales.value.totalBar += item.montoBar
          totales.value.totalCafeteria += item.montoCafeteria
          totales.value.totalRestaurante += item.montoRestaurante
          totales.value.totalCNocturno += item.montoCNocturno
        })
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

const asignarNombreUtilizador = (nombre) => nombreUtilizador.value = nombre
const pintarImporteConDecimal = (item) => parseFloat(item).toFixed(2)
const inicializarDataPostYTotales = () => {
  //REINICIALIZAR DATA POST
  dataPost.value.pk = ''
  dataPost.value.fk_utilizador = ''
  dataPost.value.fk_credito = ''
  dataPost.value.fecha = ''
  dataPost.value.numeroReporte = 0
  dataPost.value.montoMusicaViva = 0.00
  dataPost.value.montoMusicaGrabada = 0.00
  dataPost.value.montoDerecho = 0.00
  dataPost.value.montoRadio = 0.00
  dataPost.value.montoTVmusica = 0.00
  dataPost.value.montoMora = 0.00
  dataPost.value.montoTVaudiovisual = 0.00
  dataPost.value.montoDramatico = 0.00
  dataPost.value.montoCineAudiovisual = 0.00
  dataPost.value.montoCineDramatico = 0.00
  dataPost.value.montoBar = 0.00
  dataPost.value.montoCafeteria = 0.00
  dataPost.value.montoRestaurante = 0.00
  dataPost.value.montoCNocturno = 0.00
  //REINICIALIZAR TOTALES
  totales.value.totalMusicaViva = 0
  totales.value.totalMusicaGrabada = 0
  totales.value.totalDerecho = 0
  totales.value.totalRadio = 0
  totales.value.totalTVmusica = 0
  totales.value.totalMora = 0
  totales.value.totalTVaudiovisual = 0
  totales.value.totalDramatico = 0
  totales.value.totalCineAudiovisual = 0
  totales.value.totalCineDramatico = 0
  totales.value.totalBar = 0
  totales.value.totalCafeteria = 0
  totales.value.totalRestaurante = 0
  totales.value.totalCNocturno = 0
  //REINICIALIZAR LISTADO DE REPORTES
  reporteUtilizadorAPI.value = []
}

const getGestionGeneral = () => {
  // REINICIALIZAR LOS TOTALES
  let clavesConceptos = Object.keys(totalesGeneralesConceptos.value)
  clavesConceptos.forEach(item => {
    totalesGeneralesConceptos.value[item] = 0
  })
  let clavesModalidades = Object.keys(totalesGeneralesModalidades.value)
  clavesModalidades.forEach(item => {
    totalesGeneralesModalidades.value[item] = 0
  })
  let url = `recaudacion/reporteCobroUtilizador/${idRepresentante.value}/getGestionGeneral/`
  axios.get(url)
      .then((response) => {
        resumenGeneralConceptos.value = response.data.conceptos
        resumenGeneralConceptos.value.forEach(item => {
          totalesGeneralesConceptos.value.totalRealAcumulado += item.totalReal
          totalesGeneralesConceptos.value.totalEnero += item.enero
          totalesGeneralesConceptos.value.totalFebrero += item.febrero
          totalesGeneralesConceptos.value.totalMarzo += item.febrero
          totalesGeneralesConceptos.value.totalAbril += item.abril
          totalesGeneralesConceptos.value.totalMayo += item.mayo
          totalesGeneralesConceptos.value.totalJunio += item.junio
          totalesGeneralesConceptos.value.totalJulio += item.julio
          totalesGeneralesConceptos.value.totalAgosto += item.agosto
          totalesGeneralesConceptos.value.totalSeptiembre += item.septiembre
          totalesGeneralesConceptos.value.totalOctubre += item.octubre
          totalesGeneralesConceptos.value.totalNoviembre += item.noviembre
          totalesGeneralesConceptos.value.totalDiciembre += item.diciembre
        })
        resumenGeneralModalidad.value = response.data.modalidades
        resumenGeneralModalidad.value.forEach(item => {
          totalesGeneralesModalidades.value.totalRealAcumulado += item.totalReal
          totalesGeneralesModalidades.value.totalEnero += item.enero
          totalesGeneralesModalidades.value.totalFebrero += item.febrero
          totalesGeneralesModalidades.value.totalMarzo += item.febrero
          totalesGeneralesModalidades.value.totalAbril += item.abril
          totalesGeneralesModalidades.value.totalMayo += item.mayo
          totalesGeneralesModalidades.value.totalJunio += item.junio
          totalesGeneralesModalidades.value.totalJulio += item.julio
          totalesGeneralesModalidades.value.totalAgosto += item.agosto
          totalesGeneralesModalidades.value.totalSeptiembre += item.septiembre
          totalesGeneralesModalidades.value.totalOctubre += item.octubre
          totalesGeneralesModalidades.value.totalNoviembre += item.noviembre
          totalesGeneralesModalidades.value.totalDiciembre += item.diciembre
        })
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}
onMounted(() => {
  getRepresentantesUnaProvincia()
})
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
          <li class="breadcrumb-item active">Reporte Cobro</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div>

      </div>
<!--      <div class="col-12">-->
<!--        <div class="card">-->
<!--          <div class="card-body">-->
<!--            <h5 class="card-title">REPORTE DE COBRO</h5>-->
<!--              <button-->
<!--                  @click="PDF('ReporteCobro')" style="margin-bottom: 10px"-->
<!--                  class="miBtn btn btn-outline-dark" type="button">-->
<!--                <i class="bi bi-file-pdf"></i> Generar PDF-->
<!--              </button>-->
<!--            <div class="table-responsive" id="ReporteCobro">-->
<!--              <table class="table table-bordered" style="border: black">-->
<!--                <thead>-->
<!--                <tr>-->
<!--                  <th rowspan="3" colspan="3"><img src="@/assets/img/logo3.jpg"></th>-->
<!--                  <th rowspan="3" colspan="3">REPORTE DE COBRO</th>-->
<!--                  <th colspan="4">modelo</th>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <th colspan="4">Fecha</th>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <th colspan="4">No.</th>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <th colspan="3">Codigo</th>-->
<!--                  <th colspan="3">Representante</th>-->
<!--                  <th colspan="4">Provincia</th>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <th>Cheque</th>-->
<!--                  <th>Fecha</th>-->
<!--                  <th>Codigo</th>-->
<!--                  <th>Utilizador</th>-->
<!--                  <th>Factura</th>-->
<!--                  <th>Importe Total</th>-->
<!--                  <th>Concepto</th>-->
<!--                  <th>Concepto</th>-->
<!--                  <th>Concepto</th>-->
<!--                  <th>Concepto</th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                <tr v-for="(item, index) in miLista" key="item.id">-->
<!--                  <td>{{ item.id }}</td>-->
<!--                  <td>{{ item.nombre }}</td>-->
<!--                  <td>{{ item.apellido }}</td>-->
<!--                  <td>{{ item.edad }}</td>-->
<!--                  <td>{{ item.manos }}</td>-->
<!--                  <td>{{ item.cantProyectos }}</td>-->
<!--                  <td v-if="!item.edit.value">{{ item.pies }}</td>-->
<!--                  <td v-else><input type="number" :value=item.pies></td>-->
<!--                  <td>{{ item.edit.value }}</td>-->
<!--                  <td>{{ item.color }}</td>-->
<!--                  <td v-if="!item.edit.value">-->
<!--                    <button @click="editar(index)">editar</button>-->
<!--                    <button @click="aumentarFactura(index)">aumentar</button>-->
<!--                  </td>-->
<!--                  <td v-else>-->
<!--                    <button>salvar</button>-->
<!--                  </td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td colspan="5">Suma de Reporte</td>-->
<!--                  <td><span class="badge rounded-pill bg-danger">{{ sumarFacturas }}</span></td>-->
<!--                  <td>7</td>-->
<!--                  <td>8</td>-->
<!--                  <td>9</td>-->
<!--                  <td>10</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <th>Factura</th>-->
<!--                  <th>Mod BAR</th>-->
<!--                  <th>Mod Cafeteria</th>-->
<!--                  <th>Mod Restaurant</th>-->
<!--                  <th>Mod Centro Noc</th>-->
<!--                  <th>Modalidad</th>-->
<!--                  <th rowspan="2" colspan="4">Observaciones</th>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td>1</td>-->
<!--                  <td>2</td>-->
<!--                  <td>3</td>-->
<!--                  <td>4</td>-->
<!--                  <td>5</td>-->
<!--                  <td>6</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <th colspan="3">Enviado por</th>-->
<!--                  <th colspan="4">Recibido por recaudacion y licenciamineto</th>-->
<!--                  <th colspan="3">Recibido por contabilidad y finanzas</th>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td colspan="2">Nombre y Apellidos</td>-->
<!--                  <td colspan="1">Firma</td>-->
<!--                  <td colspan="2">Nombre y Apellidos</td>-->
<!--                  <td colspan="2">Firma</td>-->
<!--                  <td colspan="2">Nombre y Apellidos</td>-->
<!--                  <td colspan="1">Firma</td>-->
<!--                </tr>-->
<!--                </tbody>-->
<!--              </table>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <div class="row">
        <div class="col-12">
          <div class="card glassmorphism">
            <div class="card-body ">
              <h5 class="card-title text-uppercase">
                <i class="bi bi-person"></i><strong class=""> Seleccion de representante</strong></h5>
              <form style="margin-top: 10px" class="row">
                <div class="col-md-4">
                  <div class="form-floating ">
                    <select class="styleInput form-select" id="floatingSelect" @change="getUtilizadoresDelRepresentante" aria-label="Cargo">
                      <option value="">-----------</option>
                      <option v-for="item in representantesAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select><label for="floatingName"><span
                      class="text-danger">*</span> Representantes atendidos por usted</label></div>
                </div>
              </form>
              <hr>
              <h5 class="card-title text-uppercase"><strong>Listado de utilizadores atendidos por: </strong>
                <strong class="text-decoration-underline"> {{ representanteSelected }}</strong></h5>
              <div class="d-flex align-items-start">
                <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <button class="nav-link" style="margin-top: 5px" v-for="item in utilizadoresAPI" :id="'#id'+item.id" data-bs-toggle="pill" :data-bs-target="'#id'+item.id"
                         @click="asignarNombreUtilizador(item.nombre); inicializarDataPostYTotales()" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">{{ item.nombre }}</button>
                </div>
                <div class="tab-content" id="v-pills-tabContent">
                  <div class="tab-pane fade"  v-for="item in utilizadoresAPI" :id="'id'+item.id" role="tabpanel"
                       :aria-labelledby="'#id'+item.id">
                    <!--      RENDERIZADO DEL FORMULARIO-->
                    <div class="alert glassmorphism border-secondary alert-dismissible fade show" role="alert">
                      <div class="filter">
                        <a href="#" class="icon" style="color:black; margin-right: 15px" title="Obtener reportes" @click="getReportesUtilizador(item.id)">
                          <i class="bi bi-search"></i></a></div>
                      <h5><i class="bi-archive"></i>
                        <strong> Reporte Utilizador</strong></h5>
                      <hr>
                      <form class="row">
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="text" class="styleInput form-control" v-model="dataPost.numeroReporte" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            No.Reporte</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="date" class="styleInput form-control" v-model="dataPost.fecha" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Fecha</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="text" class="styleInput form-control" v-model="dataPost.fk_credito" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Cheque-Transferencia</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoMusicaViva" required
                                                            id="floatingName"
                                                            placeholder="Nombre"> <label for="floatingName">
                            Musica Viva</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoMusicaGrabada" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Musica Grabada</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoDerecho" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Derecho</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoRadio" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Radio</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoTVmusica" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            TV-Musica</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoMora" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Mora</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoTVaudiovisual" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            TV-Audiovisual</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoDramatico" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Dramatico-Cultura</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoCineAudiovisual" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Cine Audiovisual</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoCineDramatico" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Cine Dramatico</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoBar" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Bar</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoCafeteria" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Cafeteria</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoRestaurante" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Restaurante</label></div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-floating">
                            <input type="number" class="styleInput form-control" v-model="dataPost.montoCNocturno" required
                                   id="floatingName"
                                   placeholder="Nombre"> <label for="floatingName">
                            Centro Nocturno</label></div>
                        </div>
                        <div class="text-center mt-3" >
                          <button @click="POST_PUT('recaudacion/reporteCobroUtilizador/', dataPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                            <i class="bi bi-arrow-bar-right"></i> {{ indice == -1 ? 'Agregar' : 'Actualizar' }}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <br>
                <table class="table table-striped">
                  <thead>
                  <tr class="sombra table-primary">
                    <th colspan="20" class="text-center text-uppercase">{{ nombreUtilizador }}</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th scope="col">No Factura</th>
                    <th scope="col">No Reporte Cobro y Fecha</th>
                    <th scope="col">No Tranfer-Cheque</th>
                    <th scope="col">Fecha Transfer-Cheque</th>
                    <th scope="col">Cobrado</th>
                    <th scope="col">M. Viva</th>
                    <th scope="col">M.Grabada</th>
                    <th scope="col">G.Derecho</th>
                    <th scope="col">Radio</th>
                    <th scope="col">TV-Musica</th>
                    <th scope="col">Mora</th>
                    <th scope="col">TV-Audiovisual</th>
                    <th scope="col">Dramatico CULTURA</th>
                    <th scope="col">Cine Audiovisual</th>
                    <th scope="col">Cine Dramatico</th>
                    <th scope="col">BAR</th>
                    <th scope="col">CAFETERIA</th>
                    <th scope="col">RESTAURANTE</th>
                    <th scope="col">C/NOCTURNO</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in reporteUtilizadorAPI" :key="item.id">
                    <td></td>
                    <td>{{item.factura}}</td>
                    <td>{{item.noReporteFecha}}</td>
                    <td>{{item.chequeTransfer}}</td>
                    <td>{{item.fechaChequeTransfer}}</td>
                    <td>{{pintarImporteConDecimal(item.cobrado)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoMusicaViva)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoMusicaGrabada)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoDerecho)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoRadio)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoTVmusica)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoMora)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoTVaudiovisual)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoDramatico)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoCineAudiovisual)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoCineDramatico)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoBar)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoCafeteria)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoRestaurante)}}</td>
                    <td>{{pintarImporteConDecimal(item.montoCNocturno)}}</td>
                  </tr>
                  <tr class="table-dark">
                    <td><strong>TOTAL</strong></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${{pintarImporteConDecimal(totales.totalMusicaViva)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalMusicaGrabada)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalDerecho)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalRadio)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalTVmusica)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalMora)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalTVaudiovisual)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalDramatico)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalCineAudiovisual)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalCineDramatico)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalBar)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalCafeteria)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalRestaurante)}}</td>
                    <td>${{pintarImporteConDecimal(totales.totalCNocturno)}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card glassmorphism info-card sales-card">
            <div class="card-body" >
              <h5 class="card-title" >Gestion General <strong class="text-uppercase">| {{ representanteSelected }}</strong></h5>
              <div class="filter">
                <a class="icon" style="color: black; margin-right: 15px" href="#" title="Actualizar" @click="getGestionGeneral">
                  <i class="bi bi-arrow-repeat"></i></a></div>
              <div class="table-responsive">
                <br>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Concepto</th>
                    <th scope="col">Plan Mensual</th>
                    <th scope="col">Plan Anual</th>
                    <th scope="col">%</th>
                    <th scope="col">Real Acumulado</th>
                    <th scope="col">Enero</th>
                    <th scope="col">Febrero</th>
                    <th scope="col">Marzo</th>
                    <th scope="col">Abril</th>
                    <th scope="col">Mayo</th>
                    <th scope="col">Junio</th>
                    <th scope="col">Julio</th>
                    <th scope="col">Agosto</th>
                    <th scope="col">Septiembre</th>
                    <th scope="col">Octubre</th>
                    <th scope="col">Noviembre</th>
                    <th scope="col">Diciembre</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr class="sombra table-danger" >
                    <td>CONCEPTOS</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr class="filaSombra" v-for="(item, index) in resumenGeneralConceptos" :key="item.id">
                    <td>{{item.index}}</td>
                    <td>{{item.noReporteFecha}}</td>
                    <td>{{item.chequeTransfer}}</td>
                    <td>{{item.fechaChequeTransfer}}</td>
                    <td>{{pintarImporteConDecimal(item.totalReal)}}</td>
                    <td>{{pintarImporteConDecimal(item.enero)}}</td>
                    <td>{{pintarImporteConDecimal(item.febrero)}}</td>
                    <td>{{pintarImporteConDecimal(item.marzo)}}</td>
                    <td>{{pintarImporteConDecimal(item.abril)}}</td>
                    <td>{{pintarImporteConDecimal(item.mayo)}}</td>
                    <td>{{pintarImporteConDecimal(item.junio)}}</td>
                    <td>{{pintarImporteConDecimal(item.julio)}}</td>
                    <td>{{pintarImporteConDecimal(item.agosto)}}</td>
                    <td>{{pintarImporteConDecimal(item.septiembre)}}</td>
                    <td>{{pintarImporteConDecimal(item.octubre)}}</td>
                    <td>{{pintarImporteConDecimal(item.noviembre)}}</td>
                    <td>{{pintarImporteConDecimal(item.diciembre)}}</td>
                  </tr>
                  <tr class="table-dark">
                    <td><strong>TOTAL</strong></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalRealAcumulado)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalEnero)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalFebrero)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalMarzo)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalAbril)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalMayo)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalJunio)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalJulio)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalAgosto)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalSeptiembre)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalOctubre)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalNoviembre)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesConceptos.totalDiciembre)}}</td>
                  </tr>
                  <tr class="sombra table-danger">
                    <td>MODALIDAD</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr class="filaSombra" v-for="(item, index) in resumenGeneralModalidad" :key="item.id">
                    <td>{{item.index}}</td>
                    <td>{{item.noReporteFecha}}</td>
                    <td>{{item.chequeTransfer}}</td>
                    <td>{{item.fechaChequeTransfer}}</td>
                    <td>{{pintarImporteConDecimal(item.totalReal)}}</td>
                    <td>{{pintarImporteConDecimal(item.enero)}}</td>
                    <td>{{pintarImporteConDecimal(item.febrero)}}</td>
                    <td>{{pintarImporteConDecimal(item.marzo)}}</td>
                    <td>{{pintarImporteConDecimal(item.abril)}}</td>
                    <td>{{pintarImporteConDecimal(item.mayo)}}</td>
                    <td>{{pintarImporteConDecimal(item.junio)}}</td>
                    <td>{{pintarImporteConDecimal(item.julio)}}</td>
                    <td>{{pintarImporteConDecimal(item.agosto)}}</td>
                    <td>{{pintarImporteConDecimal(item.septiembre)}}</td>
                    <td>{{pintarImporteConDecimal(item.octubre)}}</td>
                    <td>{{pintarImporteConDecimal(item.noviembre)}}</td>
                    <td>{{pintarImporteConDecimal(item.diciembre)}}</td>
                  </tr>
                  <tr class="table-dark">
                    <td><strong>TOTAL</strong></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalRealAcumulado)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalEnero)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalFebrero)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalMarzo)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalAbril)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalMayo)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalJunio)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalJulio)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalAgosto)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalSeptiembre)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalOctubre)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalNoviembre)}}</td>
                    <td>${{pintarImporteConDecimal(totalesGeneralesModalidades.totalDiciembre)}}</td>
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

.nav button{
  color: black;
}
.nav button:active, .nav button:focus{
  background: transparent !important;
  border: 1px solid transparent;
  border-color: white;
  border-radius: 10px;

  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
.nav-pills .nav-link.active, .nav-pills .show > .nav-link {
  background: transparent !important;
  border: 1px solid transparent;
  border-color: white;
  border-radius: 10px;
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}

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

.filaSombra {
  transition: linear 0.5s;
}

.filaSombra:hover {
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
</style>