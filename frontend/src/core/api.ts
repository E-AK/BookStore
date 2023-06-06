import { get, post, put, del } from './base_api';

// Функция регистрации нового пользователя
export async function registerUser(userData: any) {
  try {
    const response = await post('/api/auth/register', userData);
    return response;
  } catch (error) {
    throw new Error('Registration failed');
  }
}

// Функция авторизации пользователя
export async function loginUser(credentials: any) {
  try {
    const response = await post('/api/auth/login', credentials);
    console.log(response.token);
    return response.token;
  } catch (error) {
    throw new Error('Login failed');
  }
}

// Функция получения пользователя
export async function getSelf() {
  try {
    const response = await get('/api/auth/user');
    return response;
  } catch (error) {
    throw new Error('Get user failed');
  }
}

// Функция получения роли
export async function getSelfRole() {
  try {
    const response = await get('/api/auth/role');
    return response;
  } catch (error) {
    throw new Error('Get role failed');
  }
}

// Функция обновления данных пользователя
export async function updateUser(credentials: any) {
  try {
    const response = await put('/api/auth/user', credentials);
    return response;
  } catch (error) {
    throw new Error('Update user   failed');
  }
}

// Функция выхода
export async function logout(credentials: any) {
  try {
    const response = await put('/api/logout', credentials);
    return response;
  } catch (error) {
    throw new Error('Update user   failed');
  }
}

// Функция получения истории покупок
export async function getUserPurchaseHistory() {
  try {
    const response = await get('/api/purchaseHistory');
    return response;
  } catch (error) {
    throw new Error('Get purchase history failed');
  }
}

// Функция получения книгг по id
export async function getBooksbyIds(ids: number[]) {
  try {
    const response = await get(`/api/books/ids?=${ids.join(',')}`);
    return response;
  } catch (error) {
    throw new Error('Get purchase history failed');
  }
}