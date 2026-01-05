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

// ==================== PRESCRIPTION APIs ====================

/**
 * Search patients by query (name, email, phone, or patient ID)
 * @param {string} query 
 * @returns {Promise<Array>}
 */
export const searchPatients = async (query) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/patient/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
};

/**
 * Get patient by patient ID
 * @param {string} patientId 
 * @returns {Promise<Object>}
 */
export const getPatientById = async (patientId) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/patient/${patientId}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

/**
 * Get patient's previous prescriptions
 * @param {string} patientId 
 * @returns {Promise<Array>}
 */
export const getPatientPrescriptions = async (patientId) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/patient/${patientId}/prescriptions`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    throw error;
  }
};

/**
 * Get patient's lab reports
 * @param {string} patientId 
 * @returns {Promise<Array>}
 */
export const getPatientLabReports = async (patientId) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/patient/${patientId}/lab-reports`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient lab reports:', error);
    throw error;
  }
};

/**
 * Create a new prescription
 * @param {Object} prescriptionData 
 * @returns {Promise<Object>}
 */
export const createPrescription = async (prescriptionData) => {
  try {
    const response = await apiRequest('/doctor/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

/**
 * Get prescription by ID
 * @param {number} id 
 * @returns {Promise<Object>}
 */
export const getPrescriptionById = async (id) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/${id}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prescription:', error);
    throw error;
  }
};

/**
 * Get prescription by prescription ID (RX-XXXX)
 * @param {string} prescriptionId 
 * @returns {Promise<Object>}
 */
export const getPrescriptionByPrescriptionId = async (prescriptionId) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/rx/${prescriptionId}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prescription:', error);
    throw error;
  }
};

/**
 * Get all prescriptions created by the logged-in doctor
 * @returns {Promise<Array>}
 */
export const getDoctorPrescriptions = async () => {
  try {
    const response = await apiRequest('/doctor/prescriptions', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error);
    throw error;
  }
};

/**
 * Get prescription count for logged-in doctor
 * @returns {Promise<number>}
 */
export const getPrescriptionCount = async () => {
  try {
    const response = await apiRequest('/doctor/prescriptions/count', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prescription count:', error);
    throw error;
  }
};

/**
 * Update a prescription
 * @param {number} id 
 * @param {Object} prescriptionData 
 * @returns {Promise<Object>}
 */
export const updatePrescription = async (id, prescriptionData) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prescriptionData),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error;
  }
};

/**
 * Delete a prescription
 * @param {number} id 
 * @returns {Promise<void>}
 */
export const deletePrescription = async (id) => {
  try {
    const response = await apiRequest(`/doctor/prescriptions/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting prescription:', error);
    throw error;
  }
};
