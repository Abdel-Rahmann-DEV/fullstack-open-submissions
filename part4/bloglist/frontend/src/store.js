import { configureStore } from '@reduxjs/toolkit';
import notificationSlice from './reducers/notificationSlice';
import blogsSlice from './reducers/blogsSlice';
import userAccountSlice from './reducers/userAccountSlice';
import usersSlice from './reducers/usersSlice';
const store = configureStore({
   reducer: {
      notification: notificationSlice,
      blogs: blogsSlice,
      userAccount: userAccountSlice,
      users: usersSlice,
   },
});
console.log(store.getState());

export default store;
