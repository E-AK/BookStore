import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../models/User';

interface UserState {
  user: User | null;
  role: string | null;
}

const initialState: UserState = {
  user: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;