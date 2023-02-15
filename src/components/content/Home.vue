<script setup>
import {computed, ref} from "vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";

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
  if(cont.value<=5){
    return 'bg-dark'
  }
  if(cont.value>5){
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
          <li class="breadcrumb-item active"><i class="bi bi-house-fill"> /</i></li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
        <div class="col-lg-12">
          <div class="row">
            <div class="col-xxl-4 col-md-6">
              <div class="card glassmorphism info-card sales-card">
                <div class="card-body">
                  <h5 class="card-title">GANACIAS <span style="color: black">| MENSUAL</span></h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> <i class="icon bi bi-currency-euro"></i></div>
                    <div class="ps-3">
                      <h6>$145</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xxl-4 col-md-6">
              <div class="card glassmorphism info-card revenue-card">
                <div class="card-body">
                  <h5 class="card-title">GANACIAS <span style="color: black">| ANUAL</span></h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> <i class=" icon bi bi-currency-dollar"></i></div>
                    <div class="ps-3">
                      <h6>$3,264</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xxl-4 col-md-6">
              <div class="card glassmorphism info-card customers-card">
                <div class="card-body">
                  <h5 class="card-title">INGRESOS PENDIENTES</h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center"> <i class="icon bi bi-coin"></i></div>
                    <div class="ps-3">
                      <h6>1244</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
<!--            <div class="col-12">-->
<!--              <div class="card glassmorphism">-->
<!--                <div class="card-body">-->
<!--                  <h5 class="card-title">REPORTE DE COBRO</h5>-->
<!--                  <div class="table-responsive">-->
<!--                    <table class="table table-bordered" style="border: black">-->
<!--                      <thead>-->
<!--                      <tr>-->
<!--                        <th rowspan="3" colspan="3" ><img src="@/assets/img/logo3.jpg"></th>-->
<!--                        <th rowspan="3" colspan="3">REPORTE DE COBRO</th>-->
<!--                        <th colspan="4">modelo</th>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <th colspan="4">Fecha</th>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <th colspan="4">No.</th>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <th colspan="3">Codigo</th>-->
<!--                        <th colspan="3">Representante</th>-->
<!--                        <th colspan="4">Provincia</th>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <th>Cheque</th>-->
<!--                        <th>Fecha</th>-->
<!--                        <th>Codigo</th>-->
<!--                        <th>Utilizador</th>-->
<!--                        <th>Factura</th>-->
<!--                        <th>Importe Total</th>-->
<!--                        <th>Concepto</th>-->
<!--                        <th>Concepto</th>-->
<!--                        <th>Concepto</th>-->
<!--                        <th>Concepto</th>-->
<!--                      </tr>-->
<!--                      </thead>-->
<!--                      <tbody>-->
<!--                      <tr v-for="(item, index) in miLista" key="item.id">-->
<!--                        <td>{{ item.id}}</td>-->
<!--                        <td>{{item.nombre}}</td>-->
<!--                        <td>{{item.apellido}}</td>-->
<!--                        <td>{{item.edad}}</td>-->
<!--                        <td>{{item.manos}}</td>-->
<!--                        <td>{{item.cantProyectos}}</td>-->
<!--                        <td v-if="!item.edit.value">{{item.pies}}</td>-->
<!--                        <td v-else><input type="number" :value=item.pies></td>-->
<!--                        <td>{{item.edit.value}}</td>-->
<!--                        <td>{{item.color}}</td>-->
<!--                        <td v-if="!item.edit.value">-->
<!--                          <button @click="editar(index)">editar</button>-->
<!--                          <button @click="aumentarFactura(index)">aumentar</button>-->
<!--                        </td>-->
<!--                        <td v-else><button>salvar</button></td>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <td colspan="5">Suma de Reporte</td>-->
<!--                        <td><span class="badge rounded-pill bg-danger">{{sumarFacturas}}</span></td>-->
<!--                        <td>7</td>-->
<!--                        <td>8</td>-->
<!--                        <td>9</td>-->
<!--                        <td>10</td>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <th>Factura</th>-->
<!--                        <th>Mod BAR</th>-->
<!--                        <th>Mod Cafeteria</th>-->
<!--                        <th>Mod Restaurant</th>-->
<!--                        <th>Mod Centro Noc</th>-->
<!--                        <th>Modalidad</th>-->
<!--                        <th rowspan="2" colspan="4">Observaciones</th>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <td>1</td>-->
<!--                        <td>2</td>-->
<!--                        <td>3</td>-->
<!--                        <td>4</td>-->
<!--                        <td>5</td>-->
<!--                        <td>6</td>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <th colspan="3">Enviado por</th>-->
<!--                        <th colspan="4">Recibido por recaudacion y licenciamineto</th>-->
<!--                        <th colspan="3">Recibido por contabilidad y finanzas</th>-->
<!--                      </tr>-->
<!--                      <tr>-->
<!--                        <td colspan="2">Nombre y Apellidos</td>-->
<!--                        <td colspan="1">Firma</td>-->
<!--                        <td colspan="2">Nombre y Apellidos</td>-->
<!--                        <td colspan="2">Firma</td>-->
<!--                        <td colspan="2">Nombre y Apellidos</td>-->
<!--                        <td colspan="1">Firma</td>-->
<!--                      </tr>-->
<!--                      </tbody>-->
<!--                    </table>-->
<!--                  </div>-->

<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </div>
        <div class="col-lg-12">
          <div class="row">
            <div class="col-md-6">
              <div class="card glassmorphism">
                <div class="card-body">
                  <h5 class="card-title"></h5>
                  <div class="alert alert-primary alert-dismissible fade show" role="alert"> <i class="bi bi-star me-1"></i> <strong>LICENCIAMIENTO</strong></div>
                  <div class="alert alert-secondary alert-dismissible fade show" role="alert"> <i class="bi bi-collection me-1"></i><strong> CAPTAR ESTADO DE CUENTAS</strong></div>
                  <div class="alert alert-success alert-dismissible fade show" role="alert"> <i class="bi bi-check-circle me-1"></i><strong> RECLAMACIONES</strong></div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card glassmorphism">
                <div class="card-body">
                  <h5 class="card-title"></h5>
                  <div class="alert alert-danger alert-dismissible fade show" role="alert"> <i class="bi bi-exclamation-octagon me-1"></i><strong> CONTRATO LICENCIA</strong></div>
                  <div class="alert alert-warning alert-dismissible fade show" role="alert"> <i class="bi bi-exclamation-triangle me-1"></i><strong> CAPTAR REPORTE DE COBRO</strong></div>
                  <div class="alert alert-info alert-dismissible fade show" role="alert"> <i class="bi bi-info-circle me-1"></i><strong> CONTRATO SERVICIOS JURIDICOS</strong></div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.glassmorphism{
  background: linear-gradient( to top right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5) );
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
  transition: linear 4s ease;
}
.miBtn{
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
.miBtn:hover{
  box-shadow: none;
}
.icon{
  animation-name: giro;
  animation-duration: 4s;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes giro {
  0% {transform: rotateY(360deg)}
}
</style>