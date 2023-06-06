import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import { Provider } from 'react-redux';
import store from './core/redux/store';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage'


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <NavigationMenu />

          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/catalog" element={<CatalogPage />}> </Route>
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/register" element={<RegistrationPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/admin" element={<AdminPage />}></Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
