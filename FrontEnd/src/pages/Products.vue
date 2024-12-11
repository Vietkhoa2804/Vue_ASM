<template>
  <div class="container mt-4">
    <h2>Quản lý sản phẩm</h2>
    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Tên sản phẩm</th>
        <th>Giá</th>
        <th>Tồn kho</th>
        <th>Thao tác</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.id }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.price }}</td>
        <td>{{ product.stock }}</td>
        <td>
          <button class="btn btn-warning btn-sm" @click="editProduct(product)">Sửa</button>
          <button class="btn btn-danger btn-sm" @click="deleteProduct(product.id)">Xóa</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/products/${id}`);
    products.value = products.value.filter((product) => product.id !== id);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

const editProduct = (product) => {
  alert(`Chỉnh sửa sản phẩm: ${product.name}`);
};

onMounted(fetchProducts);
</script>
