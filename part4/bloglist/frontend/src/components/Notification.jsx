import React from 'react';
import { useSelector } from 'react-redux';
const Notification = ({ type, message }) => {
   const notification = useSelector((state) => state.notification);
   if (!notification.message) return null;

   const notificationStyle = {
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      color: '#fff',
      fontWeight: 'bold',
   };

   if (notification.type === 'error') {
      notificationStyle.backgroundColor = '#ff5252';
   } else if (notification.type === 'success') {
      notificationStyle.backgroundColor = '#4caf50';
   }

   return (
      <div className={'NF-' + type} style={notificationStyle}>
         {notification.message}
      </div>
   );
};

export default Notification;
