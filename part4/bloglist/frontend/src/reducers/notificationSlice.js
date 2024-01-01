import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
   name: 'notification',
   initialState: { message: null, timeoutId: null, type: '' },
   reducers: {
      setNotificationAction: (state, action) => {
         const { message, type } = action.payload;
         state.message = message;
         state.type = type;
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

export const {
   removeNotification,
   setNotificationTimeoutId,
   setNotificationAction,
} = notificationSlice.actions;

export const setNotification =
   (message, timeout = 3000) =>
   (dispatch, getState) => {
      const { notification } = getState();
      if (notification.timeoutId) {
         clearTimeout(notification.timeoutId);
      }
      const timeoutId = setTimeout(() => {
         dispatch(removeNotification());
      }, timeout);
      dispatch(setNotificationAction(message));
      dispatch(setNotificationTimeoutId(timeoutId));
   };

export default notificationSlice.reducer;
