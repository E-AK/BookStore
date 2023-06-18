import { get, post, put, del } from './base_api';

// Функция регистрации нового пользователя
export async function registerUser(userData: any) {
  try {
    const response = await post('/api/auth/register', userData);
    return response;
  } catch (error) {
    throw new Error('Не удалось зарегистрировать пользователя');
  }
}

// Функция авторизации пользователя
export async function loginUser(credentials: any) {
  try {
    const response = await post('/api/auth/login', credentials);
    console.log(response.token);
    return response.token;
  } catch (error) {
    throw new Error('Не удалось авторизоваться');
  }
}

// Функция получения пользователя
export async function getSelf() {
  try {
    const response = await get('/api/auth/user');
    return response;
  } catch (error) {
    throw new Error('Не удалось получить данные пользователя');
  }
}

// Функция получения роли
export async function getSelfRole() {
  try {
    const response = await get('/api/auth/role');
    return response;
  } catch (error) {
    throw new Error('Не удалось получить роль пользователя');
  }
}

// Функция обновления данных пользователя
export async function updateUser(credentials: any) {
  try {
    const response = await put('/api/auth/user', credentials);
    return response;
  } catch (error) {
    throw new Error('Не удалось обновить данные пользователя');
  }
}

// Функция выхода
export async function logout(credentials: any) {
  try {
    const response = await post('/api/auth/logout', credentials);
    return response;
  } catch (error) {
    throw new Error('Не удалось выйти');
  }
}

// Функция получения списка пользователей
export async function getUsers() {
  try {
    const response = await get('/api/auth/users');
    return response;
  } catch (error) {
    throw new Error('Не удалось получить список пользователей');
  }
}

// Функция удаления пользователя
export async function deleteUser(id: string) {
  try {
    const response = await del(`/api/auth/users/${id}`);
    return response;
  } catch (error) {
    throw new Error('Не удалось удалить пользователя');
  }
}

// Функция получения истории покупок
export async function getUserPurchaseHistory() {
  try {
    const response = await get('/api/purchaseHistory/self');
    return response;
  } catch (error) {
    throw new Error('Не удалось получить список покупок пользователя');
  }
}

export async function getTopAllTimeBooks() {
  try {
    const response = await get('/api/purchaseHistory/top-all-time');
    return response;
  } catch (error) {
    throw new Error('Не удалось получить список книг');
  }
}

export async function getTopMonthBooks() {
  try {
    const response = await get('/api/purchaseHistory/top-month');
    return response;
  } catch (error) {
    throw new Error('Не удалось получить список книг');
  }
}

// Функция получения книг по id
export async function getBooksbyIds(ids: number[]) {
  try {
    const response = await get(`/api/books/ids?=${ids.join(',')}`);
    return response;
  } catch (error) {
    throw new Error('Не удалось получить список книг');
  }
}

// Функция получения книг
export async function getBooks() {
  try {
    const response = await get(`/api/books/`);
    return response;
  } catch (error) {
    throw new Error('Не удалось получить список книг');
  }
}

// Функция удаления книги
export async function deleteBook(id: number) {
  try {
    const response = await del(`/api/books/${id}`);
    return response;
  } catch (error) {
    throw new Error('Не удалось удалить книгу');
  }
}

// Функция создания книги
export async function createBook(credentials: any) {
  try {
    const response = await post(`/api/books/`, credentials);
    return response;
  } catch (error) {
    throw new Error('Не удалось создать книгу пользователя');
  }
}

export async function getShoppingCart() {
  try {
    const response = await get(`/api/books/`);
    return response;
  } catch (error) {
    throw new Error('Не удалось создать книгу пользователя');
  }
}

export async function addToCart(credentials: any) {
  try {
    const response = await post(`/api/ShoppingCart/`, credentials);
    return response;
  } catch (error) {
    throw new Error('Не удалось добавить товар в корзину');
  }
}

export async function checkout() {
  try {
    const response = await post(`/api/ShoppingCart/checkout`, {});
    return response;
  } catch (error) {
    throw new Error('Не удалось добавить товар в корзину');
  }
}