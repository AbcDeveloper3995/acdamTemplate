<script setup>

import {computed, ref} from "vue";

import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
import {PDF} from '../util/functiosGlobal'

const input = `<input type='text'>`
const miLista = [{
  id:1,
  nombre:'Anthuan',
  apellido:'Barroso',
  edad:27,
  color:'Blanco',
  cantProyectos: ref(7),
  manos:2,
  pies:2,
  ojos:2,
  edit:ref(false)
},{
  id:2,
  nombre:'YanKee',
  apellido:'Campeon',
  edad:28,
  color:'Negro',
  cantProyectos: ref(3),
  manos:2,
  pies:2,
  ojos:2,
  edit: ref(false)
}]
const editar = (index) => {
  miLista[index].edit.value = true
}

const aumentarFactura = (index) => {
  miLista[index].cantProyectos.value++
}

const sumarFacturas = computed(()=>{
  let cont = 0
  let suma = miLista.forEach(item => {
    cont+=item.cantProyectos.value
  })
  return cont
})
// const nombre = 'Anthuan'
const cont = ref(0)

const incrementar = () => {
  cont.value++
}
const reiniciar = () => {
  cont.value = 0
}
const a = computed(()=>{
  if(cont.value>=15){
    return 'bg-dark'
  }
  if(cont.value>=9){
    return 'bg-danger'
  }
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
      <div class="col-12">
        <div class="card glassmorphism">
          <div class="card-body">
            <h5 class="card-title">REPORTE DE COBRO</h5>
              <button
                  @click="PDF('ReporteCobro')" style="margin-bottom: 10px"
                  class="miBtn btn btn-outline-dark" type="button">
                <i class="bi bi-file-pdf"></i> Generar PDF
              </button>
            <div class="table-responsive" id="ReporteCobro">
              <table class="table table-bordered" style="border: black">
                <thead>
                <tr>
                  <th rowspan="3" colspan="3"><img src="@/assets/img/logo3.jpg"></th>
                  <th rowspan="3" colspan="3">REPORTE DE COBRO</th>
                  <th colspan="4">modelo</th>
                </tr>
                <tr>
                  <th colspan="4">Fecha</th>
                </tr>
                <tr>
                  <th colspan="4">No.</th>
                </tr>
                <tr>
                  <th colspan="3">Codigo</th>
                  <th colspan="3">Representante</th>
                  <th colspan="4">Provincia</th>
                </tr>
                <tr>
                  <th>Cheque</th>
                  <th>Fecha</th>
                  <th>Codigo</th>
                  <th>Utilizador</th>
                  <th>Factura</th>
                  <th>Importe Total</th>
                  <th>Concepto</th>
                  <th>Concepto</th>
                  <th>Concepto</th>
                  <th>Concepto</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in miLista" key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.nombre }}</td>
                  <td>{{ item.apellido }}</td>
                  <td>{{ item.edad }}</td>
                  <td>{{ item.manos }}</td>
                  <td>{{ item.cantProyectos }}</td>
                  <td v-if="!item.edit.value">{{ item.pies }}</td>
                  <td v-else><input type="number" :value=item.pies></td>
                  <td>{{ item.edit.value }}</td>
                  <td>{{ item.color }}</td>
                  <td v-if="!item.edit.value">
                    <button @click="editar(index)">editar</button>
                    <button @click="aumentarFactura(index)">aumentar</button>
                  </td>
                  <td v-else>
                    <button>salvar</button>
                  </td>
                </tr>
                <tr>
                  <td colspan="5">Suma de Reporte</td>
                  <td><span class="badge rounded-pill bg-danger">{{ sumarFacturas }}</span></td>
                  <td>7</td>
                  <td>8</td>
                  <td>9</td>
                  <td>10</td>
                </tr>
                <tr>
                  <th>Factura</th>
                  <th>Mod BAR</th>
                  <th>Mod Cafeteria</th>
                  <th>Mod Restaurant</th>
                  <th>Mod Centro Noc</th>
                  <th>Modalidad</th>
                  <th rowspan="2" colspan="4">Observaciones</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                </tr>
                <tr>
                  <th colspan="3">Enviado por</th>
                  <th colspan="4">Recibido por recaudacion y licenciamineto</th>
                  <th colspan="3">Recibido por contabilidad y finanzas</th>
                </tr>
                <tr>
                  <td colspan="2">Nombre y Apellidos</td>
                  <td colspan="1">Firma</td>
                  <td colspan="2">Nombre y Apellidos</td>
                  <td colspan="2">Firma</td>
                  <td colspan="2">Nombre y Apellidos</td>
                  <td colspan="1">Firma</td>
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
.miBtn{
  border-radius: 10px;
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
</style>