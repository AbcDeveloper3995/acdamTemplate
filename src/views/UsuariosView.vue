<script setup>
import Base from "@/components/base/Base.vue";
import MensajeBienvenida from "@/components/content/MensajeBienvenida.vue";
</script>

<template>
  <main id="main" class="main">
    <div class="pagetitle">
      <MensajeBienvenida/>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
          <li class="breadcrumb-item active">Usuario</li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
    </section>
  </main>
  <Base/>
</template>

<style scoped>

</style>