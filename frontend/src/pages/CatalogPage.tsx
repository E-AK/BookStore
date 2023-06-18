import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Book from '../core/models/Book';
import BookCard from '../components/BookCard';
import { getBooks } from '../core/api';
import BookFilter from '../components/BookFilter';
import { RootState } from '../core/redux/store';
import { setBooks } from '../core/redux/bookSlice';

const CatalogPage: React.FC = () => {
  const dispatch = useDispatch();
  const books = useSelector((state: RootState) => state.book.books);
  const filteredBooks = useSelector((state: RootState) => state.book.filteredBooks);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response: Book[] = await getBooks();
        dispatch(setBooks(response));
      } catch (error) {
        console.log('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container custom-scrollbar custom-cursor">
      <div className="row">
        <div className="col-md-3">
          <BookFilter />
        </div>

        <div className="col-md-9">
          <div className="row">
            {filteredBooks.map((book: Book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
