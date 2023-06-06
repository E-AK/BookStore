import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Book from '../core/models/Book';

const CatalogPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState('title');
  const [filterByAuthor, setFilterByAuthor] = useState('');
  const [filterByPriceMin, setFilterByPriceMin] = useState('');
  const [filterByPriceMax, setFilterByPriceMax] = useState('');
  const [filterByGenre, setFilterByGenre] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      /*const response: Book[] = await getBooks();
      setBooks(response);
      setFilteredBooks(response);*/
    };

    fetchBooks();
  }, []);

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    filterBooks(filterByAuthor, value, filterByPriceMin, filterByPriceMax, selectedGenres);
  };

  const handleFilterByAuthorChange = (value: string) => {
    setFilterByAuthor(value);
    filterBooks(value, sortBy, filterByPriceMin, filterByPriceMax, selectedGenres);
  };

  const handleFilterByPriceChange = (minValue: string, maxValue: string) => {
    setFilterByPriceMin(minValue);
    setFilterByPriceMax(maxValue);
    filterBooks(filterByAuthor, sortBy, minValue, maxValue, selectedGenres);
  };

  const handleFilterByGenreChange = (value: string) => {
    const updatedGenres = selectedGenres.includes(value)
      ? selectedGenres.filter((genre) => genre !== value)
      : [...selectedGenres, value];

    setSelectedGenres(updatedGenres);
    filterBooks(filterByAuthor, sortBy, filterByPriceMin, filterByPriceMax, updatedGenres);
  };

  const filterBooks = (
    author: string,
    sortBy: string,
    priceMin: string,
    priceMax: string,
    genres: string[]
  ) => {
    let filteredBooks = [...books];

    if (author !== '') {
      filteredBooks = filteredBooks.filter((book) =>
        book.Author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (priceMin !== '') {
      filteredBooks = filteredBooks.filter((book) => book.Price >= parseFloat(priceMin));
    }

    if (priceMax !== '') {
      filteredBooks = filteredBooks.filter((book) => book.Price <= parseFloat(priceMax));
    }

    if (genres.length > 0) {
      filteredBooks = filteredBooks.filter((book) =>
        genres.some((genre) => book.Genre.toLowerCase().includes(genre.toLowerCase()))
      );
    }

    sortBooks(sortBy, author, priceMin, priceMax, genres);
  };

  const sortBooks = (
    sortBy: string,
    author: string,
    priceMin: string,
    priceMax: string,
    genres: string[]
  ) => {
    let sortedBooks = [...filteredBooks];

    switch (sortBy) {
      case 'title':
        sortedBooks = sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
      case 'price':
        sortedBooks = sortedBooks.sort((a, b) => a.Price - b.Price);
        break;
      default:
        sortedBooks = sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
    }

    setFilteredBooks(sortedBooks);
  };

  const genreOptions = ['Fiction', 'Fantasy', 'Mystery', 'Romance', 'Sci-fi', 'Thriller'];

  return (
    <div className="container custom-scrollbar custom-cursor">
      <h1>Book Catalog</h1>

      <div className="row">
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Filters</h5>
              <div className="form-group">
                <label htmlFor="author">Author:</label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  value={filterByAuthor}
                  onChange={(e) => handleFilterByAuthorChange(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="priceMin">Price Min:</label>
                <input
                  type="number"
                  className="form-control"
                  id="priceMin"
                  value={filterByPriceMin}
                  onChange={(e) => handleFilterByPriceChange(e.target.value, filterByPriceMax)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="priceMax">Price Max:</label>
                <input
                  type="number"
                  className="form-control"
                  id="priceMax"
                  value={filterByPriceMax}
                  onChange={(e) => handleFilterByPriceChange(filterByPriceMin, e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Genre:</label>
                {genreOptions.map((genre) => (
                  <div className="form-check" key={genre}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={genre}
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleFilterByGenreChange(genre)}
                    />
                    <label className="form-check-label">{genre}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="row">
            {filteredBooks.map((book) => (
              <div className="col-md-4" key={book.Id}>
                <div className="card mb-4">
                  <img src={book.Preview} className="card-img-top" alt={book.Title} />
                  <div className="card-body">
                    <h5 className="card-title">{book.Title}</h5>
                    <p className="card-text">{book.Description}</p>
                    <h6 className="card-subtitle mb-2 text-muted">{book.Price}</h6>
                    <Link to={`/books/${book.Id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
