import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: 1, name: 'Bolpen', hargaBeli: 8000, hargaJual: 10000, stok: 5, imgPath: '/bolpen.jpeg' },
  { id: 2, name: 'Pensil', hargaBeli: 5000, hargaJual: 8000, stok: 10, imgPath: '/Pensil.jpeg' },
];

export const FrontPageSlice = createSlice({
  name: 'barang',
  initialState,
  reducers: {
    addBarang: (state, action) => {
      const { name } = action.payload;
      const nameExists = state.some((item) => item.name === name);
      if (nameExists) {
        alert('nama tidak boleh sama!');
        return;
      }

      const maxId = state.reduce((max, item) => (item.id > max ? item.id : max), 0);
      const newId = maxId + 1;
      action.payload.id = newId;
      state.push(action.payload);
    },
    updateBarang: (state, action) => {
      const { id, ...updatedItem } = action.payload;
      const itemToUpdate = state.find((item) => item.id === id);

      if (itemToUpdate) {
        const itemIndex = state.findIndex((item) => item.id === id);
        state[itemIndex] = { ...state[itemIndex], ...updatedItem };
      }
    },
    deleteBarang: (state, action) => {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    },
  },
  extraReducers: {},
});

export const { addBarang, updateBarang, deleteBarang } = FrontPageSlice.actions;

export default FrontPageSlice.reducer;
