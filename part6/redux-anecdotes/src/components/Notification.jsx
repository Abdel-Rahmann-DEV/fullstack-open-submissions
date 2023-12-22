import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../reducers/notificationReducer';
const Notification = () => {
   const message = useSelector((state) => state.notification.message);
   const dispatch = useDispatch();

   if (!message) {
      return null;
   }
   const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1,
   };
   return (
      <div style={style}>
         <p>{message}</p>
         <button onClick={() => dispatch(removeNotification())}>Dismiss</button>
      </div>
   );
};
export default Notification;
