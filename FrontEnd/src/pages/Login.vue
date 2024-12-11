<template>
  <div class="card shadow-sm" style="width: 400px;">
    <div class="card-body">
      <h3 class="text-center mb-3">Đăng nhập Admin</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
              v-model="email"
              type="email"
              id="email"
              class="form-control"
              placeholder="Nhập email"
              required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
              v-model="password"
              type="password"
              id="password"
              class="form-control"
              placeholder="Nhập mật khẩu"
              required
          />
        </div>
        <button class="btn btn-primary w-100" type="submit">Đăng nhập</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref ,reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore();

const handleLogin = () => {
  if (auth.login(email.value, password.value)) {
    router.push('/');
  } else {
    alert('Thông tin đăng nhập không chính xác!');
  }
};
</script>
