import apiClient from '../services/apiClient';

const registerUser = async (userData, isFormData = false) => {
  try {
    let response;
    if (isFormData) {
      response = await apiClient.post('/users/register', userData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = await apiClient.post('/users/register', userData);
    }
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export { registerUser };