<template>
  <div class="container mt-5">
    <h1 class="text-primary">Dashboard</h1>
    <p class="text-muted">Chào mừng bạn đến với Admin Dashboard!</p>

    <div class="row">
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5 class="card-title text-soft-primary">Tổng sản phẩm</h5>
            <p class="card-text fs-4 fw-bold">{{ totalProducts }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5 class="card-title text-soft-primary">Tổng khách hàng</h5>
            <p class="card-text fs-4 fw-bold">{{ totalCustomers }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5 class="card-title text-soft-primary">Doanh thu tháng</h5>
            <p class="card-text fs-4 fw-bold">{{ monthlyRevenue }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <h3 class="text-secondary">Danh sách sản phẩm</h3>
      <table class="table table-hover">
        <thead class="table-light">
        <tr>
          <th>#</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Trạng thái</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>
              <span :class="['badge', product.available ? 'bg-success' : 'bg-danger']">
                {{ product.available ? 'Còn hàng' : 'Hết hàng' }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const totalProducts = ref(0);
const totalCustomers = ref(0);
const monthlyRevenue = ref('0 USD');
const products = ref([]);

const fetchDashboardData = async () => {
  try {
    const [productsRes, customersRes, ordersRes] = await Promise.all([
      axios.get('http://localhost:3000/products'),
      axios.get('http://localhost:3000/customers'),
      axios.get('http://localhost:3000/orders'),
    ]);

    totalProducts.value = productsRes.data.length;

    totalCustomers.value = customersRes.data.length;

    monthlyRevenue.value = `${ordersRes.data.reduce((sum, order) => sum + order.total, 0)} USD`;

    products.value = productsRes.data.map((product) => ({
      ...product,
      available: product.stock > 0,
    }));
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
};

onMounted(fetchDashboardData);
</script>
