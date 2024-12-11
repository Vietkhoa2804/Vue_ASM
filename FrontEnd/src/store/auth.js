import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
        admin: { email: 'admin@gmail.com', password: 'admin123' },
    }),
    actions: {
        login(email, password) {
            if (email === this.admin.email && password === this.admin.password) {
                this.isAuthenticated = true;
                localStorage.setItem('isAuthenticated', 'true');
                return true;
            }
            return false;
        },
        logout() {
            this.isAuthenticated = false;
            localStorage.removeItem('isAuthenticated');
        },
    },
});
