import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllPostsAPI,
  createTextPostAPI,
  uploadImagePostAPI,
  uploadVideoPostAPI,
  deletePostAPI,
  addlikeAPI,
  adddislikeAPI,
  addreportAPI,
  getallreportsAPI,
  deletereportAPI  
} from './postsAPI';
export const deleteReport = createAsyncThunk('report/delete', deletereportAPI);
export const getAllPosts = createAsyncThunk('posts/getAll', getAllPostsAPI);
export const createTextPost = createAsyncThunk('posts/createText', createTextPostAPI);
export const uploadImagePost = createAsyncThunk('posts/uploadImage', uploadImagePostAPI);
export const uploadVideoPost = createAsyncThunk('posts/uploadVideo', uploadVideoPostAPI);
export const deletePost = createAsyncThunk('posts/delete', deletePostAPI);
export const addlike = createAsyncThunk('posts/addlike', addlikeAPI);
export const adddislike = createAsyncThunk('posts/addislike', adddislikeAPI);
export const addreport=createAsyncThunk('/report/addreport',addreportAPI)
export const getAllReports = createAsyncThunk('report/getAllReports', getallreportsAPI);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    status: 'idle',
    error: null,
    reports:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(createTextPost.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(createTextPost.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createTextPost.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(uploadImagePost.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(uploadImagePost.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(uploadImagePost.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(uploadVideoPost.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(uploadVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(uploadVideoPost.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.items = state.items.filter(post => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
     .addCase(addlike.fulfilled, (state, action) => {
  state.loading = false;
  state.status = 'succeeded';
  const updatedPost = action.payload;
  const index = state.items.findIndex(post => post._id === updatedPost._id);
  
  if (index !== -1) {
    state.items[index] = { 
      ...state.items[index],
      likes: updatedPost.likes,
      dislikes: updatedPost.dislikes || state.items[index].dislikes 
    };
  }
})

.addCase(adddislike.fulfilled, (state, action) => {
  state.loading = false;
  state.status = 'succeeded';
  const updatedPost = action.payload;
  const index = state.items.findIndex(post => post._id === updatedPost._id);
  
  if (index !== -1) {
    state.items[index] = { 
      ...state.items[index],
      dislikes: updatedPost.dislikes,
      likes: updatedPost.likes || state.items[index].likes
    };
  }
})
      .addCase(getAllReports.pending, (state) => {
  state.loading = true;
  state.status = 'loading';
})
.addCase(getAllReports.fulfilled, (state, action) => {
  state.loading = false;
  state.status = 'succeeded';
  state.reports = action.payload.reports;
})
.addCase(getAllReports.rejected, (state, action) => {
  state.loading = false;
  state.status = 'failed';
  state.error = action.error.message;
})
 .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.reports = state.reports.filter(report => report._id !== action.payload._id);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      });


  }
});

export default postsSlice.reducer;
