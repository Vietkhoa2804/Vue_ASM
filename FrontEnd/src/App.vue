<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <DashboardLayout v-if="isDashboardLayout">
        <component :is="Component" />
      </DashboardLayout>

      <AuthLayout v-else>
        <component :is="Component" />
      </AuthLayout>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import DashboardLayout from './layouts/DashboardLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();

const isDashboardLayout = computed(() => {
  return route.meta.layout === 'dashboard';
});
</script>
