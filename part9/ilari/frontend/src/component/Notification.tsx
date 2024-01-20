import React from 'react';

interface NotificationProps {
   type: 'success' | 'error';
   message: string;
   isNotify: boolean;
}
const Notification: React.FC<NotificationProps> = ({ type, message, isNotify }) => {
   const style = type === 'success' ? { color: 'green' } : { color: 'red' };
   if (!isNotify) {
      return null;
   }
   return <p style={style}>{message}</p>;
};

export default Notification;
