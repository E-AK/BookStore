import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5152';

// Функция для выполнения GET запроса
export const get = async (url: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}` // Замените `token` на ваш реальный токен авторизации
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Функция для выполнения POST запроса
export const post = async (url: string, data: any) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}` // Замените `token` на ваш реальный токен авторизации
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Функция для выполнения PUT запроса
export const put = async (url: string, data: any) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }});
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Функция для выполнения DELETE запроса
export const del = async (url: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
