import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';
const initialState = { data: null, status: 'idle', error: null, isAuth: false };

const userAccountSlice = createSlice({
   name: 'userAccount',
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.isAuth = true;
         state.data = action.payload;
      },
      setUserBlogs: (state, action) => {
         state.data.userBlogs = action.payload;
      },
      addBlogToUser: (state, action) => {
         state.data.userBlogs = [...state.data.userBlogs, action.payload];
      },

      logout: (state, action) => {
         state.isAuth = false;
         state.data = null;
      },
   },
});

export const { setUser, setUserBlogs, addBlogToUser, logout } =
   userAccountSlice.actions;

export const getUserBlogs = (id) => {
   return async (dispatch) => {
      const data = await userService.getUserBlogs(id);
      dispatch(setUserBlogs(data));
   };
};

export default userAccountSlice.reducer;
