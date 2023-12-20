import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ type, message }) => {
   const notificationStyle = {
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      color: '#fff',
      fontWeight: 'bold',
   };

   if (type === 'error') {
      notificationStyle.backgroundColor = '#ff5252';
   } else if (type === 'success') {
      notificationStyle.backgroundColor = '#4caf50';
   }

   return (
      <div className={'NF-' + type} style={notificationStyle}>
         {message}
      </div>
   );
};

Notification.propTypes = {
   type: PropTypes.oneOf(['error', 'success']).isRequired,
   message: PropTypes.string.isRequired,
};

export default Notification;
