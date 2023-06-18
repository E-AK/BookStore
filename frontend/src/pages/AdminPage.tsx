import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Book from '../core/models/Book';
import User from '../core/models/User';
import { createBook, deleteBook, deleteUser, getBooks, getSelf, getSelfRole, getUsers } from '../core/api';
import { setUser } from '../core/redux/userSlice';
import { clearNewBook, setBooks, setNewBook } from '../core/redux/bookSlice';
import { setUsers } from '../core/redux/usersSlice';
import { AppDispatch, RootState } from '../core/redux/store';
import axios from 'axios';
import { API_BASE_URL } from '../core/base_api';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('purchases');
  const user = useSelector((state: RootState) => state.user.user);
  const purchaseHistory = useSelector((state: RootState) => state.purchaseHistory.purchaseHistory);
  const books = useSelector((state: RootState) => state.book.books);
  const users = useSelector((state: RootState) => state.users.users);
  const [error, setError] = useState('');
  const newBook = useSelector((state: RootState) => state.book.newBook);
  const [preview, setPreview] = useState<File | null>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
      setPreview(file);
      //dispatch(setNewBook({ ...newBook, preview: file }));
    }
  };

  const delUser = async (event: React.FormEvent, id: string) => {
    event.preventDefault();

    try {
      await deleteUser(id);
      const updatedUsers = users.filter((user: User) => user.id !== id);
      dispatch(setUsers(updatedUsers));
    } catch (error) {
      setError('Ошибка удаления пользователя: ' + error);
    }
  };

  const UserTableComponent = () => {
    const dispatch = useDispatch();
    const filteredUsers = useSelector((state: RootState) => state.users.filteredUsers);

    return (
      <div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>День рождения</th>
                <th>Пол</th>
                <th>Почтовый индекс</th>
                <th>Адрес</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: User) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.dateOfBirth}</td>
                  <td>{user.gender === 'male' ? 'М' : 'Ж'}</td>
                  <td>{user.postalCode}</td>
                  <td>{user.address}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button className="btn btn-danger" onClick={(e) => delUser(e, user.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const delBook = async (event: React.FormEvent, id: number) => {
    event.preventDefault();

    try {
      await deleteBook(id);
      const updatedBooks = books.filter((book: Book) => book.id !== id);
      dispatch(setBooks(updatedBooks));
    } catch (error) {
      setError('Ошибка удаления книги: ' + error);
    }
  };

  const addBook = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('description', newBook.description);
    formData.append('price', newBook.price.toString());
    formData.append('genre', newBook.genre);
    if (preview) {
      formData.append('preview', preview);
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/books`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Замените `token` на ваш реальный токен авторизации
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Очистка полей и обновление списка книг
      dispatch(clearNewBook());
      setPreview(null);
      const _books: Book[] = await getBooks();
      dispatch(setBooks(_books));
    } catch (error) {
      setError('Ошибка добавления книги: ' + error);
    }
  };

  useEffect(() => {
    const token: string | null = localStorage.getItem('token');

    const fetchData = async () => {
      const _users = await getUsers();
      dispatch(setUsers(_users));

      const _books: Book[] = await getBooks();
      dispatch(setBooks(_books));

      const _user: User = await getSelf();
      const role: string[] = await getSelfRole();
      const _role: string = role[0];

      if (_role !== 'Admin') {
        navigate('/', { replace: true });
      }

      dispatch(setUser({ role: _role, user: _user }));
    };

    if (token && !user) {
      fetchData();
    }
  }, [dispatch, navigate, user]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container custom-scrollbar custom-cursor">
      {error && <div>{error}</div>}

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => handleTabChange('purchases')}
          >
            Покупки
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => handleTabChange('books')}
          >
            Книги
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            Пользователи
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'purchases' && (
          <div className="tab-pane fade show active">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>ID Пользователя</th>
                  <th>ID Книги</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory ? (
                  purchaseHistory.map((purchase) => {
                    const book = books.find((b) => b.id === purchase.productId);
                    if (book) {
                      return (
                        <tr key={purchase.id}>
                          <td>{purchase.id}</td>
                          <td>{purchase.userId}</td>
                          <td>{book.id}</td>
                          <td>{purchase.timestamp.toString()}</td>
                        </tr>
                      );
                    }
                    return null;
                  })
                ) : (
                  <tr>
                    <td colSpan={4}>Покупки не найдены</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="tab-pane fade show active">
            <form>
              <div className="form-group">
                <label>Название:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBook.title}
                  onChange={(e) => dispatch(setNewBook({ ...newBook, title: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Автор:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBook.author}
                  onChange={(e) => dispatch(setNewBook({ ...newBook, author: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Описание:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBook.description}
                  onChange={(e) => dispatch(setNewBook({ ...newBook, description: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Цена:</label>
                <input
                  type="number"
                  className="form-control"
                  value={newBook.price}
                  onChange={(e) => dispatch(setNewBook({ ...newBook, price: Number(e.target.value) }))}
                />
              </div>
              <div className="form-group">
                <label>Жанр:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newBook.genre}
                  onChange={(e) => dispatch(setNewBook({ ...newBook, genre: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Превью:</label>
                <input type="file" className="form-control-file" onChange={handleFileChange} />
              </div>
              <button type="submit" className="btn btn-primary" onClick={addBook}>
                Добавить
              </button>
            </form>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Автор</th>
                  <th>Описание</th>
                  <th>Цена</th>
                  <th>Жанр</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book: Book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.description}</td>
                    <td>{book.price}</td>
                    <td>{book.genre}</td>
                    <td>
                      <button className="btn btn-primary">Редактировать</button>
                      <button className="btn btn-danger" onClick={(e) => delBook(e, book.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-pane fade show active">
            <UserTableComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
