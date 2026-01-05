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

// ==================== SCHEDULE/APPOINTMENT APIs ====================

/**
 * Get all appointments for the logged-in doctor
 * @returns {Promise<Array>}
 */
export const getAllAppointments = async () => {
  try {
    const response = await apiRequest('/doctor/schedule/appointments', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Get today's appointments
 * @returns {Promise<Array>}
 */
export const getTodayAppointments = async () => {
  try {
    const response = await apiRequest('/doctor/schedule/appointments/today', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching today appointments:', error);
    throw error;
  }
};

/**
 * Get tomorrow's appointments
 * @returns {Promise<Array>}
 */
export const getTomorrowAppointments = async () => {
  try {
    const response = await apiRequest('/doctor/schedule/appointments/tomorrow', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tomorrow appointments:', error);
    throw error;
  }
};

/**
 * Get yesterday's appointments
 * @returns {Promise<Array>}
 */
export const getYesterdayAppointments = async () => {
  try {
    const response = await apiRequest('/doctor/schedule/appointments/yesterday', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching yesterday appointments:', error);
    throw error;
  }
};

/**
 * Get last week's appointments
 * @returns {Promise<Array>}
 */
export const getLastWeekAppointments = async () => {
  try {
    const response = await apiRequest('/doctor/schedule/appointments/last-week', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching last week appointments:', error);
    throw error;
  }
};

/**
 * Get appointments by specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>}
 */
export const getAppointmentsByDate = async (date) => {
  try {
    const response = await apiRequest(`/doctor/schedule/appointments/date/${date}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments by date:', error);
    throw error;
  }
};

/**
 * Get appointments by date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>}
 */
export const getAppointmentsByDateRange = async (startDate, endDate) => {
  try {
    const response = await apiRequest(`/doctor/schedule/appointments/date-range?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments by date range:', error);
    throw error;
  }
};

/**
 * Get today's schedule summary
 * @returns {Promise<Object>}
 */
export const getTodaySummary = async () => {
  try {
    const response = await apiRequest('/doctor/schedule/summary/today', {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching today summary:', error);
    throw error;
  }
};

/**
 * Reschedule an appointment
 * @param {Object} rescheduleData - { appointmentId, date, time, reason }
 * @returns {Promise<Object>}
 */
export const rescheduleAppointment = async (rescheduleData) => {
  try {
    const response = await apiRequest('/doctor/schedule/appointments/reschedule', {
      method: 'POST',
      body: JSON.stringify(rescheduleData),
    });
    return response.data;
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    throw error;
  }
};

/**
 * Update appointment status
 * @param {number} id - Appointment ID
 * @param {string} status - New status (SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW)
 * @returns {Promise<Object>}
 */
export const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await apiRequest(`/doctor/schedule/appointments/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
    return response.data;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};
