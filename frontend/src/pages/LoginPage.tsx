import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelf, getSelfRole, loginUser } from '../core/api';
import { setUser } from '../core/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import User from '../core/models/User';
import { RootState } from '../core/redux/store';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user: User | null = useSelector((state: RootState) => state.user.user);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  useEffect(() => {
    if (user !== null) {
      navigate('/', { replace: true });
    }
  });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token: string = await loginUser({email, password});
      localStorage.setItem('token', token);
      const _user: User = await getSelf();
      const role: string[] = await getSelfRole();
      const _role: string = role[0];
      dispatch(setUser({role: _role, user: _user}));
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage('Ошибка входа. Проверьте правильность введенных данных.');
    }
  };

  return (
    <div className='container custom-scrollbar custom-cursor'>
      <h2>Вход</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className='form-label'>Email:</label>
          <input type="email" id="email" value={email} className='form-control' onChange={handleEmailChange} />
        </div>
        <div>
          <label htmlFor="password" className='form-label'>Пароль:</label>
          <input type="password" id="password" value={password} className='form-control' onChange={handlePasswordChange} />
        </div>
        <br />
        <button type="submit" className='btn btn-primary mb-3'>Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;
