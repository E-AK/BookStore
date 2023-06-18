import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Book from '../core/models/Book';
import { RootState } from '../core/redux/store';
import { addToCart, removeFromCart } from '../core/redux/cartSlice';

const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const location = useLocation();

  const handleAddToCart = () => {
    //dispatch(addToCart(book));

    // Сохранение в localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    let updatedCartItems: Book[] = [];
    if (storedCartItems) {
      updatedCartItems = JSON.parse(storedCartItems);
    }
    updatedCartItems.push(book);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(book.id));

    // Обновление localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      const updatedCartItems: Book[] = JSON.parse(storedCartItems).filter(
        (item: Book) => item.id !== book.id
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
  };

  const isCartPage = location.pathname === '/cart';

  return (
    <div className="col-md-4" key={book.id}>
      <div className="card mb-4">
        <img
          src={book.preview ? 'http://localhost:5152/api/books/' + book.id + '/preview' : ''}
          className="card-img-top book-image"
          alt={book.title}
        />
        <div className="card-body">
          <h5 className="card-title">{book.title}</h5>
          <p className="card-text">{book.description}</p>
          <h6 className="card-subtitle mb-2 text-muted">{book.price}</h6>
          {isCartPage ? (
            <button className="btn btn-danger" onClick={handleRemoveFromCart}>
              Удалить из корзины
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Добавить в корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
