import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.data);
          }
        } catch (err) {
          console.error('Failed to load user:', err);
          authService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      
      if (response.success) {
        // Fetch full user details
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success) {
          setUser(userResponse.data);
        }
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      
      if (response.success) {
        // Auto login after registration
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      }
      return { success: false, error: response.message };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
