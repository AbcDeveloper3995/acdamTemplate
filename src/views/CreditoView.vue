<script setup>
import axios from "axios";

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'
import CHOICES_RECAUDACION from '../util/choicesDeRecaudacion'
import CHOICES from '../util/choicesDeLicenciamiento'
import {generarCodigo} from '../util/functiosGlobal'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const indice = indiceActualizado //VARIABLE QUE CONTROLA EL COMPORTAMIENTO DEL FORMULARIO DEPENDIENDO SI SE CREAR O SE EDITA
const expandir = expandirActualizado //VARIABLE QUE CONTROLA SI SE EXPANDE O SE CONTRAE EL FORMULARIO
const creditoAPI = ref([])
const recaudacionAPI = ref([])
const utilizadorAPI = ref([])
const sucursalAPI = ref([])
const resumenRecaudacionAPI = ref([])
const dataPost = ref({
pk: '',
  fk_recaudacion: '',
  fk_utilizador: '',
  fk_sucursal: '',
  importe: '',
  provincia: '',
  municipio: '',
  transferencia: '',
  cheque: '',
  factura: null,
  devolucion: '',
  tipoEstatal: '',
  observacion: '',
  pertenenciaACDAM: true,
})
const dataRecaudacionPost = ref({
  pk:'',
  totalMetropolitanoEstatal:0,
  totalMetropolitanoNoEstatal:0,
  totalBfiEstatal:0,
  totalBfiNoEstatal:0,
  totalSociedades:0,
  totalGeneral:0,
})
const planMensualPost = ref({
  planFronteraEstatal: 0,
  planFronteraTCP: 0,
  planSociedad: 0,
  realFronteraEstatal: 0,
  realFronteraTCP: 0,
  realSociedad: 0,
  devolucion: 0,
})
const porcentajeMesEstatal = ref(0)
const porcentajeMesTCP = ref(0)
const porcentajeMesSociedad = ref(0)
const porcentajeTotal = ref(0)
const totalEnPlan = ref(0)
const totalEnReal = ref(0)
const cheques = ref([])
const transferencias = ref([])
const totalesCheques = ref([])
const totalesTransferencias = ref([])
const totalesGenerales = ref([])
const frontera = ref('')
const fechaLimite = ref('')
const planAcumulado = ref(0)
const realAcumulado = ref(0)
const porcentajeAcumulado = ref(0)
const municipioAPI = ref([])
const fechaInicio = ref('')
const provincia = ref('')

let loading = ref(false)
let buscar = ref("");
let totalPaginas = 0
let paginaActual = 0


//PETICION GET PARA OBTENER LOS CREDITOS YA PAGINADOS
const getCreditoPaginados = async (NoPagina = 1) => {
try {
let url = `recaudacion/credito/${NoPagina}-${dataPost.value.fk_recaudacion}/paginado`
loading = true
let response = await axios.get(url)
loading = false
  creditoAPI.value = response.data.items
totalPaginas = response.data.totalPaginas
paginaActual = response.data.paginaActual
if (response.status == 200) {
console.log('credito cargados')
}
} catch (error) {
console.log("error: ", error.response.data.detail)
mensaje('error','Error', error.response.data.detail)
}
}

//FUNCION QUE BUSCAR El CREDITO A EDITAR Y PINTAR SUS DATOS EN EL FORMULARIO PARA SU POSTERIOR EDICION
const editarCredito = async (item, index) => {
expandir.value = false
indice.value = index
let url = `recaudacion/credito/${item.id}/`
axios.get(url)
.then((response) => {
dataPost.value.pk = response.data.data.id
dataPost.value.fk_recaudacion = response.data.data.fk_recaudacion
dataPost.value.fk_utilizador = response.data.data.fk_utilizador
dataPost.value.fk_sucursal = response.data.data.fk_sucursal
dataPost.value.provincia = response.data.data.provincia
dataPost.value.importe = response.data.data.importe
dataPost.value.municipio = response.data.data.municipio
dataPost.value.transferencia = response.data.data.transferencia
dataPost.value.cheque = response.data.data.cheque
dataPost.value.factura = response.data.data.factura
dataPost.value.devolucion = response.data.data.devolucion
dataPost.value.tipoEstatal = response.data.data.tipoEstatal
})
.catch((error) => {
mensaje('error','Error', error.response.data.error)
})
}

//PROCEDIMIENTO PARA FILTRAR EN LA TABLA
const listaFiltrada = () => creditoAPI.value.filter((item) =>
item.fk_utilizador.toLowerCase().includes(buscar.value.toLowerCase())
);

//PROCEDIMIENTO PARA EL PAGINADO
const getPaginaAnterior = () => {
if (paginaActual > 1) {
paginaActual--
}
getCargosPaginados(paginaActual)
}
const getPaginaSiguiente = () => {
if (paginaActual < totalPaginas) {
paginaActual++
}
getCargosPaginados(paginaActual)
}
const isActive = (pagina) => {
return pagina == paginaActual ? 'active' : ''
}

//FUNCION PARA OBTENER LA PROVINCIA Y MUNICIPIO SEGUN LA SUCURSAL SELECCIONADA A ASIGNARLOS A LOS CAMPOS CORRESPONDIENTE
const getProvinciaYmunicipio = (event) => {
  let slug = event.target.value
  let url = `recaudacion/sucursal/${slug}/`
  axios.get(url)
      .then((response) => {
        dataPost.value.provincia = response.data.data.provincia
        dataPost.value.municipio = response.data.data.fk_municipio
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//FUNCION PARA OBTENER LA RECAUDACION ACTUAL
const getRecaudacionActual = () => {
  let url = `recaudacion/recaudacion/getRecaudacionUltimas4/`
  axios.get(url)
      .then((response) => {
        recaudacionAPI.value = response.data
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//FUNCION PARA DESABILITAR EL CAMPO CHEQUE SI EL CREDITO ES POR TRANSFERENCIA
const desabilitarCheque = (event) => {
  let cheque = document.getElementById('cheque')
  let provincias = document.getElementById('provincias')
  let municipios = document.getElementById('municipios')
  cheque.disabled = true
  provincias.disabled = true
  municipios.disabled = true
}

//FUNCION PARA DESABILITAR EL CAMPO TRANSFERENCIA SI EL CREDITO ES POR CHEQUE
const desabilitarTransferencia = (event) => {
  let transferencia = document.getElementById('transferencia')
  let sucursal = document.getElementById('sucursal')
  transferencia.disabled = true
  sucursal.disabled = true
}

//FUNCION PARA CALCULAR LAS CANTIDADES RECAUDADAS POR BANCO
function calcularTotales(){
  creditoAPI.value.forEach((item) => {
    if (item.tipoEstatal === 'Metropolitano estatal'){
      dataRecaudacionPost.value.totalMetropolitanoEstatal += parseFloat(item.importe)
      dataRecaudacionPost.value.totalMetropolitanoEstatal = Math.round(dataRecaudacionPost.value.totalMetropolitanoEstatal*100)/100
    }
    if (item.tipoEstatal === 'Metropolitano no estatal'){
      dataRecaudacionPost.value.totalMetropolitanoNoEstatal += parseFloat(item.importe)
      dataRecaudacionPost.value.totalMetropolitanoNoEstatal = Math.round(dataRecaudacionPost.value.totalMetropolitanoNoEstatal*100)/100
    }
    if (item.tipoEstatal === 'BFI estatal'){
      dataRecaudacionPost.value.totalBfiEstatal += parseFloat(item.importe)
      dataRecaudacionPost.value.totalBfiEstatal = Math.round(dataRecaudacionPost.value.totalBfiEstatal*100)/100
    }
    if (item.tipoEstatal === 'BFI no estatal'){
      dataRecaudacionPost.value.totalBfiNoEstatal += parseFloat(item.importe)
      dataRecaudacionPost.value.totalBfiNoEstatal = Math.round(dataRecaudacionPost.value.totalBfiNoEstatal*100)/100
    }
    if (item.tipoEstatal === 'Sociedades'){
      dataRecaudacionPost.value.totalSociedades += item.importe
      dataRecaudacionPost.value.totalSociedades = Math.round(dataRecaudacionPost.value.totalSociedades*100)/100
    }
    dataRecaudacionPost.value.totalGeneral = Math.round((dataRecaudacionPost.value.totalMetropolitanoEstatal+dataRecaudacionPost.value.totalMetropolitanoNoEstatal+dataRecaudacionPost.value.totalBfiEstatal+dataRecaudacionPost.value.totalBfiNoEstatal+dataRecaudacionPost.value.totalSociedades)*100)/100
  })
}

const pintarImporteConDecimal = (item) => parseFloat(item).toFixed(2)
const getRecaudacionResumen = () => GET("recaudacion/resumenRecaudacion/", resumenRecaudacionAPI)

//FUNCION PARA OBTENER EL PLAN DEL MES, EL REAL RECAUDADO Y EL % QUE REPRESENTA LO REAL DEL PLAN
const getPlanMes = () => {
  let metropolitanoEstatal = document.getElementById('generalMetropolitanoEstatal')
  let bifEstatal = document.getElementById('generalBfiEstatal')
  let metropolitanoNoEstatal = document.getElementById('generalMetropolitanoNoEstatal')
  let bifNoEstatal = document.getElementById('generalBfiNoEstatal')
  let sociedad = document.getElementById('generalSociedad')
  planMensualPost.value.realFronteraEstatal = parseFloat(metropolitanoEstatal.textContent)+parseFloat(bifEstatal.textContent)
  planMensualPost.value.realFronteraEstatal = Math.round(planMensualPost.value.realFronteraEstatal*100)/100
  planMensualPost.value.realFronteraTCP = parseFloat(metropolitanoNoEstatal.textContent)+parseFloat(bifNoEstatal.textContent)
  planMensualPost.value.realFronteraTCP = Math.round(planMensualPost.value.realFronteraTCP*100)/100
  planMensualPost.value.realSociedad = parseFloat(sociedad.textContent)
  planMensualPost.value.realSociedad = Math.round(planMensualPost.value.realSociedad*100)/100

  let url = `recaudacion/recaudacionMensual/${generarCodigo()}/getPlan/`
  axios.get(url)
      .then((response) => {
        planMensualPost.value.planFronteraEstatal = response.data.planFronteraEstatal
        planMensualPost.value.planFronteraTCP = response.data.planFronteraTCP
        planMensualPost.value.planSociedad = response.data.planSociedad
        planMensualPost.value.devolucion = response.data.devolucion
        porcentajeMesEstatal.value = planMensualPost.value.realFronteraEstatal*100/response.data.planFronteraEstatal
        porcentajeMesEstatal.value = Math.round(porcentajeMesEstatal.value*100)/100
        porcentajeMesTCP.value = planMensualPost.value.realFronteraTCP*100/response.data.planFronteraTCP
        porcentajeMesTCP.value = Math.round(porcentajeMesTCP.value*100)/100
        porcentajeMesSociedad.value = planMensualPost.value.realSociedad*100/response.data.planSociedad
        porcentajeMesSociedad.value = Math.round(porcentajeMesSociedad.value*100)/100
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//FUNCION PARA CALCULAR EL TOTAL POR CADA BANCO
const calcularTotalPorBanco = (lista, indicador) =>{
  let suma = 0
  lista.forEach((item) => {
    indicador==1?suma += item.totalMetropolitanoEstatal:''
    indicador==2?suma += item.totalMetropolitanoNoEstatal:''
    indicador==3?suma += item.totalBfiEstatal:''
    indicador==4?suma += item.totalBfiNoEstatal:''
    indicador==5?suma += item.totalSociedades:''
    indicador==6?suma += item.totalGeneral:''
  })
  suma = Math.round(suma*100)/100
  return suma
}

//FUNCION PARA IR SALVANDO EL VALOR DE LO REAL REACUADADO EN EL MES
const salvarRecaudacionReal = () => {
  let realFronteraEstatal = document.getElementById('realFronteraEstatal').textContent.replace('.', ',')
  let realFronteraTCP = document.getElementById('realFronteraTCP').textContent.replace('.', ',')
  let realSociedad = document.getElementById('realSociedad').textContent.replace('.', ',')
  let real = JSON.stringify({
    codigo:generarCodigo(),
    realFronteraEstatal:realFronteraEstatal,
    realFronteraTCP:realFronteraTCP,
    realSociedad:realSociedad
  })
  let url = `recaudacion/recaudacionMensual/${real}/actualizarReal/`
  axios.get(url)
      .then((response) => {
        mensaje('success','Exito', response.data.message)
      })
      .catch((error) => {
        mensaje('error', 'Error', error.response.data.error)
      })
}

//FUNCION PARA CALCULAR EL TOTAL EN PLAN
const calcularTotalEnPlan = () => {
  totalEnPlan.value = planMensualPost.value.planFronteraEstatal+planMensualPost.value.planFronteraTCP+planMensualPost.value.planSociedad
  totalEnPlan.value = Math.round(totalEnPlan.value*100)/100
  return totalEnPlan.value
}

//FUNCION PARA CALCULAR EL TOTAL EN REAL
const calcularTotalEnReal = () => {
  totalEnReal.value = planMensualPost.value.realFronteraEstatal+planMensualPost.value.realFronteraTCP+planMensualPost.value.realSociedad
  totalEnReal.value = Math.round(totalEnReal.value*100)/100
  return totalEnReal.value
}

//FUNCION PARA CALCULAR EL PORCENTAJE TOTAL
const calcularPorcentajeTotal = () => {
  porcentajeTotal.value = totalEnReal.value*100/totalEnPlan.value
  porcentajeTotal.value = Math.round(porcentajeTotal.value*100)/100
  return porcentajeTotal.value
}

const clavesTransferencia = (obj) => Object.keys(obj)
const creditosTransferencia = (clave) =>  transferencias.value[clave]
const clavesCheque = (obj) => Object.keys(obj)
const creditosCheques = (clave) => cheques.value[clave]

const resumenProvincias = () => {
  let url = `recaudacion/credito/${4}/resumenProvincias/`
  axios.get(url)
      .then((response) => {
        cheques.value = response.data.creditos[0].cheque
        totalesCheques.value = response.data.creditos[0].totalesCheques
        transferencias.value = response.data.creditos[1].transferencia
        totalesTransferencias.value = response.data.creditos[1].totalesTransferencias
        totalesGenerales.value = response.data.creditos[2].totalesGenerales
      })
      .catch((error) => {
        mensaje('error', 'Error', error.response.data.error)
      })
}

const getAcumuladoReal = () => {
  if(frontera.value==''){
    mensaje('error', 'Error', 'Debe seleccionar un tipo de frontera.')
    return false
  }
  if(planAcumulado.value<0){
    mensaje('error', 'Error', 'El campo Plan acumulado no puede ser negativo.')
    return false
  }
  if(fechaLimite.value==0){
    mensaje('error', 'Error', 'El campo fecha es requerido')
    return false
  }
  let url = `recaudacion/credito/${frontera.value},${fechaLimite.value}/acumuladoReal/`
  axios.get(url)
      .then((response) => {
        realAcumulado.value = response.data.real
        porcentajeAcumulado.value = realAcumulado.value*100/planAcumulado.value
        porcentajeAcumulado.value = Math.round(porcentajeAcumulado.value*100)/100
      })
      .catch((error) => {
        mensaje('error', 'Error', error.response.data.error)
      })
}

//FUNCION PARA OBTENER LOS MUNICIPIOS SEGUN LA PROVINCIA SELECCIONADA
const getMunicipios = (event) => {
  let slug = event.target.value
  let url = `licenciamiento/representante/${slug}/getMunicipios/`
  axios.get(url)
      .then((response) => {
        municipioAPI.value = response.data
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

const reset = () => window.location.reload()
const enviarEmail = () => {
  let url = `recaudacion/credito/${fechaInicio.value},${provincia.value}/enviarEmail/`
  if (provincia.value==''){
    mensaje('error','Error', 'Debe selecionar la provincia a notificar.')
    return false
  }
  axios.get(url)
      .then((response) => {
        response.data.hasOwnProperty('error')?mensaje('error','Error', response.data.error):mensaje('success','Exito', response.data.sms)
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

onMounted(() => {
  getCreditoPaginados()
  getRecaudacionActual()
  GET("recaudacion/sucursal/", sucursalAPI)
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
          <li class="breadcrumb-item active">Credito</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <!--      RENDERIZADO DEL FORMULARIO-->
      <div class="row">
        <div class="col-lg-12">
          <div class="card glassmorphism">
            <ul class="sidebar-nav p-2" id="cardFormulario">
              <a class="nav-link collapsed" style="background: None" data-bs-target="#formularioCargo"
                 data-bs-toggle="collapse" href="#"
                 aria-expanded="false"> <i class="bi-plus-circle"></i>
                <strong>{{ indice == -1 ? 'Nuevo credito' : 'Actualizar credito' }}</strong><i
                    class="bi bi-chevron-down ms-auto"></i>  </a>

            </ul>
            <div class="card-body nav-content" :class="expandir ? 'collapse':''" id="formularioCargo"
                 data-bs-parent="#cardFormulario">
              <form class="row g-3" id="formCredito">
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_recaudacion">
                      <option v-for="item in recaudacionAPI" :key="item.id" :value="item.id">{{ item.fechaEstadoCuenta }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Recaudacion</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.transferencia"
                                                    id="transferencia"
                                                    @click="desabilitarCheque"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Transferencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.cheque"
                                                    id="cheque"
                                                    @click="desabilitarTransferencia"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Cheque</label></div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="sucursal" aria-label="Cargo" @change="getProvinciaYmunicipio" v-model="dataPost.fk_sucursal">
                      <option v-for="item in sucursalAPI" :key="item.id" :value="item.id">{{ item.codigo }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Sucursal</label>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="provincias" aria-label="Cargo" @change="getMunicipios" v-model="dataPost.provincia">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Provincia</label>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="municipios" aria-label="Cargo" v-model="dataPost.municipio">
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.nombre">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Municipio</label>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_utilizador">
                      <option v-for="item in utilizadorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Utilizador</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.importe"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Importe</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.factura"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Factura</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.devolucion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">
                    <span class="text-danger">* </span>Devolucion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.tipoEstatal">
                      <option v-for="item in CHOICES_RECAUDACION[0].CREDITO" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Tipo</label>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="form-floating">
                    <textarea type="text" class="styleInput form-control" v-model="dataPost.observacion"
                              id="floatingName"
                              placeholder="Nombre"></textarea> <label for="floatingName">Observaciones</label></div>
                </div>
                <div class="col-md-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="dataPost.pertenenciaACDAM" id="gridCheck1">
                    <label class="form-check-label" for="gridCheck1"> <strong>Pertenece a ACDAM</strong> </label></div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('recaudacion/credito/', dataPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> {{ indice == -1 ? 'Agregar' : 'Actualizar' }}</button>
                  <button v-if="indice==-1" @click="reset" type="button" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
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
            <div class="filter">
              <a class="icon" href="#" data-bs-toggle="dropdown"><i style="color: black" class="bi bi-three-dots"></i></a>
              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li class="dropdown-header text-start">
                  <h6>Acciones</h6>
                </li>
                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#sendEmail"
                        href="#"><i class="bi bi-envelope"></i>Enviar correo</a></li>
              </ul>
            </div>
            <!--          MODAL ENVIAR CORREO-->
            <div class="modal fade" id="sendEmail" tabindex="-1">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title"><i class="bi bi-envelope"></i> <strong> Envio de Correo</strong></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="alert alert-warning sombra alert-dismissible fade show" role="alert">
                      <h4 class="alert-heading"><i class="bi bi-exclamation-triangle me-1"></i><strong>Atencion</strong></h4>
                      <p>Solo seleccione la <span class="text-uppercase text-dark text-decoration-underline">fecha inicial</span>  en caso de haber generado hoy ingresos de credito anteriores al dia de ayer.</p>
                    </div>
                    <form class="row">
                      <div class="col-md-3">
                        <div class="form-floating mb-3">
                          <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="provincia">
                            <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                            </option>
                          </select>
                          <label for="floatingSelect"><span class="text-danger">* </span>Provincia</label>
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-floating"><input type="date" class="styleInput form-control"
                                                          id="floatingName"
                                                          v-model="fechaInicio"
                                                          placeholder="Nombre"> <label for="floatingName">Fecha Inicial</label><br></div>
                      </div>
                      <div class="text-center">
                        <button
                            @click="enviarEmail"
                            class="miBtn btn btn-outline-dark" type="button">
                          <i class="bi bi-cursor"></i> Enviar
                        </button>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title"><i class="bi bi-layout-text-window-reverse"></i><strong> Listado de Creditos</strong></h5>
              <div v-if="creditoAPI.length==0" class="alert sombra alert-info alert-dismissible fade show" role="alert">
                <h4 class="alert-heading"><i class="bi bi-exclamation-circle me-1"></i><strong>Informacion</strong></h4>
                <p>Aun no se han registrado ningun ingreso de credito correspondiente al dia de hoy.</p>
              </div>
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
                    <li v-for="pagina in totalPaginas" @click="getCargosPaginados(pagina)" class="page-item"
                        :class="isActive(pagina)"><a class="page-link" href="#">{{ pagina }}</a></li>
                    <li class="page-item" @click="getPaginaSiguiente()"><a class="page-link" href="#" aria-label="Next"> <span
                        aria-hidden="true">»</span> </a></li>
                    <li class="page-item" @click="getCreditoPaginados(paginaActual)"><a class="page-link" title="Refrescar" href="#" aria-label="Next">
                      <i class="bi bi-arrow-repeat"></i> </a></li>
                  </ul>
                </nav>
                <table class="table table-striped">
                  <thead>
                  <tr>
                    <th scope="col">Acciones</th>
                    <th scope="col">Utilizador</th>
                    <th scope="col">Importe</th>
                    <th scope="col">Provincia</th>
                    <th scope="col">Municipio</th>
                    <th scope="col">Transferencia</th>
                    <th scope="col">Cheque</th>
                    <th scope="col">Factura</th>
                    <th scope="col">Devolucion</th>
                    <th scope="col">Tipo</th>
                  </tr>
                  </thead>
                  <tbody>
                  <div v-if="loading"><span class="loader"></span></div>
                  <tr v-for="(item, index) in listaFiltrada()" :key="item.id">
                    <td>
                        <span class="sombra badge bg-primary" @click="editarCredito(item, index)" title="Modificar"><i
                            class="bi bi-pencil"></i></span>
                      <span class="sombra badge bg-danger m-lg-1" @click="DELETE('recaudacion/credito/'+item.id)"
                            title="Eliminar"><i class="bi bi-trash"></i></span>
                    </td>
                    <td>{{ item.fk_utilizador }}</td>
                    <td> <span class="badge bg-primary"><i class="bi bi-currency-dollar"> {{ pintarImporteConDecimal(item.importe) }}</i></span></td>
                    <td>{{ item.provincia }}</td>
                    <td>{{ item.municipio }}</td>
                    <td><i :class="item.transferencia === ''?'bi bi-x-circle-fill':''"
                           :style="item.transferencia === ''?'color: red':''"></i>{{item.transferencia}}</td>
                    <td><i :class="item.cheque === ''?'bi bi-x-circle-fill':''"
                           :style="item.cheque === ''?'color: red':''"></i>{{item.cheque}}</td>
                    <td><i :class="item.factura === null?'bi bi-x-circle-fill':''"
                           :style="item.factura === null?'color: red':''"></i>{{item.factura}}</td>
                    <td><i :class="item.devolucion === null?'bi bi-x-circle-fill':''"
                           :style="item.devolucion === null?'color: red':''"></i>{{item.devolucion}}</td>
                    <td>{{ item.tipoEstatal }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

<!--      RENDERIZADO DEL COMPONENTE TABS-->
      <div class="card glassmorphism">
        <div class="card-body">
          <h5 class="card-title"><strong>Recaudacion General</strong></h5>
          <ul class="nav nav-tabs nav-tabs-bordered d-flex" id="borderedTabJustified" role="tablist">
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100 active" id="home-tab" data-bs-toggle="tab"
                      data-bs-target="#bordered-justified-home" type="button" role="tab" aria-controls="home"
                      aria-selected="true">Ingresos del dia</button></li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100" @click="getRecaudacionResumen" id="profile-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-profile"
                      type="button" role="tab" aria-controls="profile" aria-selected="false">Tabla de ingresos diarios</button></li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100" @click="getPlanMes" id="contact-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-contact"
                      type="button" role="tab" aria-controls="contact" aria-selected="false">Plan del Mes</button></li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100" @click="resumenProvincias" id="contactt-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-contactt"
                      type="button" role="tab" aria-controls="contact" aria-selected="false">Resumen Por Provincias</button></li>
            <li class="nav-item flex-fill" role="presentation">
              <button class="nav-link w-100"  id="contactt-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-contacttt"
                      type="button" role="tab" aria-controls="contact" aria-selected="false">Acumulado</button></li>
          </ul>
          <div class="tab-content pt-2" id="borderedTabJustifiedContent">
            <div class="tab-pane fade show active" id="bordered-justified-home" role="tabpanel" aria-labelledby="home-tab">
              <button @click="calcularTotales"  class="miBtn btn btn-outline-light" type="button">
                <i class="bi bi-currency-dollar"></i> Obtener montos totales</button>
              <hr>
              <form class="row g-3">
                <div class="col-md-3">
                  <div class="form-floating"><input type="number" class="form-control"
                                                    v-model="dataRecaudacionPost.totalMetropolitanoEstatal"
                                                    readonly
                                                    id="floatingName"
                                                    placeholder="Nombre">
                    <label for="floatingName">Metropolitano Estatal</label></div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating"><input type="number" class="form-control"
                                                    v-model="dataRecaudacionPost.totalMetropolitanoNoEstatal"
                                                    readonly
                                                    id="floatingName"
                                                    placeholder="Nombre">
                    <label for="floatingName">Metropolitano No Estatal</label></div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating"><input type="number" class="form-control"
                                                    v-model="dataRecaudacionPost.totalBfiEstatal"
                                                    readonly
                                                    id="floatingName"
                                                    placeholder="Nombre">
                    <label for="floatingName">BFI Estatal</label></div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating"><input type="number" class="form-control"
                                                    v-model="dataRecaudacionPost.totalBfiNoEstatal"
                                                    readonly
                                                    id="floatingName"
                                                    placeholder="Nombre">
                    <label for="floatingName">BFI No Estatal</label></div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating"><input type="number" class="form-control"
                                                    v-model="dataRecaudacionPost.totalSociedades"
                                                    readonly
                                                    id="floatingName"
                                                    placeholder="Nombre">
                    <label for="floatingName">Sociedades</label></div>
                </div>
                <div class="col-md-3">
                  <div class="form-floating"><input type="number" class=" form-control"
                                                    v-model="dataRecaudacionPost.totalGeneral"
                                                    readonly
                                                    id="floatingName"
                                                    placeholder="Nombre">
                    <label for="floatingName">Total General</label></div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('recaudacion/resumenRecaudacion/', dataRecaudacionPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> Salvar</button>
                </div>
              </form>
            </div>
            <div class="tab-pane fade" id="bordered-justified-profile" role="tabpanel" aria-labelledby="profile-tab">
              <table class="table table-striped">
                <thead>
                <tr>
                  <th scope="col">Dia</th>
                  <th scope="col">Banco Metropolitano Estatal</th>
                  <th scope="col">Banco Metropolitano No Estatal</th>
                  <th scope="col">BFI Estatal</th>
                  <th scope="col">BFI No Estatal</th>
                  <th scope="col">Sociedades</th>
                  <th scope="col">Total Recaudado en el dia</th>
                </tr>
                </thead>
                <tbody>
                <div v-if="loading"><span class="loader"></span></div>
                <tr v-for="(item, index) in resumenRecaudacionAPI" :key="item.id">
                  <td>{{ item.fechaCreacion }}</td>
                  <td>{{ item.totalMetropolitanoEstatal }}</td>
                  <td>{{ item.totalMetropolitanoNoEstatal }}</td>
                  <td>{{ item.totalBfiEstatal }}</td>
                  <td>{{ item.totalBfiNoEstatal }}</td>
                  <td>{{ item.totalSociedades }}</td>
                  <td>{{ item.totalGeneral }}</td>
                </tr>
                <tr>
                  <td><strong>TOTAL</strong></td>
                  <td id="generalMetropolitanoEstatal">{{calcularTotalPorBanco(resumenRecaudacionAPI,1)}}</td>
                  <td id="generalMetropolitanoNoEstatal">{{calcularTotalPorBanco(resumenRecaudacionAPI,2)}}</td>
                  <td id="generalBfiEstatal">{{calcularTotalPorBanco(resumenRecaudacionAPI,3)}}</td>
                  <td id="generalBfiNoEstatal">{{calcularTotalPorBanco(resumenRecaudacionAPI,4)}}</td>
                  <td id="generalSociedad">{{calcularTotalPorBanco(resumenRecaudacionAPI,5)}}</td>
                  <td>{{calcularTotalPorBanco(resumenRecaudacionAPI,6)}}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="tab-pane fade" id="bordered-justified-contact" role="tabpanel" aria-labelledby="contact-tab">
              <button @click="salvarRecaudacionReal"  class="miBtn btn btn-outline-light" type="button">
                <i class="bi bi-safe"></i> Salvar monto real</button>
              <hr>
              <table class="table">
                <thead>
                <tr>
                  <th scope="col" style="width: 25%">Caracteristica</th>
                  <th scope="col" style="width: 25%">Plan</th>
                  <th scope="col" style="width: 15%">Real</th>
                  <th scope="col" class="text-center">%</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th scope="row">En Frontera Estatal</th>
                  <td>{{pintarImporteConDecimal(planMensualPost.planFronteraEstatal)}}</td>
                  <td id="realFronteraEstatal">{{pintarImporteConDecimal(planMensualPost.realFronteraEstatal)}}</td>
                  <td><div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                       role="progressbar" :style="{width: `${porcentajeMesEstatal}%`}" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">{{porcentajeMesEstatal}}%</div>
                  </div></td>
                </tr>
                <tr>
                  <th scope="row">En Frontera TCP</th>
                  <td>{{pintarImporteConDecimal(planMensualPost.planFronteraTCP)}}</td>
                  <td id="realFronteraTCP">{{pintarImporteConDecimal(planMensualPost.realFronteraTCP)}}</td>
                  <td><div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                         role="progressbar" :style="{width: `${porcentajeMesTCP}%`}" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">{{porcentajeMesTCP}}%</div>
                  </div></td>
                </tr>
                <tr>
                  <th scope="row">En Sociedad</th>
                  <td>{{pintarImporteConDecimal(planMensualPost.planSociedad)}}</td>
                  <td id="realSociedad">{{pintarImporteConDecimal(planMensualPost.realSociedad)}}</td>
                  <td><div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                         role="progressbar" :style="{width: `${porcentajeMesSociedad}%`}" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">{{porcentajeMesSociedad}}%</div>
                  </div></td>
                </tr>
                <tr>
                  <th scope="row">Devolucion</th>
                  <td>{{pintarImporteConDecimal(planMensualPost.devolucion)}}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">Total</th>
                  <td>{{calcularTotalEnPlan()}}</td>
                  <td>{{calcularTotalEnReal()}}</td>
                  <td><div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                         role="progressbar" :style="{width: `${calcularPorcentajeTotal()}%`}" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">{{calcularPorcentajeTotal()}}%</div>
                  </div></td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="tab-pane fade" id="bordered-justified-contactt" role="tabpanel" aria-labelledby="contact-tab">
              <p class="text-center"><span class="text-uppercase badge rounded-pill bg-light text-dark"
                                           style="font-size: 15px; margin-bottom: 10px">
              CHEQUES</span></p>
              <div class="alert glassmorphism border-secondary alert-dismissible fade show" role="alert" data-v-943e459c="">
                <div class="row">
                  <div class="col" v-for="i in clavesCheque(cheques)">
                    <h3>{{i}}</h3>
                    <div>
                      <p v-for="j in creditosCheques(i)">{{pintarImporteConDecimal(j)}}</p>
                    </div>
                  </div>
                </div>
                <hr data-v-943e459c="">
                <div class="row">
                  <div class="col" v-for="i in totalesCheques">
                    <h5 class="text-dark">${{pintarImporteConDecimal(i)}}</h5>
                  </div>
                </div></div>
              <br>
              <p class="text-center"><span class="text-uppercase badge rounded-pill bg-light text-dark"
                                           style="font-size: 15px; margin-bottom: 10px">
              TRANSFERENCIAS</span></p>
              <div class="alert glassmorphism border-secondary alert-dismissible fade show" role="alert" data-v-943e459c="">
                <div class="row">
                  <div class="col" v-for="i in clavesTransferencia(transferencias)">
                    <h3>{{i}}</h3>
                    <div>
                      <p v-for="j in creditosTransferencia(i)">{{pintarImporteConDecimal(j)}}</p>
                    </div>
                  </div>
                </div>
                <hr data-v-943e459c="">
                <div class="row">
                  <div class="col" v-for="i in totalesTransferencias">
                    <h5 class="text-dark">${{pintarImporteConDecimal(i)}}</h5>
                  </div>
                </div></div>
              <br>
              <p class="text-center"><span class="text-uppercase badge rounded-pill bg-light text-dark"
                                           style="font-size: 15px; margin-bottom: 10px">
              GENERALES</span></p>
              <div class="alert glassmorphism border-secondary alert-dismissible fade show" role="alert" data-v-943e459c="">
                <div class="row">
                  <div class="col" v-for="i in totalesGenerales">
                    <h5 class="text-dark">${{pintarImporteConDecimal(i)}}</h5>
                  </div>
                </div></div>
            </div>
            <div class="tab-pane fade" id="bordered-justified-contacttt" role="tabpanel" aria-labelledby="contact-tab">
              <div class="alert sombra alert-warning alert-dismissible fade show" role="alert" data-v-4028e7a6="">
                <h4 class="alert-heading" data-v-4028e7a6=""><i class="bi bi-exclamation-diamond" data-v-4028e7a6="">
                </i><strong data-v-4028e7a6=""> Atencion</strong></h4>
                <p data-v-4028e7a6="">Complete los siguientes campos para saber el real acumulado.</p></div>
              <form class="row">
                <div class="col-md-4">
                  <div class="form-floating "><select class="styleInput form-select" id="floatingSelect" aria-label="State" v-model="frontera">
                    <option value="">-----------</option>
                    <option value="1">En Frotera Estatal</option>
                    <option value="2">En Frontera TCP</option>
                    <option value="3">Sociedad</option>
                  </select> <label for="floatingName"><span
                      class="text-danger">*</span> Fronteras</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"
                                                    id="floatingName" v-model="planAcumulado"
                                                    placeholder="Nombre"> <label for="floatingName"><span
                      class="text-danger">* </span>Plan Acumulado</label><br></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control"
                                                    id="floatingName" v-model="fechaLimite"
                                                    placeholder="Nombre"> <label for="floatingName"><span
                      class="text-danger">* </span>Fecha Limite</label></div>
                </div>

                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" readonly hidden
                                                    id="floatingName"
                                                    placeholder="Nombre"></div>
                </div>
              </form>
              <button @click="getAcumuladoReal"  class="miBtn btn btn-outline-light" type="button">
                <i class="bi bi-currency-euro"></i> Obtener acumulado real</button>
              <hr>
              <table class="table">
                <thead>
                <tr>
                  <th scope="col" style="width: 35%">Plan Acumulado</th>
                  <th scope="col" style="width: 25%">Real Acumulado</th>
                  <th scope="col" class="text-center">%</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>${{pintarImporteConDecimal(`${planAcumulado}`)}}</td>
                  <td id="realFronteraEstatal">${{pintarImporteConDecimal(realAcumulado)}}</td>
                  <td><div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                         role="progressbar" :style="{width: `${porcentajeAcumulado}%`}" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">{{porcentajeAcumulado}}%</div>
                  </div></td>
                </tr>
                </tbody>
              </table>
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