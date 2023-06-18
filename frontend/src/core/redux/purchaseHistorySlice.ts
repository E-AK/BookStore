import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PurchaseHistory } from '../models/PurchaseHistory';

interface PurchaseHistoryState {
  purchaseHistory: PurchaseHistory[] | undefined;
}

const initialState: PurchaseHistoryState = {
  purchaseHistory: undefined,
};

const purchaseHistorySlice = createSlice({
  name: 'purchaseHistory',
  initialState,
  reducers: {
    setPurchaseHistory: (state, action: PayloadAction<PurchaseHistory[]>) => {
      state.purchaseHistory = action.payload;
    },
  },
});

export const { setPurchaseHistory } = purchaseHistorySlice.actions;
export default purchaseHistorySlice.reducer;