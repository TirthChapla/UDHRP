// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// API request wrapper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export { API_BASE_URL, apiRequest, getAuthToken };
