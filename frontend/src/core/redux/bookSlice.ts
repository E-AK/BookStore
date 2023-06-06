import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Book from '../models/Book';


interface BookState {
  books: Book[];
}

const initialState: BookState = {
  books: [],
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const updatedBook = action.payload;
      const index = state.books.findIndex((book) => book.Id === updatedBook.Id);
      if (index !== -1) {
        state.books[index] = updatedBook;
      }
    },
    deleteBook: (state, action: PayloadAction<number>) => {
      const bookId = action.payload;
      state.books = state.books.filter((book) => book.Id !== bookId);
    },
  },
});

export const { setBooks, addBook, updateBook, deleteBook } = bookSlice.actions;
export default bookSlice.reducer;
