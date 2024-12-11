<template>
  <div class="d-flex flex-column bg-dark text-white" style="height: 100vh; width: 250px;">
    <div class="p-3">
      <h3>Soft UI</h3>
    </div>
    <ul class="nav flex-column">

      <li class="nav-item">
        <router-link to="/" class="nav-link text-white">Dashboard</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/products" class="nav-link text-white">Quản lý Sản phẩm</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/customers" class="nav-link text-white">Quản lý Khách hàng</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/orders" class="nav-link text-white">Quản lý Đơn hàng</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
</script>
