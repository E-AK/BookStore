// bookSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Book from '../models/Book';

interface BookState {
  books: Book[];
  filteredBooks: Book[];
  newBook: Book;
}

const initialState: BookState = {
  books: [],
  filteredBooks: [],
  newBook: {
    id: 0,
    preview: null,
    title: '',
    author: '',
    description: '',
    price: 0,
    genre: '',
  },
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
      state.filteredBooks = action.payload; // Установка отфильтрованных книг равными всем книгам изначально
    },
    setNewBook: (state, action: PayloadAction<Book>) => {
      state.newBook = action.payload;
    },
    filterBooks: (state, action: PayloadAction<{ filterText: string, minPrice: number | undefined, maxPrice: number | undefined}>) => {
      const { filterText, minPrice, maxPrice } = action.payload;
      const lowercaseFilterText = filterText.toLowerCase();
      state.filteredBooks = state.books.filter((book) => {
        const lowercaseTitle = book.title.toLowerCase();
        const lowercaseAuthor = book.author.toLowerCase();
        const lowercaseDescription = book.description.toLowerCase();
        const lowercaseGenre = book.genre.toLowerCase();
        const matchesFilter = lowercaseTitle.includes(lowercaseFilterText)
          || lowercaseAuthor.includes(lowercaseFilterText)
          || lowercaseDescription.includes(lowercaseFilterText)
          || lowercaseGenre.includes(lowercaseFilterText);
        const withinPriceRange = (minPrice !== undefined ? book.price >= minPrice : true)
          && (maxPrice !== undefined ? book.price <= maxPrice : true);
        return matchesFilter && withinPriceRange;
      });
    },
    clearNewBook: (state) => {
      state.newBook = {
        id: 0,
        preview: null,
        title: '',
        author: '',
        description: '',
        price: 0,
        genre: '',
      };
    },
  },
});

export const { setBooks, setNewBook, filterBooks, clearNewBook } = bookSlice.actions;
export default bookSlice.reducer;
