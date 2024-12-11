<template>
  <div class="container mt-4">
    <h2>Quản lý đơn hàng</h2>
    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Khách hàng</th>
        <th>Sản phẩm</th>
        <th>Số lượng</th>
        <th>Tổng tiền</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>{{ getCustomerName(order.customerId) }}</td>
        <td>{{ getProductName(order.productId) }}</td>
        <td>{{ order.quantity }}</td>
        <td>{{ order.total }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const customers = ref([]);
const products = ref([]);

const fetchData = async () => {
  try {
    const [ordersRes, customersRes, productsRes] = await Promise.all([
      axios.get('http://localhost:3000/orders'),
      axios.get('http://localhost:3000/customers'),
      axios.get('http://localhost:3000/products'),
    ]);
    orders.value = ordersRes.data;
    customers.value = customersRes.data;
    products.value = productsRes.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getCustomerName = (id) => customers.value.find((c) => c.id === id)?.name || 'Unknown';
const getProductName = (id) => products.value.find((p) => p.id === id)?.name || 'Unknown';

onMounted(fetchData);
</script>
