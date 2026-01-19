import api from './api';

const authService = {
    // Login
    async login(email, password, rememberMe = false) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.accessToken) {
            const { accessToken, user } = response.data;
            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem('token', accessToken);
            storage.setItem('user', JSON.stringify(user));
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

    // Create Login for Member (Admin)
    async createMemberLogin(memberId, email, password, role) {
        const response = await api.post('/auth/create-member-login', { memberId, email, password, role });
        return response.data;
    },

    // Admin Reset Password
    async adminResetPassword(userId, newPassword) {
        const response = await api.post('/auth/admin-reset-password', { userId, newPassword });
        return response.data;
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if authenticated
    isAuthenticated() {
        return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
    },
};

export default authService;
