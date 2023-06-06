import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../core/redux/store';
import User from '../core/models/User';
import { getBooksbyIds, getSelf, getSelfRole, getUserPurchaseHistory, updateUser } from '../core/api';
import { setUser } from '../core/redux/userSlice';
import { PurchaseHistory } from '../core/models/PurchaseHistory';
import Book from '../core/models/Book';
import { useNavigate } from 'react-router-dom';


enum Tab {
  Profile = 'profile',
  PurchaseHistory = 'purchaseHistory',
}

const ProfilePage: React.FC = () => {
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const dispatch: AppDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Profile);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
    postalCode: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
  
    setFormValues((prevFormValues) => ({  
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  async function update() {
    try{
      const _ = await updateUser(formValues);
      const _user: User = await getSelf();
      const role: string[] = await getSelfRole();
      const _role: string = role[0];
      dispatch(setUser({role: _role, ..._user}));
    }
    catch(error) {
      setError('Ошибка: ' + error);
    }
  }

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();

    if (formValues.newPassword && formValues.newPassword !== formValues.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    update();
  }

  const fetchPurchaseHistory = async () => {
    try {
      const response: PurchaseHistory[] = await getUserPurchaseHistory();
      setPurchaseHistory(response);

      const ids: number[] = response.map(item => item.ProductId); // Исправлено: Используем ProductId вместо Id
      if  (ids.length > 0) {
        const books: Book[] = await getBooksbyIds(ids);
        setBooks(books);
      }
    } catch (error) {
      setError('Ошибка: ' + error);
    }
  };

  useEffect(() => {
    console.log(user);

    if (user) {
      setFormValues({
        fullName: user.FullName || '',
        dateOfBirth: user.DateOfBirth || '',
        gender: user.Gender || '',
        email: user.Email || '',
        phoneNumber: user.PhoneNumber || '',
        postalCode: user.PostalCode || '',
        address: user.Address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    else {
      navigate('/', { replace: true });
    }

    fetchPurchaseHistory();
  }, [user]);

  return (
    <div className='container custom-scrollbar custom-cursor'>
      <h2>Профиль</h2>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === Tab.Profile ? 'active' : ''}`}
            onClick={() => handleTabChange(Tab.Profile)}
          >
            Редактировать профиль
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === Tab.PurchaseHistory ? 'active' : ''}`}
            onClick={() => handleTabChange(Tab.PurchaseHistory)}
          >
            История покупок
          </button>
        </li>
      </ul>

      {activeTab === Tab.Profile && (
        <div className={`form-container ${error ? 'shake-animation' : ''}`}>
          {error && <p>{error}</p>}
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="fullName" className='form-label'>ФИО:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className='form-control'
                value={formValues.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className='form-label'>День рождения:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className='form-control'
                value={formValues.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="gender" className='form-label'>Пол:</label>
              <select
                id="gender"
                name="gender"
                value={formValues.gender}
                className='form-control'
                onChange={handleSelectChange}
                required
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
            <div>
              <label htmlFor="postalCode" className='form-label'>Почтовый индекс:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                className='form-control'
                value={formValues.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address" className='form-label'>Адресс:</label>
              <input
                type="text"
                id="address"
                name="address"
                className='form-control'
                value={formValues.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email" className='form-label'>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className='form-control'
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className='form-label'>Номер телефона:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className='form-control'
                value={formValues.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <hr />
            <p>Заполнять при смене пароля</p>
            <div>
              <label htmlFor="currendPassword" className='form-label'>Пароль:</label>
              <input
                type="password"
                id="currendPassword"
                name="currendPassword"
                className='form-control'
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="currendPassword" className='form-label'>Новый пароль:</label>
              <input
                type="password"
                id="currendPassword"
                name="currendPassword"
                className='form-control'
                pattern="^(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$"
                title="Пароль должен содержать не менее 8 символов, хотя бы одну букву, одну цифру и один специальный символ"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className='form-label'>Подтвердите пароль:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formValues.confirmPassword}
                className='form-control'
                onChange={handleInputChange}
              />
            </div>
            <br />
            <button type="submit" className='btn btn-primary'>
              Сохранить
            </button>
          </form>
        </div>
      )}

      {activeTab === Tab.PurchaseHistory && (
        <div>
          <h3>История покупок</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата и время</th>
                <th>Название</th>
                <th>Автор</th>
                <th>Описание</th>
                <th>Цена</th>
                <th>Жанр</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory ? purchaseHistory.map((purchase) => {
                const book = books ? books.find((b) => b.Id === purchase.ProductId) : null;
                if (book) {
                  return (
                    <tr key={purchase.Id}>
                      <td>{purchase.Id}</td>
                      <td>{purchase.Timestamp.toString()}</td>
                      <td>{book.Title}</td>
                      <td>{book.Author}</td>
                      <td>{book.Description}</td>
                      <td>{book.Price}</td>
                      <td>{book.Genre}</td>
                    </tr>
                  );
                }
                return null;
              }): ''}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;