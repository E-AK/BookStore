import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import User from '../core/models/User';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../core/redux/store';
import { getSelf, getSelfRole, logout } from '../core/api';
import { clearUser, setUser } from '../core/redux/userSlice';

const NavigationMenu: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user: User | null = useSelector((state: RootState) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('User');

  const handleLogout = () => {
    logout({}).then(() => {
      localStorage.removeItem('token');
      dispatch(clearUser());
      navigate('/', {replace: true})
    });
  };

  useEffect(() => {
    const token: string | null = localStorage.getItem('token');
    const fetchData = async () => {
      const _user: User = await getSelf();
      const role: string[] = await getSelfRole();
      const _role: string = role[0];
      setRole(_role);
      dispatch(setUser({ role: _role, user: _user }));
    };

    if (token && !user) {
      fetchData();
    }
  }, [dispatch, user]);

  const isCartPage = location.pathname === '/cart';
  const isHomePage = location.pathname === '/';
  const isCatalogPage = location.pathname === '/catalog';
  const isAdminPage = location.pathname === '/admin';
  const isProfilePage = location.pathname === '/profile';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Book Store
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className={'nav-link' + (isHomePage ? ' active' : '')} to="/">
                Домашняя
              </Link>
            </li>
            <li className="nav-item">
              <Link className={'nav-link' + (isCatalogPage ? ' active' : '')} to="/catalog">
                Каталог
              </Link>
            </li>
            <li className="nav-item">
              <Link className={'nav-link' + (isCartPage ? ' active' : '')} to="/cart">
                Корзина
              </Link>
            </li>

            {role === 'Admin' && (
              <li className={'nav-item' + (isAdminPage ? ' active' : '')}>
                <Link to="/admin" className="nav-link">
                  Админ панель
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li className="nav-item">
                  <Link className={'nav-link' + (isProfilePage ? ' active' : '')} to="/profile">
                    Профиль
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ml-auto">
                  <Link className={'nav-link' + (isLoginPage ? ' active' : '')} to="/login">
                    Войти
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={'nav-link' + (isRegisterPage ? ' active' : '')} to="/register">
                    Регистрация
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
