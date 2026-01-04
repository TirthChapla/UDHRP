// doctorService.js - All doctor-related API calls
import { apiRequest } from './api';

/**
 * Get doctor profile
 * @returns {Promise<Object>}
 */
export const getDoctorProfile = async () => {
  try {
    const response = await apiRequest('/doctor/profile', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

/**
 * Update doctor profile
 * @param {Object} profileData 
 * @returns {Promise<Object>}
 */
export const updateDoctorProfile = async (profileData) => {
  try {
    const response = await apiRequest('/doctor/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};
