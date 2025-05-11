import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getallboardsAPI } from './boardsAPI';

export const getallboards = createAsyncThunk('/boards/getallboards', getallboardsAPI);

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    boards: [],
    loading: false,
    error: null,
    activeBoard:{
      name:'All',
      description:'Explore our boards,have fun',
      img:'https://images.unsplash.com/photo-1580196969807-cc6de06c05be?q=80&w=1958&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  },
  reducers: { setActiveBoard: (state, action) => {
    state.activeBoard = action.payload;
  },},
  extraReducers: (builder) => {
    builder
      .addCase(getallboards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallboards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getallboards.fulfilled, (state, action) => {
        state.boards = action.payload.boards;
        state.loading = false;
        state.error = null;
      });
  },
});
export const { setActiveBoard } = boardsSlice.actions;


export default boardsSlice.reducer;
