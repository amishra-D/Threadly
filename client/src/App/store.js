import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postsSlice';
import userReducer from '../features/user/usersSlice';
import boardReducer from '../features/boards/boardsSlice';
import commentReducer from '../features/comments/commentsSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts:postReducer,
    user:userReducer,
    boards:boardReducer,
    comments:commentReducer
  },
});
