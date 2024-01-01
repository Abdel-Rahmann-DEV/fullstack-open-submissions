import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogsService from '../services/blogs';
import { setUser, getUserBlogs } from './userAccountSlice';
import { setNotification } from './notificationSlice';
import { logout as logoutFromState } from './userAccountSlice';
const initialState = [];

export const login = createAsyncThunk(
   'login/login',
   async (content, { dispatch }) => {
      try {
         const data = await loginService.login(content);
         dispatch(setUser(data));
         dispatch(getUserBlogs(data.userData.id));
         blogsService.setToken(data.token);

         // add user to local storage
         const stringifiedData = JSON.stringify(data);
         window.localStorage.setItem('user', stringifiedData);
         return data;
      } catch (error) {
         console.error('Error during login:', error);
         throw error;
      }
   },
);

export const logout = createAsyncThunk(
   'login/logout',
   async (_, { dispatch }) => {
      console.log('logout..');

      dispatch(logoutFromState());
      window.localStorage.removeItem('user');
      dispatch(
         setNotification({
            message: 'Logged out successfully!',
            type: 'success',
         }),
      );
   },
);

export const loginLocally = createAsyncThunk(
   'login/loginLocally',
   async (content, { dispatch }) => {
      dispatch(setUser(content));
      dispatch(getUserBlogs(content.userData.id));
      blogsService.setToken(content.token);
   },
);

const loginSlice = createSlice({
   name: 'login',
   initialState,
   reducers: {
      setLike: (state, action) => {
         const { id } = action.payload;
         const blogToChange = state.find((blog) => blog.id === id);
         if (blogToChange) {
            blogToChange.likes += 1;
         }
         state.sort((a, b) => b.likes - a.likes);
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(login.fulfilled, (state, action) => {})
         .addCase(logout.fulfilled, (state, action) => {});
   },
});

export const { setLike, appendNew, setBlogs } = loginSlice.actions;

export const checkUserAuth = () => async (dispatch) => {
   const localUser = window.localStorage.getItem('user');
   if (localUser) {
      dispatch(loginLocally(JSON.parse(localUser)));
   }
};

export default loginSlice.reducer;
