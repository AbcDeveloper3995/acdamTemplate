<script setup>
import {RouterLink} from 'vue-router'
</script>
<template>
  <aside id="sidebar" class="sidebar" style="">
    <ul class="sidebar-nav" id="sidebar-nav">
      <span class="nav-heading text-black" style="font-size: 15px">Nomencladores</span>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-bookmark"></i><RouterLink to="/cargo">Cargos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-people"></i><RouterLink to="/concepto">Conceptos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-hammer"></i><RouterLink to="/sucursal">Sucursal</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-device-ssd"></i><RouterLink to="/modalidad">Modalidad</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-grid"></i><RouterLink to="/sector">Sector</RouterLink></a></li>
      <span class="nav-heading text-black" style="font-size: 15px">Licenciamiento</span>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-alarm-fill"></i><RouterLink to="/utilizador">Utilizador</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-robot"></i><RouterLink to="/representante">Representante</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-window-x"></i><RouterLink to="/contratoMandato">Contrato Mandato</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-usb-symbol"></i><RouterLink to="/contratoLicencia">Contrato de licencia</RouterLink></a></li>
      <span class="nav-heading text-black" style="font-size: 15px">Recaudacion</span>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-thunderbolt"></i><RouterLink to="/recaudacion">Estado de Cuenta</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-journal-bookmark"></i><RouterLink to="/credito">Creditos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-terminal-x"></i><RouterLink to="/reporteCobro">Gestion de cobro</RouterLink></a></li>
<!--      <span class="nav-heading text-black" style="font-size: 15px">Juridico</span>-->
<!--      <li class="nav-item"><a class="nav-link "><i class="bi bi-send-exclamation-1"></i><RouterLink to="/reclamaciones">Reclamaciones</RouterLink></a></li>-->
<!--      <li class="nav-item"><a class="nav-link "><i class="bi bi-motherboard-fill"></i><RouterLink to="/contratos">Contratos</RouterLink></a></li>-->
<!--      <li class="nav-item"><a class="nav-link "><i class="bi bi-app-indicator"></i><RouterLink to="/controlServiciosJuridicos">Control servicios juridicos</RouterLink></a></li>-->
<!--      <li class="nav-item"><a class="nav-link "><i class="bi bi-backspace"></i><RouterLink to="/controlPagosServiciosJuridicos">Control pago servicios juridicos</RouterLink></a></li>-->
<!--      <li class="nav-item"><a class="nav-link "><i class="bi bi-bag-x"></i><RouterLink to="/reportes">Reportes</RouterLink></a></li>-->

      <span class="nav-heading text-black" style="font-size: 15px">Administracion</span>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-bookmark"></i><RouterLink to="/proforma">Proformas</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-binoculars"></i><RouterLink to="/clasificadorProforma">Configuracion Proformas</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-window-x"></i><RouterLink to="/grupos">Grupos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-people"></i><RouterLink to="/usuarios">Usuarios</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-device-ssd"></i><RouterLink to="/trazas">Trazas</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-grid"></i><RouterLink to="/jugadores">Jugadores</RouterLink></a></li>
    </ul>
  </aside>
</template>

<style scoped>
aside {
  background: linear-gradient(to top right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.3));
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}

li {
  transition: linear 0.5s;
}

li:hover {
  box-shadow: 6px 7px 10px -4px rgba(0, 0, 0, 0.82);
}
.sidebar-nav .nav-link.collapsed{
  color: #4154f1 !important;
  background: #f6f9ff !important;
}
</style>