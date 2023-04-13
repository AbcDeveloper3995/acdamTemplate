<script setup>
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";

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