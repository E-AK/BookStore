import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { RootState } from '../core/redux/store';
import { useSelector } from 'react-redux';
import { removeFromCart, addToCart } from '../core/redux/cartSlice';
import Book from '../core/models/Book';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Book[]>([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      const parsedCartItems: Book[] = JSON.parse(storedCartItems);
      setCartItems(parsedCartItems);
    }
  }, []);

  const handlePaymentClick = () => {
    console.log('Selected Items:', cartItems);
  };

  return (
    <div className="container custom-scrollbar custom-cursor">
      <h1>Корзина</h1>
      <div className="row">
        {cartItems.map((item) => (
          <BookCard book={item} key={item.id} />
        ))}
      </div>
      <button className="btn btn-primary" onClick={handlePaymentClick}>
        Оплатить
      </button>
    </div>
  );
};

export default CartPage;
