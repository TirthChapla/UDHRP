// API Configuration
const API_BASE_URL = '/api';

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

// API request wrapper - supports both calling styles:
// apiRequest(endpoint, 'GET')
// apiRequest(endpoint, { method: 'GET', ... })
const apiRequest = async (endpoint, methodOrOptions = 'GET', legacyOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  // Handle different calling conventions
  let method = 'GET';
  let options = legacyOptions;
  
  if (typeof methodOrOptions === 'string') {
    // New style: apiRequest(endpoint, 'GET', options)
    method = methodOrOptions;
  } else if (typeof methodOrOptions === 'object') {
    // Old style: apiRequest(endpoint, { method: 'POST', ... })
    options = methodOrOptions;
    method = options.method || 'GET';
  }
  
  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  
  // Remove method from config body (it shouldn't be in the options)
  delete config.method;
  config.method = method; // Re-add it at the end to ensure it's set correctly
  
  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export { API_BASE_URL, apiRequest, getAuthToken };
