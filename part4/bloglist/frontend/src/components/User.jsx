import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/loginSlice';

const User = () => {
   const dispatch = useDispatch();
   const { data: userAccount, isAuth } = useSelector(
      (state) => state.userAccount,
   );
   const style = {
      listStyle: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
   };
   if (!isAuth) return null;

   return (
      <div style={style}>
         {userAccount.userData.name} logged in
         <button onClick={() => dispatch(logout())}>logout</button>
      </div>
   );
};

export default User;
