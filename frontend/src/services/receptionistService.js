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
