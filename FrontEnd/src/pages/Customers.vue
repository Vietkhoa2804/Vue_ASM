<template>
  <div class="container mt-4">
    <h2>Quản lý khách hàng</h2>
    <button class="btn btn-primary mb-3" @click="openAddModal">Thêm khách hàng mới</button>

    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Tên</th>
        <th>Email</th>
        <th>Số điện thoại</th>
        <th>Hình ảnh</th>
        <th>Trạng thái</th>
        <th>Thao tác</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="customer in customers" :key="customer.id">
        <td>{{ customer.id }}</td>
        <td>{{ customer.name }}</td>
        <td>{{ customer.email }}</td>
        <td>{{ customer.phone }}</td>
        <td>
          <img
              v-if="customer.image"
              :src="`http://localhost:3000/uploads/${customer.image}`"
              alt="Customer Image"
              style="width: 50px; height: 50px"
          />
          <span v-else>Không có hình ảnh</span>
        </td>
        <td>{{ customer.status === 1 ? 'Active' : 'Unactive' }}</td>
        <td>
          <button class="btn btn-warning btn-sm" @click="openEditModal(customer)">Sửa</button>
          <button class="btn btn-danger btn-sm" @click="updateStatus(customer.id, 0)">Xóa</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal thêm khách hàng -->
    <div v-if="showAddModal" class="modal" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm khách hàng mới</h5>
            <button type="button" class="close" @click="closeAddModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCustomer">
              <div class="form-group">
                <label for="name">Tên</label>
                <input v-model="newCustomer.name" type="text" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input v-model="newCustomer.email" type="email" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="phone">Số điện thoại</label>
                <input v-model="newCustomer.phone" type="text" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="image">Hình ảnh</label>
                <input type="file" @change="handleImageUpload" class="form-control" />
              </div>
              <button type="submit" class="btn btn-primary">Thêm</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal sửa khách hàng -->
    <div v-if="editingCustomer" class="modal" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sửa khách hàng</h5>
            <button type="button" class="close" @click="closeEditModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEditCustomer">
              <div class="form-group">
                <label for="editName">Tên khách hàng</label>
                <input v-model="editingCustomer.name" type="text" class="form-control" id="editName" required />
              </div>
              <div class="form-group">
                <label for="editEmail">Email</label>
                <input v-model="editingCustomer.email" type="email" class="form-control" id="editEmail" required />
              </div>
              <div class="form-group">
                <label for="editPhone">Số điện thoại</label>
                <input v-model="editingCustomer.phone" type="text" class="form-control" id="editPhone" required />
              </div>
              <div class="form-group">
                <label for="editImage">Hình ảnh</label>
                <input type="file" @change="handleEditImageUpload" class="form-control" />
              </div>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';

const customers = ref([]);
const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  image: null,
});
const editingCustomer = ref(null);
const showAddModal = ref(false); // Biến để quản lý hiển thị modal thêm khách hàng

// Lấy danh sách khách hàng
const fetchCustomers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/customers');
    customers.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy danh sách khách hàng:', error);
  }
};

// Thêm khách hàng mới
const addCustomer = async () => {
  const formData = new FormData();
  formData.append('name', newCustomer.value.name);
  formData.append('email', newCustomer.value.email);
  formData.append('phone', newCustomer.value.phone);
  if (newCustomer.value.image) {
    formData.append('image', newCustomer.value.image);
  }

  try {
    await axios.post('http://localhost:3000/api/customers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    newCustomer.value = {name: '', email: '', phone: '', image: null}; // Reset form
    closeAddModal(); // Đóng modal sau khi thêm thành công
    fetchCustomers(); // Lấy lại danh sách khách hàng
  } catch (error) {
    console.error('Lỗi thêm khách hàng:', error);
  }
};

// Cập nhật trạng thái khách hàng
const updateStatus = async (id, status) => {
  try {
    await axios.put(`http://localhost:3000/api/customers/${id}/status`, {status});
    fetchCustomers(); // Lấy lại danh sách khách hàng
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái khách hàng:', error);
  }
};

// Mở modal sửa khách hàng
const openEditModal = (customer) => {
  editingCustomer.value = {...customer};
};

// Đóng modal sửa khách hàng
const closeEditModal = () => {
  editingCustomer.value = null;
};

// Lưu thông tin khách hàng đã sửa
const saveEditCustomer = async () => {
  const formData = new FormData();
  formData.append('name', editingCustomer.value.name);
  formData.append('email', editingCustomer.value.email);
  formData.append('phone', editingCustomer.value.phone);
  if (editingCustomer.value.image) {
    formData.append('image', editingCustomer.value.image);
  }

  try {
    await axios.put(`http://localhost:3000/api/customers/${editingCustomer.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    closeEditModal();
    fetchCustomers(); // Lấy lại danh sách khách hàng
  } catch (error) {
    console.error('Lỗi cập nhật khách hàng:', error);
  }
};

// Mở modal thêm khách hàng
const openAddModal = () => {
  showAddModal.value = true;
};

// Đóng modal thêm khách hàng
const closeAddModal = () => {
  showAddModal.value = false;
  newCustomer.value = {name: '', email: '', phone: '', image: null}; // Reset form
};

// Xử lý upload hình ảnh khi thêm khách hàng
const handleImageUpload = (event) => {
  newCustomer.value.image = event.target.files[0];
};

// Xử lý upload hình ảnh khi sửa khách hàng
const handleEditImageUpload = (event) => {
  editingCustomer.value.image = event.target.files[0];
};

onMounted(fetchCustomers);
</script>