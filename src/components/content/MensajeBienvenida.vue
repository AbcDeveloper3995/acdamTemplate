<script setup>
const nombre = localStorage.getItem('nombre')
const apellidos = localStorage.getItem('apellidos')
</script>

<template>
    <h1>Bienvenido {{nombre}} {{apellidos}}</h1>
</template>

<style scoped>

</style>