import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usersServices from '../services/users';

const initialState = {
   data: [],
   status: 'idle',
   fetchUserStatus: 'idle',
   error: null,
};

export const initializeUsers = createAsyncThunk(
   'users/initializeUsers',
   async () => {
      const data = await usersServices.allUsers();
      return data;
   },
);

export const fetchUserById = createAsyncThunk(
   'users/fetchUserById',
   async (userId, { rejectWithValue }) => {
      try {
         const user = await usersServices.getUserById(userId);
         return user;
      } catch (error) {
         // If the user is not found on the server, reject with an error message
         return rejectWithValue('User not found');
      }
   },
);

const usersSlice = createSlice({
   name: 'users',
   initialState,
   reducers: {
      addNewBlogToCurrUser: (state, action) => {
         const { blogId, userId } = action.payload;
         const updatedState = state.data.map((e) => {
            if (e.id === userId) {
               return { ...e, blogs: [...e.blogs, blogId] };
            } else {
               return e;
            }
         });
         state.data = updatedState;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(initializeUsers.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(initializeUsers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const currData = [...action.payload, ...state.data];

            state.data = currData.sort(
               (a, b) => b.blogs.length - a.blogs.length,
            );
         })
         .addCase(initializeUsers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })
         .addCase(fetchUserById.pending, (state) => {
            state.fetchUserStatus = 'loading';
         })
         .addCase(fetchUserById.fulfilled, (state, action) => {
            state.fetchUserStatus = 'succeeded';
            // Add the fetched user to the state
            state.data.push(action.payload);
         })
         .addCase(fetchUserById.rejected, (state, action) => {
            state.fetchUserStatus = 'failed';
            // Handle the error (user not found)
            console.error('Error fetching user data:', action.error);
         });
   },
});

export const { addNewBlogToCurrUser } = usersSlice.actions;

export default usersSlice.reducer;
