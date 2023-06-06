import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import User from '../core/models/User';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../core/redux/store';
import { getSelf, getSelfRole, logout } from '../core/api';
import { clearUser, setUser } from '../core/redux/userSlice';


const NavigationMenu: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const [role, setRole] = useState('User');

  const handleLogout = () => {
    logout({});
    localStorage.removeItem('token');
    dispatch(clearUser);
  };

  useEffect(() => {
    const token: string | null = localStorage.getItem('token');
    console.log(user);
    const fetch = async () => {
      const _user: User = await getSelf();
      const role: string[] = await getSelfRole();
      const _role: string = role[0]
      setRole(_role);
      dispatch(setUser({role: _role, ..._user}));
    }

    if (token && !user) {
      fetch();
    }
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Book Store</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Домашняя</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalog">Каталог</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Корзина</Link>
            </li>

            {role == 'Admin' ? (
              <li className="nav-item">
                <Link to="/admin" className="nav-link">
                  Админ панель
                </Link>
              </li>
            ): ("")}

            {user ? (
              <React.Fragment>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Профиль</Link>
                </li>
                <li className="nav-item">
                  <button className='btn btn-danger' onClick={handleLogout}>Выйти</button>
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <li className="nav-item ml-auto">
                  <Link className="nav-link" to="/login">Войти</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Регистрация</Link>
                </li>
              </React.Fragment>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;