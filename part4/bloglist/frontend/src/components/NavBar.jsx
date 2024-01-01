import React from 'react';
import { Link } from 'react-router-dom';
import User from './User';
const NavBar = () => {
   const navStyle = {
      backgroundColor: '#eee',
      display: 'flex',
      justifyContent: 'space-between',
      aliginItems: 'center',
      gap: '10px',
   };
   const navBar = {
      listStyle: 'none',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '10px',
   };
   return (
      <div style={navStyle}>
         <ul style={navBar}>
            <li>
               <Link to='/'>Home</Link>
            </li>
            <li>
               <Link to='/users'>Users</Link>
            </li>
         </ul>
         <User />
      </div>
   );
};

export default NavBar;
