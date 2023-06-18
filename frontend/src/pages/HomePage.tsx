import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Book from '../core/models/Book';
import BookCard from '../components/BookCard';
import { getBooks } from '../core/api';

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [topBooksByMonth, setTopBooksByMonth] = useState<Book[]>([]);

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    // Загружаем список книг
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      const books = response;

      // Устанавливаем топ книги для обоих разделов
      setTopBooks(books.slice(0, 3));
      setTopBooksByMonth(books.slice(0, 3));
      // Здесь необходимо диспатчить экшены для сохранения топ книг в сторе Redux
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  return (
    <div className='container custom-scrollbar custom-cursor'>
      <h1>Добро пожаловать в книжный магазин</h1>

      {!isLoggedIn && (
        <div>
          <p>Please log in or register to access the full features of our Book Store.</p>
          <div>
            <Link to='/login' className='btn btn-primary mr-2'>Log In</Link>
            <Link to='/register' className='btn btn-primary'>Register</Link>
          </div>
        </div>
      )}

      <div className='my-4'>
        <h2>Популярные книги</h2>
        <div className="col-md-9">
          <div className="row">
            {topBooks.map((book: Book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        </div>
      </div>

      <div className='my-4'>
        <h2>Популярные за месяц</h2>
        <div className="col-md-9">
          <div className="row">
            {topBooksByMonth.map((book: Book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
