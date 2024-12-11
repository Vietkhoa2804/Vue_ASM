<script setup>
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
</script>

<template>
  <div class="d-flex">
    <Sidebar />
    <div class="flex-grow-1">
      <Navbar />
      <div class="container mt-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>