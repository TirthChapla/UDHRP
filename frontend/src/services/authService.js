import { apiRequest } from './api';

// Authentication Service
const authService = {
  // Register new user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userRole', response.data.role);
    }
    
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiRequest('/auth/me', {
      method: 'GET',
    });
    return response;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response;
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const response = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    return response;
  },

  // Reset password with OTP and auto login
  resetPasswordWithOtp: async (email, otp, newPassword) => {
    const response = await apiRequest('/auth/reset-password-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
    
    // Store token in localStorage if successful
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userRole', response.data.role);
    }
    
    return response;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    return response;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },
};

export default authService;
