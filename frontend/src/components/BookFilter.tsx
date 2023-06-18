import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../core/redux/store';
import { filterBooks, clearNewBook } from '../core/redux/bookSlice';

const BookFilter: React.FC = () => {
  const dispatch = useDispatch();

  const [filterText, setFilterText] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleFilter = () => {
    dispatch(filterBooks({
      filterText: filterText.trim(),
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice)
    }));
  };

  const handleClearFilters = () => {
    dispatch(clearNewBook());
    setFilterText('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedGenres([]);
  };

  const handleFilterByAuthorChange = (value: string) => {
    setFilterText(value);
  };

  const handleFilterByPriceChange = (minValue: string, maxValue: string) => {
    setMinPrice(minValue);
    setMaxPrice(maxValue);
  };

  const handleFilterByGenreChange = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((selectedGenre) => selectedGenre !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Фильтр</h5>
        <div className="form-group">
          <label htmlFor="author">Автор:</label>
          <input
            type="text"
            className="form-control"
            id="author"
            value={filterText}
            onChange={(e) => handleFilterByAuthorChange(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priceMin">Цена (мин.):</label>
          <input
            type="number"
            className="form-control"
            id="priceMin"
            value={minPrice}
            onChange={(e) => handleFilterByPriceChange(e.target.value, maxPrice)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priceMax">Цена (макс.):</label>
          <input
            type="number"
            className="form-control"
            id="priceMax"
            value={maxPrice}
            onChange={(e) => handleFilterByPriceChange(minPrice, e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Жанр:</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value="Художественная литература"
              checked={selectedGenres.includes('Художественная литература')}
              onChange={() => handleFilterByGenreChange('Художественная литература')}
            />
            <label className="form-check-label">Художественная литература</label><br />
            <input
              className="form-check-input"
              type="checkbox"
              value="Роман"
              checked={selectedGenres.includes('Роман')}
              onChange={() => handleFilterByGenreChange('Роман')}
            />
            <label className="form-check-label">Роман</label><br />
            <input
              className="form-check-input"
              type="checkbox"
              value="Детектив"
              checked={selectedGenres.includes('Детектив')}
              onChange={() => handleFilterByGenreChange('Детектив')}
            />
            <label className="form-check-label">Детектив</label>
          </div>
          {/* Остальные жанры */}
        </div>
        <button className="btn btn-primary" onClick={handleFilter}>
          Применить фильтры
        </button>
        <button className="btn btn-secondary" onClick={handleClearFilters}>
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
};

export default BookFilter;
