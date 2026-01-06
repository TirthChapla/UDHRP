import { apiRequest } from './api';

export const getReceptionistProfile = async () => {
  const response = await apiRequest('/receptionist/profile', {
    method: 'GET'
  });
  return response.data;
};

export const updateReceptionistProfile = async (profileData) => {
  const response = await apiRequest('/receptionist/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  return response.data;
};

// ==================== APPOINTMENT APIs ====================

export const getAllAppointments = async () => {
  const response = await apiRequest('/receptionist/appointments', {
    method: 'GET'
  });
  return response.data;
};

export const getTodayAppointments = async () => {
  const response = await apiRequest('/receptionist/appointments/today', {
    method: 'GET'
  });
  return response.data;
};

export const getTomorrowAppointments = async () => {
  const response = await apiRequest('/receptionist/appointments/tomorrow', {
    method: 'GET'
  });
  return response.data;
};

export const getYesterdayAppointments = async () => {
  const response = await apiRequest('/receptionist/appointments/yesterday', {
    method: 'GET'
  });
  return response.data;
};

export const getRecentAppointments = async () => {
  const response = await apiRequest('/receptionist/appointments/recent', {
    method: 'GET'
  });
  return response.data;
};

export const getLastWeekAppointments = async () => {
  const response = await apiRequest('/receptionist/appointments/last-week', {
    method: 'GET'
  });
  return response.data;
};

export const getAppointmentsByDate = async (date) => {
  const response = await apiRequest(`/receptionist/appointments/date/${date}`, {
    method: 'GET'
  });
  return response.data;
};

export const rescheduleAppointment = async (appointmentData) => {
  const response = await apiRequest(`/receptionist/appointments/${appointmentData.appointmentId}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify(appointmentData)
  });
  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await apiRequest(`/receptionist/appointments/${appointmentId}`, {
    method: 'DELETE'
  });
  return response.data;
};

export const confirmAppointment = async (appointmentId) => {
  const response = await apiRequest(`/receptionist/appointments/${appointmentId}/confirm`, {
    method: 'PUT'
  });
  return response.data;
};
