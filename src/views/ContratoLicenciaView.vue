<script setup>
import axios from "axios";
import html2pdf from  'html2pdf.js'

import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import 'form-wizard-vue3/dist/form-wizard-vue3.css';
import Wizard from 'form-wizard-vue3';
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {notificaciones} from '@/util/notificacionesGlobal'
import CHOICES from '../util/choicesDeLicenciamiento'
import {GET, POST_PUT, DELETE, indiceActualizado} from '../util/peticionesServer'
import {dia, mes, ano, PDF} from '../util/functiosGlobal'

//DECLARACIONES
const router =useRouter()
const {mensaje} = notificaciones()
const indice = indiceActualizado                //VARIABLE QUE CONTROLA EL COMPORTAMIENTO DEL FORMULARIO DEPENDIENDO SI SE CREAR O SE EDITA
const utilizadorAPI = ref([])
const representanteAPI = ref([])
const proformaAPI = ref([])
const contratoEstatalAPI = ref([])
const contratoNoEstatalJuridicoAPI = ref([])
const contratoNoEstatalNaturalAPI = ref([])
const municipioAPI = ref([])
const modalidadAPI = ref([])
const objProforma = ref({
  pk:'',
  nombre:'',
  tipoProforma:'',
  resolucion:''
})
const objUtilizador = ref({
  pk:'',
  tipo:'',
  tipoNoEstatal:'',
  sector:'',
  derecho:''
})
const dataPost = ref({
  pk: '',
  fk_proforma: '',
  fk_usuario: localStorage.getItem('idUser'),
  fk_utilizador: '',
  fk_representantesAsociados: [],
  fk_municipio: '',
  resolucionUtilizador: '',
  fechaResolucionUtilizador: '',
  emisionResolucionUtilizador: '',
  resolucionFirmante: '',
  fechaResolucionFirmante: '',
  provincia: '',
  numeroLicencia: null,
  nit: null,
  codigo: null,
  direccion: '',
  estado: '',
  tiempoVigencia: '',
  fechaVencimiento: null,
  subordinacion: '',
  nombreFirmanteContrato: '',
  cargoFirmanteContrato: '',
  codigoREEUP: '',
  cuentaBancaria: null,
  titular:'',
  emitido: '',
  sucursal: '',
  tarifa: 0,
  banco: '',
  tipo: '',
  codigoOnei: '',
  cuentaCorriente: '',
  nombreComercial: '',
  provinciaComercial: '',
  fk_municipioComercial: '',
  direccionComercial: '',
  actividadComercial: '',
  representacionObrasEscenicas: false,
  comunicacionObrasAudioVisuales: false,
  local: '',
  codigoIdentificadorFiscal: '',
  folio: '',
  ci: '',
  ejecucionObrasComercial: '',
  email: '',
  telefono: null,
})
const lastContrato = ref({
  pk:'',
  titulo:'',
  descripcion:'',
  numeroLicencia:'',
  codigo:'',
})
const contratoFormato = ref('')
const indicadorAnexo = ref(0)
const dataAnexoPost = ref({
  pk:'',
  fk_contratoLicenciaEstatal:'',
  fk_contratoLicenciaPersonaJ:'',
  periocidadPago:'',
  periocidadEntrega:'',
  locacion:'',
  tarifa:'',
  categoria:'',
  numeroHabitacion:'',
  periodo:'',
  tarifaTemporadaAlta:'',
  tarifaTemporadaBaja:'',
  tarifaOcupacionInferior:'',
  importeTemporadaAlta:'',
  importeTemporadaBaja:'',
  importeTemporadaOcupacionInferior:'',
  locacionModalidad:'',
  cantidadPlazas:'',
  importe:'',
  modalidad:'',
  tipoMusica :'',
  categoriaAudiovisual:''
})
const anexo71MusicaAPI = ref([])
const anexo71AudiovisualAPI = ref([])
const anexo72CimexAPI = ref([])
const anexo72GaviotaAPI = ref([])
const anexo72TrdAPI = ref([])
const nombreUtilizador = ref()
const indiceNextButton = ref(true)

let currentTabIndex = 0                        //variable que funciona como indice del wizard

//PARA EL WIZARD
const onChangeCurrentTab = (index, oldIndex) => {
  currentTabIndex = index;
  currentTabIndex==1?indiceNextButton.value=true:''
  //OBTENCION DEL UTLTIMO CONTRATO CREADO PARA PODER RENDERIZARLO Y EXPORTARLO A PDF (PASO 3)
  if (currentTabIndex === 2 && objProforma.value.tipoProforma == 1){
    let url = `licenciamiento/contratoLicenciaEstatal/${dataPost.value.fk_usuario}/getlastContrato/`
    axios.get(url)
        .then((response) => {
          nombreUtilizador.value = response.data.utilizador
          contratoFormato.value = `<h3>${response.data.encabezado}</h3>
                                   <h3><strong>DE OTRA PARTE:</strong> La ${response.data.utilizador} creada por la ${response.data.resolucionUtilizador}, de fecha ${response.data.fechaResolucionUtilizador}, por ${response.data.emisionResolucionUtilizador}, con domicilio legal en ${response.data.direccion} municipio ${response.data.municipio}, provincia ${response.data.provincia}, con Codigo REEUP ${response.data.codigoREEUP}, NIT ${response.data.nit} y Cuenta Bancaria en CUP No.${response.data.cuentaBancaria}, Titular: ${response.data.titular}, en el Banco de Credito y Comercio ${response.data.banco}, Sucursal ${response.data.sucursal}, sita en ${response.data.direccionBanco}, que en lo adelante se denominara a los efectos de este contrato, <strong>UTILIZADOR</strong>, representado en este cargo por ${response.data.nombreFirmanteContrato}, en su condicion de ${response.data.cargoFirmanteContrato} designado en este cargo por la Resolucion No. ${response.data.resolucionFirmante}, de fecha ${response.data.fechaResolucionFirmante}, emitido por el ${response.data.emitido}</h3>
                                   <h3>${response.data.descripcion}</h3>
                                   <h3>Y como muestra de conformidad y aceptación, las partes suscriben el presente contrato, en dos (2) ejemplares, a un mismo tenor y efectos legales, en La Habana, a los ${dia} días del mes de ${mes} de ${ano}.</h3>`
          lastContrato.value.pk = response.data.id
          lastContrato.value.titulo = response.data.titulo
          lastContrato.value.numeroLicencia = response.data.numeroLicencia
          lastContrato.value.codigo = response.data.codigo
        })
        .catch((error) => {
          currentTabIndex==2?indiceNextButton.value=true:''
          mensaje('error','Error', error.response.data.error)
        })
  }
  if (currentTabIndex === 2 && objProforma.value.tipoProforma == 2) {
    currentTabIndex==1?indiceNextButton.value=true:''
    let url = `licenciamiento/contratoLicenciaPersonaJuridica/${dataPost.value.fk_usuario}/getlastContrato/`
    axios.get(url)
        .then((response) => {
          contratoFormato.value = `<h3>${response.data.encabezado}</h3>
                                   <h3><strong>DE OTRA PARTE:</strong> ${response.data.utilizador} en su condicion de ${response.data.tipo}, creada mediante ${response.data.resolucionUtilizador} de fecha ${response.data.fechaResolucionUtilizador}, con domicilio legal en ${response.data.direccion} municipio ${response.data.municipio}, provincia ${response.data.provincia}, con Codigo ONEI ${response.data.codigoOnei}, NIT ${response.data.nit} y Cuenta Corriente en CUP No.${response.data.cuentaCorriente}, en el Banco ${response.data.banco}, Sucursal ${response.data.sucursal}, representado en este acto por ${response.data.nombreFirmanteContrato}, en su caracter de ${response.data.cargoFirmanteContrato} segun consta en ${response.data.resolucionFirmante}, de fecha ${response.data.fechaResolucionFirmante}, que en lo adelante se denominara a los efectos de este contrato, <strong>UTILIZADOR</strong></h3>
                                   <h3>${response.data.descripcion}</h3>
                                   `
          if(response.data.nombreComercial != ''){
            contratoFormato.value += `<h3>Nombre comercial: ${response.data.nombreComercial}
Direccion: ${response.data.direccionComercial}
Municipio: ${response.data.fk_municipioComercial} Provincia: ${response.data.provinciaComercial}
Telefono: ${response.data.telefono} Email: ${response.data.email}
Tipo de actividad comercial: ${response.data.actividadComercial}
Ejecucion de obras musicales: ${response.data.ejecucionObrasComercial}
Representacion de obras de las artes escenicas: ${response.data.representacionObrasEscenicas}
Comunicacion al publico de obras audiovisuales: ${response.data.comunicacionObrasAudioVisuales}
                                       </h3>
                                   `
          }else{
            contratoFormato.value += `<h3>Nombre comercial: ___________________
Direccion: ___________________
Municipio: ____________________ Provincia: ___________________
Telefono: _____________________ Email: ___________________
Tipo de actividad comercial: ___________________
Ejecucion de obras musicales: ______en vivo _______graba
Representacion de obras de las artes escenicas: ______Si _______No
Comunicacion al publico de obras audiovisuales: ______Si _______No</h3>
                                   `
          }
          contratoFormato.value += `<h3>${response.data.descripcion2daParte}</h3>
                                    <h3>Tarifa ${response.data.tarifa}% de los ingresos brutos mensuales</h3>
                                    <h3>${response.data.descripcion3eraParte}</h3>
                                    <h3>Y como muestra de conformidad y aceptación, las partes suscriben el presente contrato, en dos (2) ejemplares, a un mismo tenor y efectos legales, en La Habana, a los ${dia} días del mes de ${mes} de ${ano}.</h3>

                                   `
          lastContrato.value.titulo = response.data.titulo
          lastContrato.value.numeroLicencia = response.data.numeroLicencia
          lastContrato.value.codigo = response.data.codigo
        })
        .catch((error) => {
          mensaje('error','Error', error.response.data.error)
        })
  }
  if (currentTabIndex === 2 && objProforma.value.tipoProforma == 3) {
    currentTabIndex==1?indiceNextButton.value=true:''
    let url = `licenciamiento/contratoLicenciaPersonaNatural/${dataPost.value.fk_usuario}/getlastContrato/`
    axios.get(url)
        .then((response) => {
          contratoFormato.value = `<h3>${response.data.encabezado}</h3>
                                   <h3><strong>DE OTRA PARTE:</strong> El trabajador por cuenta propia ${response.data.utilizador} con numero de identidad permanente ${response.data.ci}, con domicilio particular en ${response.data.direccion} municipio ${response.data.municipio}, provincia ${response.data.provincia}, autorizador a ejercer el trabajo por cuenta propia en la actividad ${response.data.actividadComercial}, con identificacion Fiscal Unica RC-05, con numeracion ${response.data.codigoIdentificadorFiscal}, NIT ${response.data.nit} y Cuenta Corriente en CUP No.${response.data.cuentaCorriente}, en el Banco ${response.data.banco}, Sucursal ${response.data.sucursal}, que en lo adelante se denominara a los efectos de este contrato, <strong>UTILIZADOR</strong></h3>
                                   <h3>${response.data.descripcion}</h3>
                                   `
          if(response.data.nombreComercial != ''){
            contratoFormato.value += `<h3>Nombre comercial: ${response.data.nombreComercial}
Direccion: ${response.data.direccionComercial}
Municipio: ${response.data.fk_municipioComercial} Provincia: ${response.data.provinciaComercial}
Telefono: ${response.data.telefono} Email: ${response.data.email}
Tipo de actividad comercial: ${response.data.actividadComercial}
Ejecucion de obras musicales: ${response.data.ejecucionObrasComercial}
Representacion de obras de las artes escenicas: ${response.data.representacionObrasEscenicas}
Comunicacion al publico de obras audiovisuales: ${response.data.comunicacionObrasAudioVisuales}
                                       </h3>
                                   `
          }else{
            contratoFormato.value += `<h3>Nombre comercial: ___________________
Direccion: ___________________
Municipio: ____________________ Provincia: ___________________
Telefono: _____________________ Email: ___________________
Tipo de actividad comercial: ___________________
Ejecucion de obras musicales: ______en vivo _______graba
Representacion de obras de las artes escenicas: ______Si _______No
Comunicacion al publico de obras audiovisuales: ______Si _______No</h3>
                                   `
          }
          contratoFormato.value += `<h3>${response.data.descripcion2daParte}</h3>
                                    <h3>Tarifa ${response.data.tarifa}% de los ingresos brutos mensuales</h3>
                                    <h3>${response.data.descripcion3eraParte}</h3>
                                    <h3>Y como muestra de conformidad y aceptación, las partes suscriben el presente contrato, en dos (2) ejemplares, a un mismo tenor y efectos legales, en La Habana, a los ${dia} días del mes de ${mes} de ${ano}.</h3>

                                   `
          lastContrato.value.titulo = response.data.titulo
          lastContrato.value.numeroLicencia = response.data.numeroLicencia
          lastContrato.value.codigo = response.data.codigo
        })
        .catch((error) => {
          mensaje('error','Error', error.response.data.error)
        })
  }
  if (currentTabIndex === 2 && objProforma.value.tipoProforma == 4) {
    currentTabIndex==1?indiceNextButton.value=true:''
    let url = `licenciamiento/contratoLicenciaPersonaNatural/${dataPost.value.fk_usuario}/getlastContrato/`
    axios.get(url)
        .then((response) => {
          contratoFormato.value = `<h3>${response.data.encabezado}</h3>
                                   <h3><strong>DE OTRA PARTE:</strong> El trabajador por cuenta propia ${response.data.utilizador} con numero de identidad permanente ${response.data.ci}, con domicilio particular en ${response.data.direccion} municipio ${response.data.municipio}, provincia ${response.data.provincia}, autorizador a ejercer el trabajo por cuenta propia en la actividad ${response.data.actividadComercial}, con identificacion Fiscal Unica RC-05, con numeracion ${response.data.codigoIdentificadorFiscal}, NIT ${response.data.nit} y Cuenta Corriente en CUP No.${response.data.cuentaCorriente}, en el Banco ${response.data.banco}, Sucursal ${response.data.sucursal}, que en lo adelante se denominara a los efectos de este contrato, <strong>UTILIZADOR</strong></h3>
                                   <h3>${response.data.descripcion} ${response.data.actividadComercial} ${response.data.descripcion2daParte}</h3>
                                   `
          if(response.data.local != ''){
            contratoFormato.value += `<h3>Local donde se ejerce la actividad: ${response.data.local}
Direccion: ${response.data.direccionComercial}
Municipio: ${response.data.fk_municipioComercial} Provincia: ${response.data.provinciaComercial}
Telefono: ${response.data.telefono} Email: ${response.data.email}
                                       </h3>
                                   `
          }else{
            contratoFormato.value += `<h3>Local donde se ejerce la actividad: ___________________
Direccion: ___________________
Municipio: ____________________ Provincia: ___________________
Telefono: _____________________ Email: ___________________</h3>
                                   `
          }
          contratoFormato.value += `<h3>${response.data.descripcion3eraParte}</h3>
                                    <h3>Y como muestra de conformidad y aceptación, las partes suscriben el presente contrato, en dos (2) ejemplares, a un mismo tenor y efectos legales, en La Habana, a los ${dia} días del mes de ${mes} de ${ano}.</h3>

                                   `
          lastContrato.value.titulo = response.data.titulo
          lastContrato.value.numeroLicencia = response.data.numeroLicencia
          lastContrato.value.codigo = response.data.codigo
        })
        .catch((error) => {
          mensaje('error','Error', error.response.data.error)
        })
  }

  // Asignar el id del ultimo contrato a su respectivo campo en el formulario del anexo, independientemente de
  // cual anexo sea
  if (currentTabIndex === 3 && objProforma.value.tipoProforma == 1){
    currentTabIndex==1?indiceNextButton.value=true:''
    dataAnexoPost.value.fk_contratoLicenciaEstatal = lastContrato.value.pk
  }
}
const onTabBeforeChange = () => {
  if (currentTabIndex === 0) {
    alert('First Tab')
  }
  alert('All Tabs')
}
const wizardCompleted = () => {
  mensaje('success','Exito', 'Proceso de generacion de contrato de licencia concluido correctamente.')
  router.push('/home')
}

//FUNCION PAR ALA OBTENCION DEL UTILIZADOR SELECCIONADO EN EL PASO 1 DEL WIZARD Y LAS PROFORMAS CORRESPONDIENTES A ESE UTILIZADOR
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

//FUNCION PARA OBTENER EL ID DE LA PROFORMA SELECCIONADA Y TRAERLA DE DESDE EL BACKEND
const getProforma = (event) => {
  let id = event.target.value
  let url = `licenciamiento/proforma/${id}/`
  axios.get(url)
      .then((response) => {
        objProforma.value.tipoProforma = response.data.data.tipo
        objProforma.value.nombre = response.data.data.nombre
        objProforma.value.resolucion = response.data.data.resolucion
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
  dataPost.value.fk_proforma = id
  dataPost.value.fk_utilizador = objUtilizador.value.pk
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

//FUNCION PARA RENDERIZAR EL FORMULARIO DE ANEXO SEGUN EL ANEXO SELECCIONADO
const agingarValorIndicadorAnexo = (event) => indicadorAnexo.value = event.target.value

// FUNCIONES PARA ACTUALIZAR EL LISTADO DE LOS ANEXO QUE SE VAN CREANDO
const actualizarAnexos71Musica = () => GET('licenciamiento/anexo71Musica/', anexo71MusicaAPI)
const actualizarAnexos71Audiovisual = () => GET('licenciamiento/anexo71Audiovisual/', anexo71AudiovisualAPI)
const actualizarAnexos72Cimex = () => GET('licenciamiento/anexo72Cimex/', anexo72CimexAPI)
const actualizarAnexos72Gaviota = () => GET('licenciamiento/anexo72Gaviota/', anexo72GaviotaAPI)
const actualizarAnexos72Trd = () => GET('licenciamiento/anexo72Trd/', anexo72TrdAPI)

// FUNCION PARA REASIGNAR EL ID AL CAMPO CONTRATO DEL ANEXO
const asignarIdAlCampoContratoDelAnexo = () => {
  let contratoAnexo71Musica = document.getElementById('contratoAnexo71Musica')
  let contratoAnexo71Audiovisual = document.getElementById('contratoAnexo71Audiovisual')
  let contratoAnexo72Cimex = document.getElementById('contratoAnexo72Cimex')
  let contratoAnexo72Gaviota = document.getElementById('contratoAnexo72Gaviota')
  let contratoAnexo72Trd = document.getElementById('contratoAnexo72Trd')
  contratoAnexo71Musica.value!=null?contratoAnexo71Musica.value = dataAnexoPost.value.fk_contratoLicenciaEstatal:''
  contratoAnexo71Audiovisual.value!=null?contratoAnexo71Audiovisual.value = dataAnexoPost.value.fk_contratoLicenciaEstatal:''
  contratoAnexo72Cimex.value!=null?contratoAnexo72Cimex.value = dataAnexoPost.value.fk_contratoLicenciaEstatal:''
  contratoAnexo72Trd.value!=null?contratoAnexo72Trd.value = dataAnexoPost.value.fk_contratoLicenciaEstatal:''
  contratoAnexo71Musica.value!=null?contratoAnexo71Musica.value = dataAnexoPost.value.fk_contratoLicenciaEstatal:''
  // contratoAnexo71Audiovisual.value = dataAnexoPost.value.fk_contratoLicenciaEstatal
  // contratoAnexo72Cimex.value = dataAnexoPost.value.fk_contratoLicenciaEstatal
  // contratoAnexo72Gaviota.value = dataAnexoPost.value.fk_contratoLicenciaEstatal
  // contratoAnexo72Trd.value = dataAnexoPost.value.fk_contratoLicenciaEstatal
}

//FUNCION QUE BUSCA EL ANEXO A EDITAR Y PINTAR SUS DATOS EN EL FORMULARIO PARA SU POSTERIOR EDICION
const editarAnexo = async (url, index) => {
  indice.value = index
  axios.get(url)
      .then((response) => {
        dataAnexoPost.value.pk = response.data.data.id
        dataAnexoPost.value.fk_contratoLicenciaEstatal = response.data.data.fk_contratoLicenciaEstatal
        dataAnexoPost.value.fk_contratoLicenciaPersonaJ = response.data.data.fk_contratoLicenciaPersonaJ
        dataAnexoPost.value.locacion = response.data.data.locacion
        dataAnexoPost.value.locacionModalidad = response.data.data.locacionModalidad
        dataAnexoPost.value.tarifa = response.data.data.tarifa
        dataAnexoPost.value.periocidadPago = response.data.data.periocidadPago
        dataAnexoPost.value.tipoMusica = response.data.data.tipoMusica
        dataAnexoPost.value.modalidad = response.data.data.modalidad
        dataAnexoPost.value.periocidadEntrega = response.data.data.periocidadEntrega
        dataAnexoPost.value.categoriaAudiovisual = response.data.data.categoriaAudiovisual
        dataAnexoPost.value.cantidadPlazas = response.data.data.cantidadPlazas
        dataAnexoPost.value.importe = response.data.data.importe
        dataAnexoPost.value.categoria = response.data.data.categoria
        dataAnexoPost.value.numeroHabitacion = response.data.data.numeroHabitacion
        dataAnexoPost.value.periodo = response.data.data.periodo
        dataAnexoPost.value.tarifaTemporadaAlta = response.data.data.tarifaTemporadaAlta
        dataAnexoPost.value.tarifaTemporadaBaja = response.data.data.tarifaTemporadaBaja
        dataAnexoPost.value.tarifaOcupacionInferior = response.data.data.tarifaOcupacionInferior
        dataAnexoPost.value.importeTemporadaAlta = response.data.data.importeTemporadaAlta
        dataAnexoPost.value.importeTemporadaBaja = response.data.data.importeTemporadaBaja
        dataAnexoPost.value.importeTemporadaOcupacionInferior = response.data.data.importeTemporadaOcupacionInferior
      })
      .catch((error) => {
        mensaje('error','Error', error.response.data.error)
      })
}

// FUNCION PARA ACTUALIZAR LOS LISTADOS DE LOS CONTRATOS
const actualizarContratosEstatales = () => GET("licenciamiento/contratoLicenciaEstatal/", contratoEstatalAPI)
const actualizarContratosNoEstatalesJuridicos = () => GET("licenciamiento/contratoLicenciaPersonaJuridica/", contratoNoEstatalJuridicoAPI)
const actualizarContratosNoEstatalesNaturales = () => GET("licenciamiento/contratoLicenciaPersonaNatural/", contratoNoEstatalNaturalAPI)

// FUNCION PARA HABILITAR EL BOTON SIGUIENTE EN EL WIZARD UNA VEZ SALVADO EL FORMULARIO DEL CONTRATO
const habilitarNextButton = () => indiceNextButton.value = false

onMounted(() => {
  GET("licenciamiento/utilizador/", utilizadorAPI)
  GET("licenciamiento/representante/", representanteAPI)
  GET("licenciamiento/contratoLicenciaEstatal/", contratoEstatalAPI)
  GET("licenciamiento/contratoLicenciaPersonaJuridica/", contratoNoEstatalJuridicoAPI)
  GET("licenciamiento/contratoLicenciaPersonaNatural/", contratoNoEstatalNaturalAPI)
  GET("licenciamiento/modalidad/", modalidadAPI)
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
        <!--        COMPONENTE WIZARD-->
        <div class="col-lg-12">
          <Wizard
              squared-tabs
              card-background
              scrollable-tabs
              :nextButton="{text: 'Siguiente',
                                icon: 'arrow-right',
                                hideText: false,
                                hideIcon: false,
                                disabled: indiceNextButton}"
              :backButton="{text: 'Anterior',
                                icon: 'arrow-left',
                                hideText: false,
                                hideIcon: false,
                                disabled: false}"
              :doneButton="{text:'Finalizar'}"
              :custom-tabs="[
                                  {
                                    title: 'Seleccion de utilizador y proforma',
                                  },
                                  {
                                    title: 'Datos del contrato',
                                  },
                                  {
                                    title: 'Formatear y Exportar',
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
            <!--            PROCESO PARA EL PASO 1-->
            <div class="row" v-if="currentTabIndex === 0">
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getUtilizador($event)">
                    <option  value="">----------</option>
                    <option v-for="item in utilizadorAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <label for="floatingSelect"><span class="text-danger">* </span>Utilizadores</label>
                </div>
                <div v-if="objUtilizador.tipo=='Estatal'" class="alert glassmorphism border-secondary alert-dismissible fade show" role="alert">
                  <h5><i class="bi bi-person-bounding-box"></i><strong> Datos del utilizador:</strong></h5>
                  <hr>
                  <p>Tipo: Estatal</p>
                  <p>Sector: {{ objUtilizador.sector }}</p>
                  <p>Derecho: {{ objUtilizador.derecho }}</p>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <div v-if="objUtilizador.tipo=='No estatal'" class="alert glassmorphism border-secondary alert-dismissible fade show" role="alert">
                  <h5><i class="bi bi-person-bounding-box"></i><strong> Datos del utilizador:</strong></h5>
                  <hr>
                  <p>Tipo: No estatal ({{ objUtilizador.tipoNoEstatal }}) </p>
                  <p>Sector: {{ objUtilizador.sector }}</p>
                  <p>Derecho: {{ objUtilizador.derecho }}</p>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating mb-3">
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getProforma($event); habilitarNextButton() ">
                    <option  value="">----------</option>
                    <option v-for="item in proformaAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <label for="floatingSelect"><span class="text-danger">* </span>Proformas</label>
                </div>
              </div>
            </div>

            <!--            PROCESO PARA EL PASO 2-->
            <!--            FORMULARIO PARA SI ES ESTATAL-->
            <p class="text-center"><span v-if="currentTabIndex === 1 && objProforma.tipoProforma == 1"
                  class="text-uppercase badge rounded-pill bg-light text-dark" style="font-size: 15px; margin-bottom: 10px">
              Contrato estatal</span></p>
            <div v-if="currentTabIndex === 1 && objProforma.tipoProforma == 1">
              <form class="row">
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.numeroLicencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Numero de Licencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Codigo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.resolucionUtilizador"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Resolucion utilizador</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control" v-model="dataPost.fechaResolucionUtilizador"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Fecha de la resolucion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.emisionResolucionUtilizador"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Resolucion emitida por</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.subordinacion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Subordinacion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Direcion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getMunicipios" v-model="dataPost.provincia">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Provincia</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_municipio">
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Municipio</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.codigoREEUP"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Codigo REEUP</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.nit"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>NIT</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.cuentaBancaria"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Cuenta Bancaria</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.titular"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Titular de cuenta</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.banco"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Banco</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.sucursal"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Sucursal</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccionBanco"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion del banco</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombreFirmanteContrato"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Nombre y Apellidos del Firmante</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.cargoFirmanteContrato"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Cargo del firmante</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.resolucionFirmante"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Resolucion firmante</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control" v-model="dataPost.fechaResolucionFirmante"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Fecha de la resolucion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.emitido"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Emitido por</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.estado">
                      <option v-for="item in CHOICES[5].ESTADO" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect"><span class="text-danger">* </span>Estado</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.tiempoVigencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName"><span class="text-danger">* </span>Tiempo Vigencia</label></div>
                </div>
                <div class="col-md-4">
                  <label for="inputState" class="form-label" style="margin-left: 15px">Asociados</label>
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.fk_representantesAsociados" multiple>
                    <option v-for="item in representanteAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" hidden class="styleInput form-control" v-model="dataPost.fechaVencimiento"
                                                    id="floatingName"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_proforma"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_utilizador"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" hidden class="styleInput form-control" v-model="dataPost.fk_usuario"
                                                    id="floatingName"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/contratoLicenciaEstatal/', dataPost, -1); habilitarNextButton()"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> Salvar</button>
                </div>
              </form>
            </div>

            <!--            FORMULARIO SI ES NO ESTATAL JURIDICO-->
            <p class="text-center"><span v-if="currentTabIndex === 1 && objProforma.tipoProforma == 2"
                  class="text-uppercase badge rounded-pill bg-light text-dark" style="font-size: 15px; margin-bottom: 10px">
              Contrato no estatal juridico</span></p>
            <div v-if="currentTabIndex === 1 && objProforma.tipoProforma == 2">
              <form class="row">
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.numeroLicencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Numero de Licencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo</label></div>
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
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.resolucionUtilizador"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Creada mediante</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control" v-model="dataPost.fechaResolucionUtilizador"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Fecha correspondiente a la creacion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion</label></div>
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
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.codigoOnei"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo Onei</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.nit"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">NIT</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.cuentaCorriente"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Cuenta corriente</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.banco"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Banco</label></div>
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
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.resolucionFirmante"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Segun consta:</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="date" class="styleInput form-control" v-model="dataPost.fechaResolucionFirmante"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Fecha de la resolucion</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.tarifa"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Tarifa (%)</label>
                  </div>
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
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombreComercial"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre Comercial</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccionComercial"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion Comercial</label></div>
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
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.telefono"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Telefono</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="email" class="styleInput form-control" v-model="dataPost.email"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Correo</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.actividadComercial">
                      <option v-for="item in modalidadAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Actividad Comercial</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.ejecucionObrasComercial">
                      <option v-for="item in CHOICES[11].TIPO_OBRA_COMERCIAL" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Ejecucion de obras musicales</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="inputState" class="form-label" style="margin-left: 15px">Asociados</label>
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.fk_representantesAsociados" multiple>
                    <option v-for="item in representanteAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <br>
                </div>
                <hr>
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
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_proforma"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_utilizador"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" hidden class="styleInput form-control" v-model="dataPost.fk_usuario"
                                                    id="floatingName"
                                                    placeholder="Nombre"></div>
                </div>

                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/contratoLicenciaPersonaJuridica/', dataPost, -1); habilitarNextButton()"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> Salvar</button>
                </div>
              </form>
            </div>

            <!--            FORMULARIO SI ES NO ESTATAL NATURAL (CONTRATO EJECUCION PUBLICA)-->
            <p class="text-center"><span v-if="currentTabIndex === 1 && objProforma.tipoProforma == 3"
                                         class="text-uppercase badge rounded-pill bg-light text-dark" style="font-size: 15px; margin-bottom: 10px">
              Contrato no estatal natural (Contrato Ejecucion Publica)</span></p>
            <div v-if="currentTabIndex === 1 && objProforma.tipoProforma == 3">
              <form class="row">
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.numeroLicencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Numero de Licencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.ci"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Carnet Identidad</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion</label></div>
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
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.actividadComercial">
                      <option v-for="item in modalidadAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Actividad a ejercer</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigoIdentificadorFiscal"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Identificacion Fiscal</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.folio"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Folio</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.nit"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">NIT</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.cuentaCorriente"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Cuenta corriente</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.banco"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Banco</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.sucursal"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Sucursal</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.tarifa"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Tarifa (%)</label>
                  </div>
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
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.nombreComercial"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Nombre Comercial</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccionComercial"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion Comercial</label></div>
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
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.telefono"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Telefono</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="email" class="styleInput form-control" v-model="dataPost.email"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Correo</label></div>
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
                <div class="col-md-4">
                  <label for="inputState" class="form-label" style="margin-left: 15px">Asociados</label>
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.fk_representantesAsociados" multiple>
                    <option v-for="item in representanteAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <br>
                </div>
                <hr>
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
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_proforma"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_utilizador"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" hidden class="styleInput form-control" v-model="dataPost.fk_usuario"
                                                    id="floatingName"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/contratoLicenciaPersonaNatural/', dataPost, -1); habilitarNextButton()"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> Salvar</button>
                </div>
              </form>
            </div>

            <!--            FORMULARIO SI ES NO ESTATAL NATURAL (CONTRATO COMPRADOR VENDEDOR)-->
            <p class="text-center"><span v-if="currentTabIndex === 1 && objProforma.tipoProforma == 4"
                                         class="text-uppercase badge rounded-pill bg-light text-dark" style="font-size: 15px; margin-bottom: 10px">
              Contrato no estatal natural (Contrato Comprador-Vendedor)</span></p>
            <div v-if="currentTabIndex === 1 && objProforma.tipoProforma == 4">
              <form class="row">
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.numeroLicencia"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Numero de Licencia</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigo"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Codigo</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.ci"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Carnet Identidad</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccion"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion</label></div>
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
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.actividadComercial">
                      <option v-for="item in modalidadAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Actividad a ejercer</label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.codigoIdentificadorFiscal"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Identificacion Fiscal</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.folio"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Folio</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.nit"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">NIT</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.cuentaCorriente"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Cuenta corriente</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.banco"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Banco</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.sucursal"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Sucursal</label></div>
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
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.local"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Local</label></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataPost.direccionComercial"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Direccion Comercial</label></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="getMunicipios" v-model="dataPost.provinciaComercial">
                      <option v-for="item in CHOICES[7].PROVINCIA" :key="item.value" :value="item.value">{{ item.descripcion }}
                      </option>
                    </select>
                    <label for="floatingSelect">Provincia Comercial</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating mb-3">
                    <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataPost.fk_municipioComercial">
                      <option v-for="item in municipioAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                      </option>
                    </select>
                    <label for="floatingSelect">Municipio Comercial</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataPost.telefono"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Telefono</label><br></div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating"><input type="email" class="styleInput form-control" v-model="dataPost.email"
                                                    id="floatingName"
                                                    placeholder="Nombre"> <label for="floatingName">Correo</label></div>
                </div>
                <div class="col-md-4">
                  <label for="inputState" class="form-label" style="margin-left: 15px">Asociados</label>
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo"  v-model="dataPost.fk_representantesAsociados" multiple>
                    <option v-for="item in representanteAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                    </option>
                  </select>
                  <br>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_proforma"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" class="styleInput form-control"  readonly hidden
                                                    id="floatingName" v-model="dataPost.fk_utilizador"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating"><input type="number" hidden class="styleInput form-control" v-model="dataPost.fk_usuario"
                                                    id="floatingName"
                                                    placeholder="Nombre"></div>
                </div>
                <div class="text-center">
                  <button @click="POST_PUT('licenciamiento/contratoLicenciaPersonaNatural/', dataPost, -1); habilitarNextButton()"  class="miBtn btn btn-outline-light" type="button">
                    <i class="bi bi-arrow-bar-right"></i> Salvar</button>
                </div>
              </form>
            </div>

            <!--            PROCESO PARA EL PASO 3-->
            <div v-if="currentTabIndex === 2" >
              <section :id="lastContrato.titulo">
<!--                PDF A GENRAR SI ES ESTATAL-->
                <div v-if="objProforma.tipoProforma == 1">
                  <div class="d-flex align-items-center justify-content-between">
                    <h5 class="text-center" ><strong>{{lastContrato.titulo}}</strong></h5>
                    <img src="../assets/img/acdamlogo.jpg">
                  </div>
                  <br>
                  <div class="d-flex align-items-center justify-content-between">
                    <p></p>
                    <p>Licencia No. {{lastContrato.numeroLicencia}}  de {{ ano }}, ACDAM</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <p></p>
                    <p>Código de Utilizador No. {{lastContrato.codigo}}</p>
                  </div>
                  <br>
                  <p>
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="contratoFormato" content-type="html" >
                    </QuillEditor>
                  </p>
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
<!--                PDF A GENERAR SI ES NO ESTATAL JURIDICO-->
                <div v-if="objProforma.tipoProforma == 2">
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
                  <p>
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="contratoFormato" content-type="html" >
                    </QuillEditor>
                  </p>
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
<!--                PDF A GENERAR SI ES NO ESTATAL NATURAL (CONTRATO EJECUCION OBRAS PUBLICA)-->
                <div v-if="objProforma.tipoProforma == 3">
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
                  <p>
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="contratoFormato" content-type="html" >
                    </QuillEditor>
                  </p>
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
<!--                PDF A GENERAR SI ES NO ESTATAL NATURAL (CONTRATO COMPRADOR VENDEDOR)-->
                <div v-if="objProforma.tipoProforma == 4">
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
                  <p>
                    <QuillEditor theme="bubble" toolbar="essential" v-model:content="contratoFormato" content-type="html" >
                    </QuillEditor>
                  </p>
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
                <button @click="PDF(`${lastContrato.titulo}`)" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>

<!--            PROCESO PARA EL PASO 4-->
            <div v-if="currentTabIndex === 3">
              <h3>Proforma seleccionada: {{objProforma.nombre}}</h3>
              <div class="col-md-6" v-if="objProforma.tipoProforma==1 && objProforma.resolucion==71">
                <div class="form-floating mb-3">
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" @change="agingarValorIndicadorAnexo">
                    <option value="">-----------</option>
                    <option v-for="item in CHOICES[12].ANEXOS_71" :key="item.value" :value="item.value">{{ item.descripcion }}
                    </option>
                  </select>
                  <label for="floatingSelect">Anexos disponibles para la Resolucion 71</label>
                </div>
              </div>
              <div class="col-md-6" v-else-if="objProforma.tipoProforma==1 && objProforma.resolucion==72" @change="agingarValorIndicadorAnexo">
                <div class="form-floating mb-3">
                  <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo">
                    <option value="">-----------</option>
                    <option v-for="item in CHOICES[13].ANEXOS_72" :key="item.value" :value="item.value">{{ item.descripcion }}
                    </option>
                  </select>
                  <label for="floatingSelect">Anexos disponibles para la Resolucion 72</label>
                </div>
              </div>
              <div class="col-md-6" v-else>
                <h5>No le corresponde anexo a esta proforma</h5>
              </div>
<!--              RENDERIZADO DEL ANEXO 71 MUSICA-->
              <div v-if="indicadorAnexo==1">
                <h4>Anexo Musica</h4>
                <form class="row g-3">
                  <div class="col-md-6">
                    <div class="form-floating"><input type="text" @click="asignarIdAlCampoContratoDelAnexo"  class="styleInput form-control" v-model="dataAnexoPost.locacion"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Locacion</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.modalidad">
                        <option v-for="item in modalidadAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                        </option>
                      </select>
                      <label for="floatingSelect">Modalidad</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.tipoMusica">
                        <option v-for="item in CHOICES[11].TIPO_OBRA_COMERCIAL" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Tipo de Musica</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.tarifa"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Tarifa</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadPago">
                        <option v-for="item in CHOICES[8].PERIOCIDAD_PAGO" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de pago</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadEntrega">
                        <option v-for="item in CHOICES[9].PERIOCIDAD_ENTREGA" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de entrega</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control"  hidden readonly id="contratoAnexo71Musica"
                                                       v-model="dataAnexoPost.fk_contratoLicenciaEstatal"
                                                      placeholder="Nombre"> <label for="floatingName">Estatal</label></div>
                  </div>
                  <div v-if="objProforma.tipoProforma!=1" class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" readonly
                                                      id="floatingName" v-model="dataAnexoPost.fk_contratoLicenciaPersonaJ"
                                                      placeholder="Nombre"> <label for="floatingName">Juridico</label></div>
                  </div >
                  <div class="text-center">
                    <button @click="POST_PUT('licenciamiento/anexo71Musica/', dataAnexoPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                      <i class="bi bi-arrow-bar-right"></i> Salvar </button>
                    <button type="reset" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
                  </div>
                </form>
                <hr>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                    <tr>
                      <th scope="col">Acciones</th>
                      <th scope="col">Locacion</th>
                      <th scope="col">Modalidad</th>
                      <th scope="col">Tipo de musica</th>
                      <th scope="col">Tarifa</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo71MusicaAPI" :key="item.id">
                      <td>
                        <span class="sombra badge bg-primary"  title="Modificar" @click="editarAnexo(`licenciamiento/anexo71Musica/${item.id}/`, index)"><i
                            class="bi bi-pencil"></i></span>
                      </td>
                      <td>{{ item.locacion }}</td>
                      <td>{{ item.modalidad }}</td>
                      <td>{{ item.tipoMusica }}</td>
                      <td>{{ item.tarifa }}</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center">
                  <button class="miBtn btn btn-outline-light" type="button" @click="actualizarAnexos71Musica"><i class="bi bi-arrow-repeat"></i> Actualizar </button>
                </div>
              </div>

<!--              RENDERIZADO DEL ANEXO 71 AUDIOVISUAL-->
              <div v-if="indicadorAnexo==2">
                <h4>Anexo AudioVisual</h4>
                <form class="row g-3">
                  <div class="col-md-6">
                    <div class="form-floating"><input type="text" @click="asignarIdAlCampoContratoDelAnexo" class="styleInput form-control" v-model="dataAnexoPost.locacion"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Locacion</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.categoriaAudiovisual">
                        <option v-for="item in CHOICES[14].TIPO_CATEGORIA_AUDIOVISUAL" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Tipo de Categoria</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.tarifa"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Tarifa</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadPago">
                        <option v-for="item in CHOICES[8].PERIOCIDAD_PAGO" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de pago</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadEntrega">
                        <option v-for="item in CHOICES[9].PERIOCIDAD_ENTREGA" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de entrega</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control"
                                                      hidden readonly id="contratoAnexo71Audiovisual"
                                                      v-model="dataAnexoPost.fk_contratoLicenciaEstatal"
                                                      placeholder="Nombre"></div>
                  </div>
                  <div v-if="objProforma.tipoProforma!=1" class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" readonly
                                                      id="floatingName" v-model="dataAnexoPost.fk_contratoLicenciaPersonaJ"
                                                      placeholder="Nombre"> <label for="floatingName">Juridico</label></div>
                  </div >
                  <div class="text-center">
                    <button @click="POST_PUT('licenciamiento/anexo71Audiovisual/', dataAnexoPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                      <i class="bi bi-arrow-bar-right"></i> Salvar </button>
                    <button type="reset" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
                  </div>
                </form>
                <hr>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                    <tr>
                      <th scope="col">Acciones</th>
                      <th scope="col">Locacion</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Tarifa</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo71AudiovisualAPI" :key="item.id">
                      <td>
                        <span class="sombra badge bg-primary"  title="Modificar" @click="editarAnexo(`licenciamiento/anexo71Audiovisual/${item.id}/`, index)"><i
                            class="bi bi-pencil"></i></span>
                      </td>
                      <td>{{ item.locacion }}</td>
                      <td>{{ item.categoriaAudiovisual }}</td>
                      <td>{{ item.tarifa }}</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center">
                  <button class="miBtn btn btn-outline-light" type="button" @click="actualizarAnexos71Audiovisual"><i class="bi bi-arrow-repeat"></i> Actualizar </button>
                </div>
              </div>

<!--              RENDERIZADO DEL ANEXO 72 CIMEX-->
              <div v-if="indicadorAnexo==4">
                <h4>Anexo CIMEX</h4>
                <form class="row g-3">
                  <div class="col-md-6">
                    <div class="form-floating"><input type="text" @click="asignarIdAlCampoContratoDelAnexo" class="styleInput form-control" v-model="dataAnexoPost.locacionModalidad"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Locacion/Modalidad</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.cantidadPlazas"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Cantidad de Plazas</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.tarifa"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Tarifa</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.importe"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Importe</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadPago">
                        <option v-for="item in CHOICES[8].PERIOCIDAD_PAGO" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de pago</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadEntrega">
                        <option v-for="item in CHOICES[9].PERIOCIDAD_ENTREGA" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de entrega</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control"
                                                      hidden readonly id="contratoAnexo72Cimex"
                                                      v-model="dataAnexoPost.fk_contratoLicenciaEstatal"
                                                      placeholder="Nombre"></div>
                  </div>
                  <div class="text-center">
                    <button @click="POST_PUT('licenciamiento/anexo72Cimex/', dataAnexoPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                      <i class="bi bi-arrow-bar-right"></i> Salvar </button>
                    <button type="reset" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
                  </div>
                </form>
                <hr>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                    <tr>
                      <th scope="col">Acciones</th>
                      <th scope="col">Locacion/Modalidad</th>
                      <th scope="col">Cantidad de plazas</th>
                      <th scope="col">Tarifa</th>
                      <th scope="col">Importe</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo72CimexAPI" :key="item.id">
                      <td>
                        <span class="sombra badge bg-primary"  title="Modificar" @click="editarAnexo(`licenciamiento/anexo72Cimex/${item.id}/`, index)"><i
                            class="bi bi-pencil"></i></span>
                      </td>
                      <td>{{ item.locacionModalidad }}</td>
                      <td>{{ item.cantidadPlazas }}</td>
                      <td>{{ item.tarifa }}</td>
                      <td>{{ item.importe }}</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center">
                  <button class="miBtn btn btn-outline-light" type="button" @click="actualizarAnexos72Cimex"><i class="bi bi-arrow-repeat"></i> Actualizar </button>
                </div>
              </div>

<!--              RENDERIZADO DEL ANEXO 72 GAVIOTA-->
              <div v-if="indicadorAnexo==5">
                <h4>Anexo Gaviota</h4>
                <form class="row g-3">
                  <div class="col-md-4">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.categoria" @click="asignarIdAlCampoContratoDelAnexo">
                        <option value="">-----------</option>
                        <option v-for="item in CHOICES[14].TIPO_CATEGORIA_HOTELES" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Categoria</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.numeroHabitacion"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Numero de Habitaciones</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="text" class="styleInput form-control" v-model="dataAnexoPost.periodo"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Periodo</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.tarifaTemporadaAlta"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Tarifa Temp. Alta</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.tarifaTemporadaBaja"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Tarifa Temp. Baja</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.tarifaOcupacionInferior"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Tarifa Ocupacion inferior del 30%</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.importeTemporadaAlta"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Importe Temp. Alta</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.importeTemporadaBaja"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Importe Temp. Baja</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.importeTemporadaOcupacionInferior"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Importe Ocupacion inferior del 30%</label></div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadPago">
                        <option v-for="item in CHOICES[8].PERIOCIDAD_PAGO" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de pago</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadEntrega">
                        <option v-for="item in CHOICES[9].PERIOCIDAD_ENTREGA" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de entrega</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control"
                                                      hidden readonly id="contratoAnexo72Gaviota"
                                                      v-model="dataAnexoPost.fk_contratoLicenciaEstatal"
                                                      placeholder="Nombre"></div>
                  </div>
                  <div class="text-center">
                    <button @click="POST_PUT('licenciamiento/anexo72Gaviota/', dataAnexoPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                      <i class="bi bi-arrow-bar-right"></i> Salvar </button>
                    <button type="reset" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
                  </div>
                </form>
                <hr>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                    <tr>
                      <th scope="col">Acciones</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">No. Habitaciones</th>
                      <th scope="col">Periodo</th>
                      <th scope="col">Tarifa Temp. Alta</th>
                      <th scope="col">Tarifa temp. Baja</th>
                      <th scope="col">Tarifa ocupacion inferior al 30%</th>
                      <th scope="col">Importe Temp. Alta</th>
                      <th scope="col">Importe temp. Baja</th>
                      <th scope="col">Importe ocupacion inferior al 30%</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo72GaviotaAPI" :key="item.id">
                      <td>
                        <span class="sombra badge bg-primary"  title="Modificar" @click="editarAnexo(`licenciamiento/anexo72Gaviota/${item.id}/`, index)"><i
                            class="bi bi-pencil"></i></span>
                      </td>
                      <td>{{ item.categoria }}</td>
                      <td>{{ item.numeroHabitacion }}</td>
                      <td>{{ item.periodo }}</td>
                      <td>{{ item.tarifaTemporadaAlta }}</td>
                      <td>{{ item.tarifaTemporadaBaja }}</td>
                      <td>{{ item.tarifaOcupacionInferior }}</td>
                      <td>{{ item.importeTemporadaAlta }}</td>
                      <td>{{ item.importeTemporadaBaja }}</td>
                      <td>{{ item.importeTemporadaOcupacionInferior }}</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center">
                  <button class="miBtn btn btn-outline-light" type="button" @click="actualizarAnexos72Gaviota"><i class="bi bi-arrow-repeat"></i> Actualizar </button>
                </div>
              </div>

<!--              RENDERIZADO DEL ANEXO 72 TRD-->
              <div v-if="indicadorAnexo==6">
                <h4>Anexo TRD</h4>
                <form class="row g-3">
                  <div class="col-md-6">
                    <div class="form-floating"><input type="text" @click="asignarIdAlCampoContratoDelAnexo" class="styleInput form-control" v-model="dataAnexoPost.locacion"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Locacion</label></div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.modalidad">
                        <option v-for="item in modalidadAPI" :key="item.id" :value="item.id">{{ item.nombre }}
                        </option>
                      </select>
                      <label for="floatingSelect">Modalidad</label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.tarifa"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Tarifa</label></div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-floating"><input type="number" class="styleInput form-control" v-model="dataAnexoPost.importe"
                                                      id="floatingName"
                                                      placeholder="Nombre"> <label for="floatingName">Importe</label></div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadPago">
                        <option v-for="item in CHOICES[8].PERIOCIDAD_PAGO" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de pago</label>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-floating mb-3">
                      <select class="styleInput form-select" id="floatingSelect" aria-label="Cargo" v-model="dataAnexoPost.periocidadEntrega">
                        <option v-for="item in CHOICES[9].PERIOCIDAD_ENTREGA" :key="item.value" :value="item.value">{{ item.descripcion }}
                        </option>
                      </select>
                      <label for="floatingSelect">Periocidad de entrega</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-floating"><input type="number" class="styleInput form-control"
                                                      hidden readonly id="contratoAnexo72Trd"
                                                      v-model="dataAnexoPost.fk_contratoLicenciaEstatal"
                                                      placeholder="Nombre"></div>
                  </div>
                  <div class="text-center">
                    <button @click="POST_PUT('licenciamiento/anexo72Trd/', dataAnexoPost, indice)"  class="miBtn btn btn-outline-light" type="button">
                      <i class="bi bi-arrow-bar-right"></i> Salvar </button>
                    <button type="reset" class="miBtn btn btn-outline-dark m-lg-1"><i class="bx bx-eraser"></i> Resetear</button>
                  </div>
                </form>
                <hr>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                    <tr>
                      <th scope="col">Acciones</th>
                      <th scope="col">Locacion</th>
                      <th scope="col">Modalidad</th>
                      <th scope="col">Tarifa</th>
                      <th scope="col">Importe</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo72TrdAPI" :key="item.id">
                      <td>
                        <span class="sombra badge bg-primary"  title="Modificar" @click="editarAnexo(`licenciamiento/anexo72Trd/${item.id}/`, index)"><i
                            class="bi bi-pencil"></i></span>
                      </td>
                      <td>{{ item.locacion }}</td>
                      <td>{{ item.modalidad }}</td>
                      <td>{{ item.tarifa }}</td>
                      <td>{{ item.importe }}</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center">
                  <button class="miBtn btn btn-outline-light" type="button" @click="actualizarAnexos72Trd"><i class="bi bi-arrow-repeat"></i> Actualizar </button>
                </div>
              </div>
            </div>

<!--            PROCESO PARA EL PASO 5-->
<!--            PARA ANEXO MUSICA-->
            <div v-if="currentTabIndex === 4 && indicadorAnexo==1">
              <h5>ANEXO MUSICA</h5>
              <section id="AnexoMusica">
                <div class="d-flex align-items-center justify-content-between">
                  <h5 class="text-center" ><strong>ANEXO No. 1 DEL CONTRATO-LICENCIA PARA LA EJECUCIÓN PÚBLICA DE OBRAS MUSICALES
                    ENTRE <span class="text-uppercase">{{ nombreUtilizador }}</span>  Y LA  AGENCIA CUBANA DE DERECHO DE AUTOR MUSICAL (ACDAM).</strong></h5>
                  <img src="../assets/img/acdamlogo.jpg">
                </div>
                <br>
                <br>
                <h4 class="text-center">Relación de locaciones donde se efectúa la ejecución pública de obras musicales.</h4>
                <br>
                <br>
                <div class="table-responsive">
                  <table class="table table-bordered" style="border-color: black">
                    <thead>
                    <tr>
                      <th scope="col">Locacion</th>
                      <th scope="col">Modalidad</th>
                      <th scope="col">Tipo de musica</th>
                      <th scope="col">Tarifa</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo71MusicaAPI" :key="item.id">
                      <td>{{ item.locacion }}</td>
                      <td>{{ item.modalidad }}</td>
                      <td>{{ item.tipoMusica }}</td>
                      <td>{{ item.tarifa }}%</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <br>
                <br>
                <h4>Y como muestra de conformidad y aceptación las partes firman el presente Anexo, que forma parte integrante del
                  contrato licencia que le antecede, a los  {{dia}} días del mes de {{mes}} de {{ano}}.</h4>
                <br>
                <br>
                <div class="d-flex align-items-center justify-content-between">
                  <p>POR LA ACDAM:</p>
                  <p>POR EL UTILIZADOR:</p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>_______________________ </p>
                  <p>_______________________ </p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>Director René Hernández Quintero </p>
                  <p></p>
                </div>
              </section>
              <div class="text-center">
                <button @click="PDF('AnexoMusica')" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>

<!--            PARA ANEXO AUDIOVISUAL-->
            <div v-if="currentTabIndex === 4 && indicadorAnexo==2">
              <h5>ANEXO audiovisual</h5>
              <section id="AnexoAudiovisual">
                <div class="d-flex align-items-center justify-content-between">
                  <h5 class="text-center" ><strong>ANEXO No. 1 DEL CONTRATO-LICENCIA PARA LA EJECUCIÓN PÚBLICA DE OBRAS AUDIOVISUALES
                    ENTRE <span class="text-uppercase">{{ nombreUtilizador }}</span>  Y LA  AGENCIA CUBANA DE DERECHO DE AUTOR MUSICAL (ACDAM).</strong></h5>
                  <img src="../assets/img/acdamlogo.jpg">
                </div>
                <br>
                <br>
                <h4 class="text-center">Relación de locaciones donde se efectúa la exhibición de obras audiovisuales.</h4>
                <br>
                <br>
                <div class="table-responsive">
                  <table class="table table-bordered" style="border-color: black">
                    <thead>
                    <tr>
                      <th scope="col">Locacion</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Tarifa</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo71AudiovisualAPI" :key="item.id">
                      <td>{{ item.locacion }}</td>
                      <td>{{ item.categoriaAudiovisual }}</td>
                      <td>{{ item.tarifa }}%</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <br>
                <br>
                <div class="d-flex align-items-center justify-content-between">
                  <p>POR LA ACDAM:</p>
                  <p>POR EL UTILIZADOR:</p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>_______________________ </p>
                  <p>_______________________ </p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>Director René Hernández Quintero </p>
                  <p></p>
                </div>
              </section>
              <div class="text-center">
                <button @click="PDF('AnexoAudiovisual')" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>

<!--            PARA ANEXO CULTURA-->
            <div v-if="currentTabIndex === 4 && indicadorAnexo==3">
              <h5>ANEXO cultura</h5>
              <section id="AnexoCultura">
                <h4 class="text-center">Relación de locaciones donde se efectúa la ejecución pública de obras musicales.</h4>
                <br>
                <table class="table table-bordered" style="border: black">
                  <thead>
                  <tr>
                    <th >Locacion</th>
                    <th >Modalidad</th>
                    <th >Musica viva</th>
                    <th >Musica grabada</th>
                    <th >Importe a pagar según la tarifa establecida</th>
                    <th >Periodicidad y fecha de pago </th>
                    <th >Periodicidad en la entrega de la información </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td rowspan="7">Instituciones culturales y áreas abiertas: Casas de Cultura, galerías de arte,
                      bibliotecas, museos, anfiteatro, teatros, plazas u otras.</td>
                    <td>Concierto de música popular con cobro de entrada</td>
                    <td>X</td>
                    <td></td>
                    <td>4% de los ingresos brutos por cobro de entrada4% de los ingresos brutos por cobro de entrada</td>
                    <td rowspan="8">Mensual: dentro de los 30 días naturales posteriores a la fecha de entrega de la factura</td>
                    <td rowspan="8">Trimestral
                      (música viva)
                      Bianual
                      (música grabada)
                    </td>
                  </tr>
                  <tr>
                    <td>Baile público con cobro de entrada</td>
                    <td>X</td>
                    <td>X</td>
                    <td>4% de los ingresos brutos por cobro de entrada4% de los ingresos brutos por cobro de entrada</td>
                  </tr>
                  <tr>
                    <td>Bailable público sin cobro de entrada, uso de música grabada en cualquier lugar sin cobro de entrada</td>
                    <td></td>
                    <td>X</td>
                    <td>13.50 CUP por título ejecutado. Se considerará que cada título ejecutado dura 6 minutos.</td>
                  </tr>
                  <tr>
                    <td>Recital / Pequeño Recital</td>
                    <td>X</td>
                    <td></td>
                    <td>$4.50 CUP por título ejecutado</td>
                  </tr>
                  <tr>
                    <td>Mini espectáculo al aire libre</td>
                    <td></td>
                    <td>X</td>
                    <td>$15.00 CUP por actividad</td>
                  </tr>
                  <tr>
                    <td rowspan="2">Festivales y espectáculos musicales, semanas de la cultura, jornadas y eventos culturales </td>
                    <td>X</td>
                    <td>X</td>
                    <td>6% de los ingresos brutos por cobro de entrada</td>
                  </tr>
                  <tr>
                    <td>X</td>
                    <td>X</td>
                    <td>4% del total pagado a las unidades artísticas que actúen en las áreas*</td>
                  </tr>
                  <tr>
                    <td>Actividades de Banda Municipal de Conciertos, Orquesta Sinfónica, de Cámara y similares</td>
                    <td>Concierto</td>
                    <td>X</td>
                    <td></td>
                    <td>2.25 por minuto de ejecución (si el título excede de 20 minutos el pago se mantiene en $45.00</td>
                  </tr>
                  <tr>
                    <td>Carnaval Área de Carnaval</td>
                    <td>Carnaval</td>
                    <td>X</td>
                    <td>X</td>
                    <td>4% de los ingresos brutos por cobro de entrada4% de los ingresos brutos por cobro de entrada</td>
                    <td rowspan="3">Dentro de los 30 días naturales posteriores a la fecha de entrega de la factura</td>
                    <td rowspan="3">Dentro de los 60 días naturales posteriores a la conclusión del evento</td>
                  </tr>
                  <tr>
                    <td>Bailables con cobro de entrada</td>
                    <td>Carnaval</td>
                    <td>X</td>
                    <td>X</td>
                    <td>4% de los ingresos brutos por cobro de entrada4% de los ingresos brutos por cobro de entrada</td>
                  </tr>
                  <tr>
                    <td>Bailables en áreas abiertas</td>
                    <td>Carnaval</td>
                    <td>X</td>
                    <td>X</td>
                    <td>4% de los ingresos brutos por cobro de entrada4% de los ingresos brutos por cobro de entrada</td>
                  </tr>
                  </tbody>
                </table>
              </section>
              <div class="text-center">
                <button @click="PDF('AnexoCultura')" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>

<!--            PARA ANEXO CIMEX-->
            <div v-if="currentTabIndex === 4 && indicadorAnexo==4">
              <h5>ANEXO CIMEX</h5>
              <section id="AnexoCimex">
                <div class="d-flex align-items-center justify-content-between">
                  <h5 class="text-center" ><strong>ANEXO No.1 DEL CONTRATO-LICENCIA PARA LA EJECUCIÓN DE OBRAS CIMEX S.A.
                    Y LA  AGENCIA CUBANA DE DERECHO DE AUTOR MUSICAL (ACDAM).</strong></h5>
                  <img src="../assets/img/acdamlogo.jpg">
                </div>
                <br>
                <br>
                <div class="table-responsive">
                  <table class="table table-bordered" style="border-color: black">
                    <thead>
                    <tr>
                      <th scope="col">Locacion/Modalidad</th>
                      <th scope="col">Cantidad de Plazas</th>
                      <th scope="col">Tarifa</th>
                      <th scope="col">Importe</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Entrega de informacion</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo72CimexAPI" :key="item.id">
                      <td>{{ item.locacionModalidad }}</td>
                      <td>{{ item.cantidadPlazas }}</td>
                      <td>{{ item.tarifa }}%</td>
                      <td>{{ item.importe }}%</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <br>
                <br>
                <h4>Y como muestra de conformidad y aceptación las partes firman el presente Anexo, que forma parte integrante del
                  contrato licencia que le antecede, a los  {{dia}} días del mes de {{mes}} de {{ano}}.</h4>
                <br>
                <br>
                <div class="d-flex align-items-center justify-content-between">
                  <p>POR LA ACDAM:</p>
                  <p>POR EL UTILIZADOR:</p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>_______________________ </p>
                  <p>_______________________ </p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>Director René Hernández Quintero </p>
                  <p>Gerente Comercial</p>
                </div>
              </section>
              <div class="text-center">
                <button @click="PDF('AnexoCimex')" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>

<!--            PARA ANEXO GAVIOTA-->
            <div v-if="currentTabIndex === 4 && indicadorAnexo==5">
              <h5>ANEXO GAVIOTA</h5>
              <section id="AnexoGaviota">
                <div v-for="(item, index) in anexo72GaviotaAPI" :key="item.id">
                <h4>Categoria: {{item.categoria}} </h4>
                <h4>No. Habitaciones: {{item.numeroHabitacion}}</h4>
                </div>
                <div class="table-responsive">
                  <table class="table table-bordered" style="border-color: black">
                    <thead>
                    <tr>
                      <th rowspan="3">Periodo</th>
                      <th colspan="4">FACTURACIÓN MENSUAL</th>
                      <th rowspan="3">Periodicidad de los pagos</th>
                      <th rowspan="3">Periodicidad en la entrega de la información</th>
                    </tr>
                    <tr>
                      <th colspan="4">tarifas por habitaciones físicas </th>
                    </tr>
                    <tr>
                      <th>Criterio</th>
                      <th>temporada alta (01/11 - 30/04)</th>
                      <th>temporada baja (01/05 - 31/10)</th>
                      <th>Ocupación por debajo del 30 %</th>
                    </tr>

                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo72GaviotaAPI" :key="item.id">
                      <td rowspan="2">{{ item.periodo }}</td>
                      <td>Tarifa</td>
                      <td>{{ item.tarifaTemporadaAlta }}</td>
                      <td>{{ item.tarifaTemporadaBaja }}%</td>
                      <td>{{ item.tarifaOcupacionInferior }}%</td>
                      <td rowspan="2">{{ item.periocidadPago }}</td>
                      <td rowspan="2">{{ item.periocidadEntrega }}</td>
                    </tr>
                    <tr v-for="(item, index) in anexo72GaviotaAPI" :key="item.id">
                      <td>Importe</td>
                      <td>{{ item.importeTemporadaAlta }}%</td>
                      <td>{{ item.importeTemporadaBaja }}%</td>
                      <td>{{ item.importeTemporadaOcupacionInferior}}%</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <br>
                <br>
                <h4>Y como muestra de conformidad y aceptación las partes firman el presente Anexo, que forma parte integrante del
                  contrato licencia que le antecede, a los  {{dia}} días del mes de {{mes}} de {{ano}}.</h4>
                <br>
                <br>
                <div class="d-flex align-items-center justify-content-between">
                  <p>POR LA ACDAM:</p>
                  <p>POR EL UTILIZADOR:</p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>_______________________ </p>
                  <p>_______________________ </p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>Director René Hernández Quintero </p>
                  <p></p>
                </div>
              </section>
              <div class="text-center">
                <button @click="PDF('AnexoGaviota')" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>

<!--            PARA ANEXO TRD-->
            <div v-if="currentTabIndex === 4 && indicadorAnexo==6">
              <h5>ANEXO TRD</h5>
              <section id="AnexoTRD">
                <div class="d-flex align-items-center justify-content-between">
                  <h5 class="text-center" ><strong>ANEXO No. 1 DEL CONTRATO-LICENCIA PARA LA COMUNICACIÓN PÚBLICA DE
                    OBRAS MUSICALES ENTRE TIENDA CARIBE Y LA AGENCIA CUBANA DE DERECHO DE AUTOR MUSICAL (ACDAM)</strong></h5>
                  <img src="../assets/img/acdamlogo.jpg">
                </div>
                <br>
                <br>
                <h5 class="text-center">UNIDADES AUTORIZADAS A UTILIZAR OBRAS MUSICALES EN SU ACTIVIDAD COMERCIAL.</h5>
                <br>
                <br>
                <div class="table-responsive">
                  <table class="table table-bordered" style="border-color: black">
                    <thead>
                    <tr>
                      <th scope="col">Locacion</th>
                      <th scope="col">Modalidad</th>
                      <th scope="col">Importe a pagar según la tarifa establecida</th>
                      <th scope="col">Periocidad de Pago</th>
                      <th scope="col">Periocidad de Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in anexo72TrdAPI" :key="item.id">
                      <td>{{ item.locacion }}</td>
                      <td>{{ item.modalidad }}</td>
                      <td>{{ item.importe }}%</td>
                      <td>{{ item.periocidadPago }}</td>
                      <td>{{ item.periocidadEntrega }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <br>
                <br>
                <h5>En la Habana, a los  {{dia}} días del mes de {{mes}} de {{ano}}.</h5>
                <br>
                <br>
                <div class="d-flex align-items-center justify-content-between">
                  <p>POR LA ACDAM:</p>
                  <p>POR EL UTILIZADOR:</p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>_______________________ </p>
                  <p>_______________________ </p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <p>Director René Hernández Quintero </p>
                  <p></p>
                </div>
              </section>
              <div class="text-center">
                <button @click="PDF('AnexoTRD')" class="miBtn btn btn-outline-light" type="button">
                  <i class="bi bi-file-earmark-pdf"></i> Generar PDF</button>
              </div>
            </div>
          </Wizard>
        </div>
        <hr>

        <!--        Listado de contratos-->
<!--        ESTATALES-->
        <div class="col-lg-12">
          <div class="alert alert-light glassmorphism text-center text-dark alert-dismissible fade show" role="alert">
            <i class="bi bi-layout-text-window-reverse"></i> <strong> Contratos Estatales</strong>
            <div class="filter">
              <a class="icon" href="#" title="Actualizar"><i class="bi bi-arrow-repeat"
                                          @click="actualizarContratosEstatales"
                                          style="color: black"></i></a>
            </div>
          </div>
        </div>
        <div class="col-lg-1" v-for="item in contratoEstatalAPI" :key="item.id" :value="item.id" style="margin-bottom: 15px">
          <img src="../assets/img/img-contrato3.jpg"  class="glassmorphism card-img-top" style="height: 6rem; margin-bottom: 5px" alt="...">
          <span class="sombra badge bg-secondary" data-bs-toggle="modal" :data-bs-target="'#id'+item.id" title="Detalles"><i
              class="bi bi-file-earmark-pdf"></i></span>
<!--          MODAL-->
          <div class="modal fade" :id="'id'+item.id" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class="bi bi-file-earmark-pdf"></i> <strong> Contrato con:</strong>
                    {{ item.utilizador }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Numero de licencia
                      <span class="badge bg-primary rounded-pill">{{ item.numeroLicencia }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Fecha de creacion
                      <span class="badge bg-primary rounded-pill">{{ item.fechaCreacionContrato }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Subordinacion
                      <span class="badge bg-primary rounded-pill">{{ item.subordinacion }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Nombre del Firmante
                      <span class="badge bg-primary rounded-pill">{{ item.nombreFirmanteContrato }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Cargo del Firmante
                      <span class="badge bg-primary rounded-pill">{{ item.cargoFirmanteContrato }}</span></li>
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
                title="Eliminar"><i class="bi bi-trash" @click="DELETE('licenciamiento/contratoLicenciaEstatal/'+item.id)"></i></span>
        </div>

<!--        NO ESTATLES JURIDICOS-->
        <div class="col-lg-12">
          <div class="alert alert-light glassmorphism text-center text-dark alert-dismissible fade show" role="alert">
            <i class="bi bi-layout-text-window-reverse"></i> <strong> Contratos No Estatales Juridico</strong>
            <div class="filter">
              <a class="icon" href="#" title="Actualizar"><i class="bi bi-arrow-repeat"
                                          @click="actualizarContratosNoEstatalesJuridicos"
                                          style="color: black"></i></a>
            </div>
          </div>
        </div>
        <div class="col-lg-1" v-for="item in contratoNoEstatalJuridicoAPI" :key="item.id" :value="item.id" style="margin-bottom: 15px">
          <img src="../assets/img/img-contrato3.jpg"  class="glassmorphism card-img-top" style="height: 6rem; margin-bottom: 5px" alt="...">
          <span class="sombra badge bg-secondary" data-bs-toggle="modal" :data-bs-target="'#idJuridico'+item.id" title="Detalles"><i
              class="bi bi-file-earmark-pdf"></i></span>
          <!--          MODAL-->
          <div class="modal fade" :id="'idJuridico'+item.id" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class="bi bi-file-earmark-pdf"></i> <strong> Contrato con:</strong>
                    {{ item.utilizador }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Numero de licencia
                      <span class="badge bg-primary rounded-pill">{{ item.numeroLicencia }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Codigo asignado
                      <span class="badge bg-primary rounded-pill">{{ item.codigo }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Fecha de creacion
                      <span class="badge bg-primary rounded-pill">{{ item.fechaCreacionContrato }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Tipo
                      <span class="badge bg-primary rounded-pill">{{ item.tipo }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Tarifa
                      <span class="badge bg-primary rounded-pill">{{ item.tarifa }}%</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Nombre del Firmante
                      <span class="badge bg-primary rounded-pill">{{ item.nombreFirmanteContrato }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Cargo del Firmante
                      <span class="badge bg-primary rounded-pill">{{ item.cargoFirmanteContrato }}</span></li>
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
                title="Eliminar"><i class="bi bi-trash" @click="DELETE('licenciamiento/contratoLicenciaPersonaJuridica/'+item.id)"></i></span>
        </div>

<!--        NO ESTATALES NATURALES-->
        <div class="col-lg-12">
          <div class="alert alert-light glassmorphism text-center text-dark alert-dismissible fade show" role="alert">
            <i class="bi bi-layout-text-window-reverse"></i> <strong> Contratos No Estatales Natural</strong>
            <div class="filter">
              <a class="icon" href="#" title="Actualizar"><i class="bi bi-arrow-repeat"
                                          @click="actualizarContratosNoEstatalesNaturales"
                                          style="color: black"></i></a>
            </div>
          </div>
        </div>
        <div class="col-lg-1" v-for="item in contratoNoEstatalNaturalAPI" :key="item.id" :value="item.id" style="margin-bottom: 15px">
          <img src="../assets/img/img-contrato3.jpg"  class="glassmorphism card-img-top" style="height: 6rem; margin-bottom: 5px" alt="...">
          <span class="sombra badge bg-secondary" data-bs-toggle="modal" :data-bs-target="'#idNatural'+item.id" title="Detalles"><i
              class="bi bi-file-earmark-pdf"></i></span>
          <!--          MODAL-->
          <div class="modal fade" :id="'idNatural'+item.id" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title"><i class="bi bi-file-earmark-pdf"></i> <strong> Contrato con:</strong>
                    {{ item.utilizador }}{{item.id}}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Numero de licencia
                      <span class="badge bg-primary rounded-pill">{{ item.numeroLicencia }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Fecha de creacion
                      <span class="badge bg-primary rounded-pill">{{ item.fechaCreacionContrato }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Modalidad
                      <span class="badge bg-primary rounded-pill">{{ item.actividadComercial }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Codigo
                      <span class="badge bg-primary rounded-pill">{{ item.codigo }}</span></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"> Tarifa
                      <span class="badge bg-primary rounded-pill">{{ item.tarifa }}%</span></li>
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
                title="Eliminar"><i class="bi bi-trash" @click="DELETE('licenciamiento/contratoLicenciaPersonaNatural/'+item.id)"></i></span>
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
.sombra {
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
.sombra:hover {
  box-shadow: none;
}
</style>