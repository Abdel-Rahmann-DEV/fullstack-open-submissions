import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogServices from '../services/blogs';
import { addBlogToUser } from './userAccountSlice';
import { loginLocally } from './loginSlice';
import { setNotification } from './notificationSlice';
import { addNewBlogToCurrUser } from './usersSlice';

const initialState = {
   data: [],
   status: 'idle',
   fetchBlogStatus: 'idle',
   error: null,
};

export const initializeBlogs = createAsyncThunk(
   'blogs/initializeBlogs',
   async () => {
      const data = await blogServices.getAll();
      return data;
   },
);

export const fetchBlogById = createAsyncThunk(
   'blogs/fetchBlogById',
   async (id, { rejectWithValue }) => {
      try {
         const blog = await blogServices.getBlogById(id);
         return blog;
      } catch (error) {
         return rejectWithValue('Blog not found');
      }
   },
);
export const addComment = createAsyncThunk('blogs/addComment', async (data) => {
   const blog = await blogServices.addComment(data);
   return blog;
});

export const createNewBlog = createAsyncThunk(
   'blogs/createNewBlog',
   async (content, { dispatch, rejectWithValue }) => {
      try {
         const data = await blogServices.createNew(content);
         dispatch(addBlogToUser(data.id));
         dispatch(
            addNewBlogToCurrUser({ blogId: data.id, userId: data.user.id }),
         );
         dispatch(
            setNotification({
               message: `A new blog "${content.title}" added`,
               type: 'success',
            }),
         );
         return data;
      } catch (error) {
         dispatch(
            setNotification({ message: 'Error creating blog', type: 'error' }),
         );
         return rejectWithValue(error.message);
      }
   },
);

export const like = createAsyncThunk('blogs/like', async (id, { dispatch }) => {
   try {
      dispatch(addLike({ id }));
      dispatch(setNotification({ type: 'success', message: 'Added like' }));
      await blogServices.setLike(id);
      return { id };
   } catch (error) {
      console.log(error);
      dispatch(removeLike({ id }));
      dispatch(
         setNotification({
            type: 'error',
            message: 'Error adding like to blog !',
         }),
      );
      throw error;
   }
});

export const removeBlog = createAsyncThunk(
   'blogs/removeBlog',
   async (id, { dispatch }) => {
      try {
         await blogServices.deleteBlog(id);
         dispatch(
            setNotification({
               message: 'blog removed successfully',
               type: 'success',
            }),
         );
         return { id };
      } catch (err) {
         dispatch(
            setNotification({
               message: 'error when deleting blog ?!',
               type: 'error',
            }),
         );
      }
   },
);

const blogsSlice = createSlice({
   name: 'blogs',
   initialState,
   reducers: {
      addLike: (state, action) => {
         const { id } = action.payload;
         const blogToChange = state.data.find((blog) => blog.id === id);
         if (blogToChange) {
            blogToChange.likes += 1;
         }
         state.data.sort((a, b) => b.likes - a.likes);
      },
      removeLike: (state, action) => {
         const { id } = action.payload;
         const blogToChange = state.data.find((blog) => blog.id === id);
         if (blogToChange) {
            blogToChange.likes -= 1;
         }
         state.data.sort((a, b) => b.likes - a.likes);
      },

      appendNew: (state, action) => {
         state.data.push(action.payload);
         state.data.sort((a, b) => b.likes - a.likes);
      },
      setBlogs: (state, action) => {
         state.data = action.payload.sort((a, b) => b.likes - a.likes);
         state.status = 'succeeded';
      },
      deleteOne: (state, action) => {
         const { id } = action.payload;
         state.data = state.data.filter((e) => e.id !== id);
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(initializeBlogs.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(initializeBlogs.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload.sort((a, b) => b.likes - a.likes);
         })
         .addCase(initializeBlogs.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })
         .addCase(createNewBlog.fulfilled, (state, action) => {
            state.data.push(action.payload);
         })
         .addCase(removeBlog.fulfilled, (state, action) => {
            const { id } = action.payload;
            state.data = state.data.filter((e) => e.id !== id);
         })
         .addCase(fetchBlogById.pending, (state) => {
            state.fetchBlogStatus = 'loading';
         })
         .addCase(fetchBlogById.fulfilled, (state, action) => {
            state.fetchBlogStatus = 'succeeded';
            state.data.push(action.payload);
            state.data = state.data.sort((a, b) => b.likes - a.likes);
         })
         .addCase(fetchBlogById.rejected, (state, action) => {
            state.fetchBlogStatus = 'failed';
            console.error('Error fetching blog data:', action.error);
         })
         .addCase(addComment.fulfilled, (state, action) => {
            const newBlog = action.payload;
            state.data = state.data.map((e) =>
               e.id === newBlog.id ? newBlog : e,
            );
         });
   },
});

export const { addLike, appendNew, setBlogs, removeLike, deleteOne } =
   blogsSlice.actions;

export default blogsSlice.reducer;
