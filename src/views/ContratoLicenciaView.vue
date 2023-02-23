<script setup>
import axios from "axios";
import html2pdf from  'html2pdf.js'
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

import 'form-wizard-vue3/dist/form-wizard-vue3.css';
import Wizard from 'form-wizard-vue3';
import Base from "@/components/base/Base.vue";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'
import CHOICES from '../util/choicesDeLicenciamiento'
import {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado} from '../util/peticionesServer'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const utilizadorAPI = ref([])             //variable que almacenara un listado de utilizadores
const representanteAPI = ref([])          //variable que almacenara un listado de representantes
const proformaAPI = ref([])               //variable que almacenara un listado de proformas
const contratoLicEstatalAPI = ref([])     //variable que almacenara un listado de contratos
const municipioAPI = ref([])              //variable que almacenara un listado de municipios
const idProforma = ref('')                //variable que almacenara el id de una proforma
const objUtilizador = ref({
  pk:'',
  tipo:'',
  tipoNoEstatal:'',
  sector:'',
  derecho:''
})         //variable que almacenara un objeto Utilizador
const dataPost = ref({
  pk: '',
  fk_proforma: '',
  fk_utilizador: '',
  fk_representantesAsociados: [],
  fk_municipio: '',
  resolucion: '',
  provincia: '',
  fecha: '',
  numeroLicencia: '',
  nit: '',
  codigo: '',
  direccion: '',
  estado: '',
  tiempoVigencia: '',
  fechaVecimiento: '',
  subordinacion: '',
  nombreFirmanteContrato: '',
  cargoFirmanteContrato: '',
  codigoREEUP: '',
  cuentaBancaria: '',
  emitido: '',
  sucursal: '',
  tarifa: '',
  banco: '',
  tipo: '',
  codigoOnei: '',
  cuentaCorriente: '',
  nombreComercial: '',
  provinciaComercial: '',
  fk_municipioComercial: '',
  direccionComercial: '',
  actividadComercial: '',
  representacionObrasEscenicas: '',
  comunicacionObrasAudioVisuales: '',
  local: '',
  ejecucionObrasComercial: '',
  email: '',
  telefono: '',
})              //variable que almacenara la data del contrato(Paso 2) a enviar (para cuando es estatal)
const lastContrato = ref({
  titulo:'',
  descripcion:'',
  numeroLicencia:'',
  codigo:'',
  utilizador:'',
  direccion:'',
  municipio:'',
  nit:'',
  fecha:'',
  subordinacion:'',
  nombreFirmanteContrato:'',
  cargoFirmanteContrato:'',
  codigoREEUP:'',
  cuentaBancaria:'',
  sucursal: '',
  banco: '',
  tipo: '',
  tarifa: '',
  codigoOnei: '',
  cuentaCorriente: '',
  nombreComercial: '',
  provinciaComercial: '',
  fk_municipioComercial: '',
  direccionComercial: '',
  actividadComercial: '',
  representacionObrasEscenicas: '',
  comunicacionObrasAudioVisuales: '',
  local: '',
  email: '',
  telefono: '',
})      //variable que almacenara el ultimo contrato creado
const cuerpoDelContrato = ref('')         //variable que la descripcion del contrato(atributo que se obtine del lastContrato)
const cuerpoDelContrato2daParte = ref('')         //variable que la descripcion del contrato(atributo que se obtine del lastContrato)
const cuerpoDelContrato3eraParte = ref('')         //variable que la descripcion del contrato(atributo que se obtine del lastContrato)

let currentTabIndex = 0                        //variable que funciona como indice del wizard

//PARA EL WIZARD
const onChangeCurrentTab = (index, oldIndex) => {
  currentTabIndex = index;
  //Obtencion del ultimo contrato creado para poder renderizarlo y exportarlo a PDF (Paso 3)
  if (currentTabIndex === 2 && objUtilizador.value.tipo == 1){
    let url = 'licenciamiento/contratoLicenciaEstatal/getlastContrato/'
    axios.get(url)
        .then((response) => {
          cuerpoDelContrato.value = `<p style="text-align: justify">${response.data.descripcion}</p>`
          lastContrato.value.titulo = response.data.titulo
          lastContrato.value.descripcion = response.data.descripcion
          lastContrato.value.numeroLicencia = response.data.numeroLicencia
          lastContrato.value.codigo = response.data.codigo
          lastContrato.value.utilizador = response.data.utilizador
          lastContrato.value.direccion = response.data.direccion
          lastContrato.value.provincia = response.data.provincia
          lastContrato.value.municipio = response.data.municipio
          lastContrato.value.nit = response.data.nit
          lastContrato.value.fecha = response.data.fecha
          lastContrato.value.subordinacion = response.data.subordinacion
          lastContrato.value.nombreFirmanteContrato = response.data.nombreFirmanteContrato
          lastContrato.value.cargoFirmanteContrato = response.data.cargoFirmanteContrato
          lastContrato.value.codigoREEUP = response.data.codigoREEUP
          lastContrato.value.cuentaBancaria = response.data.cuentaBancaria
        })
        .catch((error) => {
          mensaje('error','Error', error.response.data.error)
        })
  }
  if (currentTabIndex === 2 && objUtilizador.value.tipo == 2 && objUtilizador.value.tipoNoEstatal == 'PJ') {
    let url = 'licenciamiento/contratoLicenciaPersonaJuridica/getlastContrato/'
    axios.get(url)
        .then((response) => {
          cuerpoDelContrato.value = `<p style="text-align: justify">${response.data.descripcion}</p>`
          cuerpoDelContrato2daParte.value = `<p style="text-align: justify">${response.data.descripcion2daParte}</p>`
          cuerpoDelContrato3eraParte.value = `<p style="text-align: justify">${response.data.descripcion3eraParte}</p>`
          lastContrato.value.titulo = response.data.titulo
          lastContrato.value.descripcion = response.data.descripcion
          lastContrato.value.numeroLicencia = response.data.numeroLicencia
          lastContrato.value.codigo = response.data.codigo
          lastContrato.value.utilizador = response.data.utilizador
          lastContrato.value.direccion = response.data.direccion
          lastContrato.value.provincia = response.data.provincia
          lastContrato.value.municipio = response.data.municipio
          lastContrato.value.nit = response.data.nit
          lastContrato.value.fecha = response.data.fecha
          lastContrato.value.tipo = response.data.tipo
          lastContrato.value.tarifa = response.data.tarifa
          lastContrato.value.banco = response.data.banco
          lastContrato.value.sucursal = response.data.sucursal
          lastContrato.value.nombreFirmanteContrato = response.data.nombreFirmanteContrato
          lastContrato.value.cargoFirmanteContrato = response.data.cargoFirmanteContrato
          lastContrato.value.codigoOnei = response.data.codigoOnei
          lastContrato.value.nombreComercial = response.data.nombreComercial
          lastContrato.value.provinciaComercial = response.data.provinciaComercial
          lastContrato.value.fk_municipioComercial = response.data.fk_municipioComercial
          lastContrato.value.direccionComercial = response.data.direccionComercial
          lastContrato.value.actividadComercial = response.data.actividadComercial
          lastContrato.value.email = response.data.email
          lastContrato.value.telefono = response.data.telefono
          lastContrato.value.ejecucionObrasComercial = response.data.ejecucionObrasComercial
          lastContrato.value.representacionObrasEscenicas = response.data.representacionObrasEscenicas
          lastContrato.value.comunicacionObrasAudioVisuales = response.data.comunicacionObrasAudioVisuales
          lastContrato.value.local = response.data.local
        })
        .catch((error) => {
          mensaje('error','Error', error.response.data.error)
        })
  }
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

//Funcion para la obtencion del utilizador selecionado en el paso 1 del wizard y las proformas correspondientes segun el utilizador
const getUtilizador = (event) => {
  let id = event.target.value
  let url = `licenciamiento/utilizador/${id}/`
  axios.get(url)
      .then((response) => {
        objUtilizador.value.pk = response.data.data.id
        objUtilizador.value.tipo = response.data.data.tipo
        objUtilizador.value.tipoNoEstatal = response.data.data.tipoNoEstatal
        objUtilizador.value.derecho = response.data.data.tipoDerecho
        objUtilizador.value.sector = response.data.data.fk_sector
        proformaAPI.value = response.data.proformas
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

//Funcion para obtener el id de la proforma seleccionada y asignar esos valores a los datos que se enviaran del contrato
const getProforma = (event) => {
  idProforma.value = event.target.value
  dataPost.value.fk_proforma = idProforma.value
  dataPost.value.fk_utilizador = objUtilizador.value.pk
}

//Funcion para obtener los municpios segun la provincia que sea seleccionada
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

//Declaracion del objeto Date que es utilizado en el ultimo parrafo del contrato (paso 3)
const date = new Date()
const dia = date.getDate()
const mes = date.toLocaleString('default',{month:'long'})
const ano = date.getFullYear()

//Funcion para generar el pdf
const PDF = () => {
  let content = document.getElementById('pdf')
  let options = {
    margin:       0.6,
    filename:     `${lastContrato.value.titulo}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 3 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(content).set(options).save();
}

onMounted(() => {
  GET("licenciamiento/utilizador/", utilizadorAPI)
  GET("licenciamiento/representante/", representanteAPI)
  GET("licenciamiento/contratoLicenciaEstatal/", contratoLicEstatalAPI)

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
          <div class="alert alert-light glassmorphism text-center alert-dismissible fade show" role="alert">
            <i class="bi bi-star me-1"></i> <strong>GENERAR UN NUEVO CONTRATO</strong>
            <div class="filter">
              <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots" style="color: black"></i></a>
              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li class="dropdown-header text-start">
                  <h6>Acciones</h6>
                </li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-arrow-repeat"></i>Actualizar listado</a></li>
              </ul>
            </div>
          </div>

        </div>
        <!--        Componente wizard-->
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
                                    title: 'Seleccion de utilizador y proforma',
                                  },
                                  {
                                    title: 'Datos del contrato',
                                  },
                                  {
                                    title: 'Formatear y Exportar a PDF',
                                  },
                                  {
                                    title: 'Datos del anexo',
                                  },
                                  {
                                    title: 'Exportar anexo',
                                  },
                                ]"
              :beforeChange="onTabBeforeChange"
              @change="onChangeCurrentTab"
              @complete:wizard="wizardCompleted"
          >
            <!--            Proceso para el paso 1-->
            <div class="row" v-if="currentTabIndex === 0">
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getUtilizador($event)">
                    <option  value="">----------</option>
                    <option v-for="item in utilizadorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <label for="floatingSelect">Utilizadores</label>
                </div>
                <div v-if="objUtilizador.tipo=='1'" class="alert alert-secondary alert-dismissible fade show" role="alert">
                  <h5><strong>Datos del utilizador:</strong></h5>
                  <p>Tipo: Estatal</p>
                  <p>Sector: {{ objUtilizador.sector }}</p>
                  <p>Derecho: {{ objUtilizador.derecho }}</p>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <div v-if="objUtilizador.tipo=='2'" class="alert alert-secondary alert-dismissible fade show" role="alert">
                  <h5><strong>Datos del utilizador:</strong></h5>
                  <p>Tipo: No estatal ({{ objUtilizador.tipoNoEstatal }}) </p>
                  <p>Sector: {{ objUtilizador.sector }}</p>
                  <p>Derecho: {{ objUtilizador.derecho }}</p>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getProforma($event)">
                    <option  value="">----------</option>
                    <option v-for="item in proformaAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <label for="floatingSelect">Proformas</label>
                </div>
              </div>
            </div>

            <!--            Proceso para el paso 2-->
            <!--            Formulario para cuando el utilizador es estatal-->
            <p class="text-center"><span v-if="currentTabIndex === 1 && objUtilizador.tipo == 1"
                  class="text-uppercase badge rounded-pill bg-light text-dark" style="font-size: 15px; margin-bottom: 10px">
              Ingrese la informacion solicitada para el modelo de contrato estatal</span></p>
            <div v-if="currentTabIndex === 1 && objUtilizador.tipo == 1">
              <form class="row">
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly
                                                    id="floatingName" v-model="dataPost.fk_proforma"
                                                    placeholder="Nombre"> <label for="floatingName">Profoma</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly
                                                    id="floatingName" v-model="dataPost.fk_utilizador"
                                                    placeholder="Nombre"> <label for="floatingName">Utilizador</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.fk_representantesAsociados" multiple>
                      <option v-for="item in representanteAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Asociados</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.resolucion">
                      <option v-for="item in CHOICES[1].RESOLUCION" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Resolucion</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getMunicipios" v-model="dataPost.provincia">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Provincia</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_municipio">
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Municipio</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control" v-model="dataPost.fecha"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Fecha</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.numeroLicencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Numero de Licencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.nit"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">NIT</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Dirrecion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.estado">
                      <option v-for="item in CHOICES[5].ESTADO" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Estado</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.tiempoVigencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Tiempo Vigencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control"  v-model="dataPost.fechaVecimiento"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Fecha de Expiracion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.subordinacion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Subordinacion</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombreFirmanteContrato"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre del Firmante</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.cargoFirmanteContrato"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Cargo del firmante</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigoREEUP"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo REEUP</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.cuentaBancaria"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Cuenta Bancaria</label></div>
                </div>
                <hr>
                <div class="col-md-4">
                  <div class="col-sm-10">
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"  v-model="dataPost.emitido"
                                                               id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">Emitido</label></div>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/contratoLicenciaEstatal/', dataPost, -1)"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> Salvar</button>
                </div>
              </form>
            </div>
            <!--            Formulario para el utilizador es no estatal persona juridica-->
            <p class="text-center"><span v-if="currentTabIndex === 1 && objUtilizador.tipo == 2 && objUtilizador.tipoNoEstatal == 'PJ'"
                  class="text-uppercase badge rounded-pill bg-light text-dark" style="font-size: 15px; margin-bottom: 10px">
              Ingrese la informacion solicitada para el modelo de contrato no estatal juridico</span></p>
            <div v-if="currentTabIndex === 1 && objUtilizador.tipo == 2 && objUtilizador.tipoNoEstatal == 'PJ'">
              <form class="row">
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly
                                                    id="floatingName" v-model="dataPost.fk_proforma"
                                                    placeholder="Nombre"> <label for="floatingName">Profoma</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly
                                                    id="floatingName" v-model="dataPost.fk_utilizador"
                                                    placeholder="Nombre"> <label for="floatingName">Utilizador</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.fk_representantesAsociados" multiple>
                      <option v-for="item in representanteAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Asociados</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.resolucion">
                      <option v-for="item in CHOICES[1].RESOLUCION" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Resolucion</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getMunicipios" v-model="dataPost.provincia">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Provincia</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_municipio">
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Municipio</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.tipo">
                      <option v-for="item in CHOICES[10].TIPO_JURIDICO" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Tipo</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.banco"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Banco</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.tarifa"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Tarifa (%)</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control" v-model="dataPost.fecha"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Fecha</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.numeroLicencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Numero de Licencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.nit"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">NIT</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Dirrecion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.estado">
                      <option v-for="item in CHOICES[5].ESTADO" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Estado</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.tiempoVigencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Tiempo Vigencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control"  v-model="dataPost.fechaVecimiento"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Fecha de Expiracion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigoOnei"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo Onei</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.sucursal"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Sucursal</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombreFirmanteContrato"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre del firmante</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.cargoFirmanteContrato"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Cargo del firmante</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombreComercial"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre Comercial</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getMunicipios" v-model="dataPost.provinciaComercial">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Provincia Comercial</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_municipioComercial">
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Municipio Comercial</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.cuentaCorriente"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Cuenta corriente</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccionComercial"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Dirrecion Comercial</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.actividadComercial">
                      <option v-for="item in CHOICES[6].ACTIVIDAD" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Actividad Comercial</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="email" class="styleInput form-control" v-model="dataPost.email"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Correo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.telefono"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Telefono</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.ejecucionObrasComercial">
                      <option v-for="item in CHOICES[11].TIPO_OBRA_COMERCIAL" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Ejecucion de obras musicales</label>
                  </div>
                </div>
                <hr>
                <div class="col-md-4">
                  <div class="col-sm-10">
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"  v-model="dataPost.emitido"
                                                               id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">Emitido</label></div>
                  </div>
                </div>
                <div class="col-md-9">
                  <div class="col-sm-10">
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"  v-model="dataPost.representacionObrasEscenicas"
                                                               id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">Representacion de obras de las artes escenicas</label></div>
                  </div>
                </div>
                <div class="col-md-9">
                  <div class="col-sm-10">
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox"  v-model="dataPost.comunicacionObrasAudioVisuales"
                                                               id="flexSwitchCheckDefault">
                      <label class="form-check-label" for="flexSwitchCheckDefault">Comunicacion al publico de obras audiovisuales</label></div>
                  </div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/contratoLicenciaPersonaJuridica/', dataPost, -1)"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> Salvar</button>
                </div>
              </form>
            </div>

            <!--            Proceso para el paso 3-->
            <div v-if="currentTabIndex === 2" >
              <section id="pdf">
<!--                PDF a generar si es estatal-->
                <div v-if="objUtilizador.tipo == 1">
                  <div class="d-flex align-items-center justify-content-between">
                    <h5 class="text-center" ><strong>{{lastContrato.titulo}}</strong></h5>
                    <img src="../assets/img/acdamlogo.jpg">
                  </div>
                  <br>
                  <div class="d-flex align-items-center justify-content-between">
                    <p></p>
                    <p>Licencia No. {{lastContrato.numeroLicencia}}  de 2021, ACDAM</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p></p>
                    <p>Código de Utilizador No. {{lastContrato.codigo}}</p>
                  </div>
                  <br>
                  <p style="text-align: justify"><strong>DE UNA PARTE:</strong> La Agencia Cubana de Derecho de Autor Musical, creada por la Resolución No. 150, de fecha
                    12 de diciembre de 1986, del Ministro de Cultura, la que pertenece al Instituto Cubano de la Música, de
                    conformidad con lo dispuesto en la Resolución No. 36, de fecha 11 de marzo de 1989, del Ministro de Cultura,
                    con domicilio legal en calle 6, No. 313, entre 13 y 15, municipio Plaza de la Revolución, en la provincia de La Habana,
                    con Código REEUP: 234.0.08152, NIT: 11001814862, Cuenta Bancaria en CUP No. 0525040005600016 en el
                    Banco Metropolitano, S.A., Sucursal No. 250, que en lo adelante se denominará, a los efectos de este contrato,
                    ACDAM, representada en este acto por René Hernández Quintero, en su condición de Director, designado por la
                    Resolución No.38, de fecha 20 de mayo de 2009, del Presidente del Instituto Cubano de la Música; y</p>
                  <p style="text-align: justify"><strong>DE OTRA PARTE:</strong> La entidad {{lastContrato.utilizador}}, perteneciente
                    a ______________________________________,
                    constituida mediante ________________________________________, con domicilio legal en {{lastContrato.direccion}},
                    municipio {{lastContrato.municipio}}, en la provincia de {{lastContrato.provincia}},
                    Código REEUP. {{lastContrato.codigoREEUP}}, NIT. {{lastContrato.nit}}, Cuenta Bancaria en CUP No. {{lastContrato.cuentaBancaria}} en el
                    Banco {{lastContrato.banco}}, Sucursal {{lastContrato.sucursal}}, sita en ____________________________,
                    municipio _________________, que en lo adelante se denominará, a los efectos de este contrato-licencia,
                    PRODUCTOR, representado en este acto por ________________________________, en su carácter
                    de _______________________________, designado(a) en este cargo mediante _________________________, de
                    fecha ______________________, emitido(a) por ______________________.</p>
                  <p v-if="objUtilizador.tipo == 1" style="text-align: justify">
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="cuerpoDelContrato" content-type="html"></QuillEditor>
                  </p>
                  <p style="text-align: justify">Y como muestra de conformidad y aceptación, las partes suscriben el presente contrato, en dos (2) ejemplares,
                    a un mismo tenor y efectos legales, en La Habana, a los {{dia}} días del mes de {{mes}} de {{ano}}.</p>
                  <br>
                  <br>
                  <div class="d-flex align-items-center justify-content-between">
                    <p>POR LA ACDAM:</p>
                    <p>POR EL PRODUCTOR:</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p>_______________________ </p>
                    <p>_______________________ </p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p>Director René Hernández Quintero </p>
                    <p></p>
                  </div>
                </div>
<!--                PDF a generar si es no estatal juridico-->
                <div v-if="objUtilizador.tipo == 2 && objUtilizador.tipoNoEstatal == 'PJ'">
                  <div class="d-flex align-items-center justify-content-between">
                    <h5 class="text-center" ><strong>{{lastContrato.titulo}}</strong></h5>
                    <img src="../assets/img/acdamlogo.jpg">
                  </div>
                  <br>
                  <div class="d-flex align-items-center justify-content-between">
                    <p></p>
                    <p>Licencia No. {{lastContrato.numeroLicencia}}  de 2021, ACDAM</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p></p>
                    <p>Código de Utilizador No. {{lastContrato.codigo}}</p>
                  </div>
                  <br>
                  <p style="text-align: justify"><strong>DE UNA PARTE:</strong> La Agencia Cubana de Derecho de Autor Musical, creada por la Resolución No. 150, de fecha
                    12 de diciembre de 1986, del Ministro de Cultura, la que pertenece al Instituto Cubano de la Música, de
                    conformidad con lo dispuesto en la Resolución No. 36, de fecha 11 de marzo de 1989, del Ministro de Cultura,
                    con domicilio legal en calle 6, No. 313, entre 13 y 15, municipio Plaza de la Revolución, en la provincia de La Habana,
                    con Código REEUP: 234.0.08152, NIT: 11001814862, Cuenta Bancaria en CUP No. 0525040005600016 en el
                    Banco Metropolitano, S.A., Sucursal No. 250, que en lo adelante se denominará, a los efectos de este contrato,
                    ACDAM, representada en este acto por René Hernández Quintero, en su condición de Director, designado por la
                    Resolución No.38, de fecha 20 de mayo de 2009, del Presidente del Instituto Cubano de la Música; y</p>
                  <p style="text-align: justify"><strong>DE OTRA PARTE:</strong> __________________________________, en su condicion de
                    {{lastContrato.tipo}}, creada mediante __________________________________ domicilio legal en {{lastContrato.direccion}} municipio
                  {{lastContrato.municipio}}, provincia {{lastContrato.provincia}}, Codigo ONIE. {{lastContrato.codigoOnei}}, NIT. {{lastContrato.nit}}
                  Cuenta corriente en CUP. {{lastContrato.cuentaCorriente}}, en el Banco {{lastContrato.banco}}, sucursal {{lastContrato.sucursal}},
                  representada en este acto por _______________________ en su caracter de _______________________, segun consta en _______________
                  que en lo de adelante se denominara, <strong>UTILIZADOR</strong></p>
                  <p style="text-align: justify">
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="cuerpoDelContrato" content-type="html"></QuillEditor>
                  </p>
                  <p style="text-align: justify" v-if="lastContrato.nombreComercial != ''">Nombre Comercial: {{lastContrato.nombreComercial}}, Direccion: {{lastContrato.direccionComercial}}
                    Municipio: {{lastContrato.fk_municipioComercial}}, Provincia: {{lastContrato.provinciaComercial}}, Telefono: {{lastContrato.telefono}},
                    Email: {{lastContrato.email}}, Tipo actividad comercial: {{lastContrato.actividadComercial}}, Ejecucion de obras comercial
                    {{lastContrato.ejecucionObrasComercial}} Tipo derecho comercial: {{lastContrato.tipoDerechoComercial}}</p>
                  <p style="text-align: justify">
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="cuerpoDelContrato2daParte" content-type="html"></QuillEditor>
                  </p>
                  <p style="text-align: justify">Tarifa: {{lastContrato.tarifa}}% de los ingresos brutos mensuales.</p>
                  <p style="text-align: justify">
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="cuerpoDelContrato3eraParte" content-type="html"></QuillEditor>
                  </p>
                  <p style="text-align: justify">Y como muestra de conformidad y aceptación, las partes suscriben el presente contrato, en dos (2) ejemplares,
                    a un mismo tenor y efectos legales, en La Habana, a los {{dia}} días del mes de {{mes}} de {{ano}}.</p>
                  <br>
                  <br>
                  <div class="d-flex align-items-center justify-content-between">
                    <p>POR LA ACDAM:</p>
                    <p>POR EL PRODUCTOR:</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p>_______________________ </p>
                    <p>_______________________ </p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p>Director René Hernández Quintero </p>
                    <p></p>
                  </div>
                </div>
              </section>
              <div class="text-center">
                <button @click="PDF" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>
            <h5 v-if="currentTabIndex === 3">Tab 3</h5>
            <h5 v-if="currentTabIndex === 4">Tab 4</h5>
          </Wizard>
        </div>
        <hr>
        <!--        Listado de contratos-->
        <div class="col-lg-2" v-for="item in contratoLicEstatalAPI" :key="item.id" :value="item.id">
          <div class="card glassmorphism">
            <img src="../assets/img/img-contrato3.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <br>
              <span class="badge bg-primary">Contrato perteneciente a:{{ item.fk_utilizador }}</span>
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