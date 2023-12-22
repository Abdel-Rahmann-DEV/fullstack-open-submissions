// notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
   name: 'notification',
   initialState: { message: null , timeoutId: null},
   reducers: {
      setNotification: (state, action) => {
         state.message = action.payload.message;
      },
      removeNotification: (state) => {
         state.message = null;
         if (state.timeoutId) {
            clearTimeout(state.timeoutId);
            state.timeoutId = null;
          }
      },
      setNotificationTimeoutId: (state, action) => {
         state.timeoutId = action.payload;
       },
   },
});

export const { removeNotification } = notificationSlice.actions;

export const setNotification = (message, timeout = 3000) => (dispatch, getState) => {
   const {notification} = getState();
   if (notification.timeoutId) {
     clearTimeout(notification.timeoutId);
   }
   const timeoutId = setTimeout(() => {
     dispatch(removeNotification());
   }, timeout);
   dispatch(notificationSlice.actions.setNotification(message));
   dispatch(notificationSlice.actions.setNotificationTimeoutId(timeoutId));
 };
 

export default notificationSlice.reducer;
