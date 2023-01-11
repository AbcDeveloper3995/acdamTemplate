<script setup>
import {RouterLink} from 'vue-router'
</script>
<template>
  <aside id="sidebar" class="sidebar" style="">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li class="nav-item"><a class="nav-link "><i class="bi bi-grid"></i><RouterLink to="/nomencladores">Nomencaldores</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-window-x"></i><RouterLink to="/licenciamiento">Licenciamiento</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-usb-symbol"></i><RouterLink to="/contratoLicencia">Contrato de licencia</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-thunderbolt-fill"></i><RouterLink to="/recaudacion">Recaudacion</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-terminal-x"></i><RouterLink to="/reporteCobro">Reporte de cobro</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-send-exclamation-1"></i><RouterLink to="/reclamaciones">Reclamaciones</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-motherboard-fill"></i><RouterLink to="/contratos">Contratos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-app-indicator"></i><RouterLink to="/controlServiciosJuridicos">Control servicios juridicos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-backspace"></i><RouterLink to="/controlPagosServiciosJuridicos">Control pago servicios juridicos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-bag-x"></i><RouterLink to="/reportes">Reportes</RouterLink></a></li>
      <span class="nav-heading text-black" style="font-size: 15px">Administracion</span>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-collection"></i><RouterLink to="/permisos">Permisos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-bookmark"></i><RouterLink to="/grupos">Grupos</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-people"></i><RouterLink to="/usuarios">Usuarios</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-device-ssd"></i><RouterLink to="/trazas">Trazas</RouterLink></a></li>
      <li class="nav-item"><a class="nav-link "><i class="bi bi-grid"></i>
        <RouterLink to="/jugadores">Jugadores</RouterLink>
      </a></li>
      <!--      <li class="nav-item">-->
      <!--        <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#"> <i class="bi bi-menu-button-wide"></i><span>Components</span><i class="bi bi-chevron-down ms-auto"></i> </a>-->
      <!--        <ul id="components-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">-->
      <!--          <li> <a href="components-alerts.html"> <i class="bi bi-circle"></i><span>Alerts</span> </a></li>-->
      <!--          <li> <a href="components-accordion.html"> <i class="bi bi-circle"></i><span>Accordion</span> </a></li>-->
      <!--          <li> <a href="components-badges.html"> <i class="bi bi-circle"></i><span>Badges</span> </a></li>-->
      <!--          <li> <a href="components-breadcrumbs.html"> <i class="bi bi-circle"></i><span>Breadcrumbs</span> </a></li>-->
      <!--          <li> <a href="components-buttons.html"> <i class="bi bi-circle"></i><span>Buttons</span> </a></li>-->
      <!--          <li> <a href="components-cards.html"> <i class="bi bi-circle"></i><span>Cards</span> </a></li>-->
      <!--          <li> <a href="components-carousel.html"> <i class="bi bi-circle"></i><span>Carousel</span> </a></li>-->
      <!--          <li> <a href="components-list-group.html"> <i class="bi bi-circle"></i><span>List group</span> </a></li>-->
      <!--          <li> <a href="components-modal.html"> <i class="bi bi-circle"></i><span>Modal</span> </a></li>-->
      <!--          <li> <a href="components-tabs.html"> <i class="bi bi-circle"></i><span>Tabs</span> </a></li>-->
      <!--          <li> <a href="components-pagination.html"> <i class="bi bi-circle"></i><span>Pagination</span> </a></li>-->
      <!--          <li> <a href="components-progress.html"> <i class="bi bi-circle"></i><span>Progress</span> </a></li>-->
      <!--          <li> <a href="components-spinners.html"> <i class="bi bi-circle"></i><span>Spinners</span> </a></li>-->
      <!--          <li> <a href="components-tooltips.html"> <i class="bi bi-circle"></i><span>Tooltips</span> </a></li>-->
      <!--        </ul>-->
      <!--      </li>-->
      <!--      <li class="nav-item">-->
      <!--        <a class="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#"> <i class="bi bi-journal-text"></i><span>Forms</span><i class="bi bi-chevron-down ms-auto"></i> </a>-->
      <!--        <ul id="forms-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">-->
      <!--          <li> <a href="forms-elements.html"> <i class="bi bi-circle"></i><span>Form Elements</span> </a></li>-->
      <!--          <li> <a href="forms-layouts.html"> <i class="bi bi-circle"></i><span>Form Layouts</span> </a></li>-->
      <!--          <li> <a href="forms-editors.html"> <i class="bi bi-circle"></i><span>Form Editors</span> </a></li>-->
      <!--          <li> <a href="forms-validation.html"> <i class="bi bi-circle"></i><span>Form Validation</span> </a></li>-->
      <!--        </ul>-->
      <!--      </li>-->
      <!--      <li class="nav-item">-->
      <!--        <a class="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse" href="#"> <i class="bi bi-gem"></i><span>Icons</span><i class="bi bi-chevron-down ms-auto"></i> </a>-->
      <!--        <ul id="icons-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">-->
      <!--          <li> <a href="icons-bootstrap.html"> <i class="bi bi-circle"></i><span>Bootstrap Icons</span> </a></li>-->
      <!--          <li> <a href="icons-remix.html"> <i class="bi bi-circle"></i><span>Remix Icons</span> </a></li>-->
      <!--          <li> <a href="icons-boxicons.html"> <i class="bi bi-circle"></i><span>Boxicons</span> </a></li>-->
      <!--        </ul>-->
      <!--      </li>-->
      <!--      <li class="nav-heading">Pages</li>-->

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
</style>