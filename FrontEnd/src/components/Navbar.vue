<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Admin Dashboard</a>

      <form class="d-flex ms-auto me-3" @submit.prevent="handleSearch">
        <input
            v-model="searchQuery"
            class="form-control me-2"
            type="search"
            placeholder="Tìm kiếm..."
            aria-label="Search"
        />
        <button class="btn btn-outline-success" type="submit">Tìm</button>
      </form>

      <div>
        <button class="btn btn-outline-primary me-2">
          <i class="fas fa-bell"></i> Thông báo
        </button>
        <button @click="logout" class="btn btn-danger">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const searchQuery = ref('');

const handleSearch = () => {
  console.log('Tìm kiếm:', searchQuery.value);
};

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>
