import { createContext, useReducer, useRef } from 'react';

const SET_NOTIFICATION = 'SET_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';


const setNotification = (dispatch, message, timeout = 5000) => {
   dispatch({ type: SET_NOTIFICATION, message });

   setTimeout(() => {
      dispatch({ type: REMOVE_NOTIFICATION });
   }, timeout);
};

const removeNotification = (dispatch) => {
   dispatch({ type: REMOVE_NOTIFICATION });
};

function notificationReducer(state, action) {
   switch (action.type) {
      case SET_NOTIFICATION:
         return { ...state, message: action.message };

      case REMOVE_NOTIFICATION:
         return { ...state, message: null };

      default:
         return state;
   }
}

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
   const [state, dispatch] = useReducer(notificationReducer, { message: null });

   const contextValue = {
      state,
      setNotification: (message, timeout) => setNotification(dispatch, message, timeout),
      removeNotification: () => removeNotification(dispatch),
   };

   return <NotificationContext.Provider value={contextValue}>{props.children}</NotificationContext.Provider>;
};

export default NotificationContext;
