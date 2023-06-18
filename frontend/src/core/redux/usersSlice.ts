// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../models/User';

interface UserState {
  users: User[];
  filteredUsers: User[]; // Добавлен массив для хранения отфильтрованных пользователей
}

const initialState: UserState = {
  users: [],
  filteredUsers: [], // Инициализируем пустым массивом
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.filteredUsers = action.payload; // Устанавливаем отфильтрованных пользователей в начальные пользователей
    },
    filterUsers: (state, action: PayloadAction<string>) => {
      const filterText = action.payload.toLowerCase();
      state.filteredUsers = state.users.filter((user) => {
        // Фильтрация по всем полям пользователя
        return (
          user.id.toLowerCase().includes(filterText) ||
          user.email.toLowerCase().includes(filterText) ||
          user.role.toLowerCase().includes(filterText) ||
          user.fullName.toLowerCase().includes(filterText) ||
          user.dateOfBirth.toLowerCase().includes(filterText) ||
          user.gender.toLowerCase().includes(filterText) ||
          (user.postalCode && user.postalCode.toLowerCase().includes(filterText)) ||
          (user.address && user.address.toLowerCase().includes(filterText)) ||
          (user.phoneNumber && user.phoneNumber.toLowerCase().includes(filterText))
        );
      });
    },
    clearFilter: (state) => {
      state.filteredUsers = state.users; // Возвращаем отфильтрованных пользователей к начальному состоянию
    },
  },
});

export const { setUsers, filterUsers, clearFilter } = userSlice.actions;
export default userSlice.reducer;
