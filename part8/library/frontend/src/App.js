import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import './style.css';
import LoginForm from './components/LoginForm';
import Recommend from './components/Recommend';
import { GET_BOOKS, GET_AUTHORS } from './queries';

const App = () => {
   const [token, setToken] = useState(null);
   const client = useApolloClient();

   

   useEffect(() => {
      const storedToken = window.localStorage.getItem('token');
      if (storedToken) {
         setToken(storedToken);
      }
   }, []);

   const handleLogOut = () => {
      const shouldLogout = window.confirm('Are you sure you want to logout?');
      if (shouldLogout) {
         setToken(null);
         window.localStorage.removeItem('token');
         client.resetStore();
      }
   };

   return (
      <div>
         <ul className="nav">
            <li>
               <Link to="/">Books</Link>
            </li>
            <li>
               <Link to="/authors">Authors</Link>
            </li>
            {token && (
               <>
                  <li>
                     <Link to="/addNewBook">Add Book</Link>
                  </li>
                  <li>
                     <Link to="/recommend">Recommend</Link>
                  </li>
                  <li>
                     <button onClick={handleLogOut}>Logout</button>
                  </li>
               </>
            )}
            {!token && (
               <li>
                  <Link to="/login">Login</Link>
               </li>
            )}
         </ul>

         <Routes>
            <Route path="/" element={<Books />} />
            <Route path="authors" element={<Authors token={token} />} />
            <Route path="login" element={<LoginForm setToken={setToken} token={token} />} />
            <Route path="recommend" element={<Recommend token={token} />} />
            <Route path="addNewBook" element={token ? <NewBook /> : <Navigate to="/login" replace />} />
         </Routes>
      </div>
   );
};

export default App;
