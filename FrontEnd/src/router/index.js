import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

import Login from '../pages/Login.vue';
import DashboardLayout from "../layouts/DashboardLayout.vue";
import Dashboard from '../pages/Dashboard.vue';
import Products from '../pages/Products.vue';
import Customers from '../pages/Customers.vue';
import Orders from '../pages/Orders.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { layout: 'auth' },
    },
    {
        path: '/',
        component: DashboardLayout,
        meta: { requiresAuth: true, layout: 'dashboard' },
        children: [
            { path: '', name: 'Dashboard', component: Dashboard },
            { path: 'products', name: 'Products', component: Products },
            { path: 'customers', name: 'Customers', component: Customers },
            { path: 'orders', name: 'Orders', component: Orders },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/login');
    } else if (to.name === 'Login' && auth.isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
