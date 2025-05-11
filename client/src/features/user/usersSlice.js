import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  updateuserAPI,
  getuserprofileAPI,
  getpostsAPI,
  getbookmarkAPI,
  addbookmarkAPI,
  removebookmarkAPI,
  getyouruserAPI,
  searchuserAPI,
  getallusersAPI,
  deleteuserAPI
} from './userAPI';

export const updateUser = createAsyncThunk('user/updateUser', updateuserAPI);
export const getUserProfile = createAsyncThunk('user/getUserProfile', getuserprofileAPI);
export const getYourUser = createAsyncThunk('user/getYourProfile', getyouruserAPI);
export const getAllPosts = createAsyncThunk('posts/getAll', getpostsAPI);
export const getBookmarks = createAsyncThunk('bookmarks/get', getbookmarkAPI);
export const addBookmark = createAsyncThunk('bookmarks/add', addbookmarkAPI);
export const removeBookmark = createAsyncThunk('bookmarks/remove', removebookmarkAPI);
export const searchUser = createAsyncThunk('user/search', searchuserAPI);
export const getallusers = createAsyncThunk('user/getall', getallusersAPI);
export const deleteuser=createAsyncThunk('user/delete',deleteuserAPI)

const initialState = {
  myuser: null,
  user: null,
  posts: [],
  bookmarks: [],
  likedposts: [],
  searchedusers:[],
  Likesreceived:0,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.user = null;
      state.searchedusers=[];
      state.myuser = null;
      state.posts = [];
      state.bookmarks = [];
      state.likedposts = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.myuser = action.payload;
        state.likedposts = state.likedposts || [];
        state.bookmarks = state.bookmarks || [];
        state.Likesreceived=state.Likesreceived||[];
        state.searchedusers=state.searchedusers||[];

      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        console.log("Payload from getUserProfile:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.likedposts = action.payload.likedPosts;
        state.posts = action.payload.allPosts;
        state.Likesreceived=action.payload.Likesreceived;
        state.searchedusers=state.searchedusers||[];

      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getYourUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getYourUser.fulfilled, (state, action) => {
        state.loading = false;
        state.myuser = action.payload.user;
        state.likedposts = state.likedposts || [];
        state.bookmarks = state.bookmarks || [];
        state.Likesreceived=state.Likesreceived||[];
        state.searchedusers=state.searchedusers||[];

      })
      .addCase(getYourUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.likedposts = state.likedposts || [];
        state.bookmarks = state.bookmarks || [];
        state.Likesreceived=state.Likesreceived||[];
        state.searchedusers=state.searchedusers||[];

      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload;
        state.likedposts = state.likedposts || [];
        state.posts = state.posts || [];
        state.Likesreceived=state.Likesreceived||[];
        state.searchedusers=state.searchedusers||[];

      })
      .addCase(getBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.push(action.payload);
        state.likedposts = state.likedposts || [];
        state.posts = state.posts || [];
        state.Likesreceived=state.Likesreceived||[];
        state.searchedusers=state.searchedusers||[];

      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(
          (bookmark) => bookmark._id !== action.payload._id
        );
      })
      .addCase(searchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = state.user ||[];
        state.myuser = state.myuser||[]
        state.likedposts = state.likedposts || [];
        state.bookmarks = state.bookmarks || [];
        state.Likesreceived=state.Likesreceived||[];
        state.searchedusers=action.payload.users;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getallusers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallusers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchedusers = action.payload || [];
        state.user=action.payload;
      })
      .addCase(getallusers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteuser.fulfilled, (state, action) => {
        state.loading = false;
        state.searchedusers = state.searchedusers.filter(
          (user) => user._id !== action.payload.userId
        );
      })
      .addCase(deleteuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

  },
});

export const { clearUserState } = usersSlice.actions;
export default usersSlice.reducer;
