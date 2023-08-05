import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import frontpageReducer from '../features/FrontPage/FrontPageSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    barang: frontpageReducer,
  },
});
