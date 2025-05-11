import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addcommentAPI,
  deletecommentAPI,
  getcommentAPI,
  addlikecommentAPI,
  addislikecommentAPI
} from "./commentsAPI";

export const addcomment = createAsyncThunk('comments/addcomment', addcommentAPI);
export const deletecomment = createAsyncThunk('comments/deletecomment', deletecommentAPI);
export const getcomment = createAsyncThunk('comments/getcomment', getcommentAPI);
export const addlike = createAsyncThunk('comments/addlike', addlikecommentAPI);
export const adddislike = createAsyncThunk('comments/adddislike', addislikecommentAPI);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    items: [],
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getcomment.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(getcomment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.items = action.payload.comments;
      })
      .addCase(getcomment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addcomment.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(addcomment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addcomment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletecomment.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(deletecomment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.items = state.items.filter(comment => comment._id !== action.payload.commentId);
      })
      .addCase(deletecomment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addlike.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.items.findIndex(c => c._id === updatedComment._id);
        if (index !== -1) state.items[index] = updatedComment;
      })

      .addCase(adddislike.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.items.findIndex(c => c._id === updatedComment._id);
        if (index !== -1) state.items[index] = updatedComment;
      });
  }
});

export default commentSlice.reducer;
