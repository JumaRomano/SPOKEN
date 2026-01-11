import api from './api';

const authService = {
    // Login
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.accessToken) {
            const { accessToken, user } = response.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        throw new Error('Login failed');
    },

    // Register
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.status === 201) {
            return response.data.user;
        }
        throw new Error('Registration failed');
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },
};

export default authService;
