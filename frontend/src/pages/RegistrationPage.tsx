import React, { useEffect, useState } from 'react';
import { getSelf, getSelfRole, loginUser, registerUser } from '../core/api';
import { setUser } from '../core/redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../core/redux/store';
import User from '../core/models/User';
import { useNavigate } from 'react-router-dom';


const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const [error, setError] = useState('');

  const [formValues, setFormValues] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    password: '',
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

  async function register() {
    try {
      const _ = await registerUser(formValues);

      const token = await loginUser(formValues);
      localStorage.setItem('token', token);

      const _user = await getSelf();
      const role = await getSelfRole();
      const _role = role[0];
      dispatch(setUser({role: _role, ..._user}));

      navigate('/', { replace: true });
    } catch (error) {
      setError('Ошибка регистрации' + error);
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    register();

    setFormValues((prevValues) => ({
      ...prevValues,
      email: '',
      password: '',
      confirmPassword: ''
    }));
  };

  useEffect(() => {
    if (user !== null) {
      navigate('/', { replace: true });
    }
  }, [user, dispatch, navigate]);

  return (
    <div className="container custom-scrollbar custom-cursor">
      <h1>Регистрация</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className='form-label'>ФИО:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className='form-control'
                value={formValues.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className='form-label'>Дата рождения:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formValues.dateOfBirth}
                className='form-control'
                onChange={handleInputChange}
                required
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
              <label htmlFor="email" className='form-label'>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className='form-control'
                value={formValues.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className='form-label'>Пароль:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formValues.password}
                className='form-control'
                onChange={handleInputChange}
                pattern="^(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$"
                title="Пароль должен содержать не менее 8 символов, хотя бы одну букву, одну цифру и один специальный символ"
                required
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
                required
              />
            </div>
            <br />
            <div className="col-auto">
              <button type="submit" className='btn btn-primary mb-3'>Регистрация</button>
            </div>
          </form>
    </div>
  );
};

export default RegistrationPage;
