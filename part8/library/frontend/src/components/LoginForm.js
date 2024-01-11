import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setToken, token }) => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();
   const [login, { loading, error }] = useMutation(LOGIN, {
      onError: (err) => {
         console.error('Login error:', err);
      },
      onCompleted: (data) => {
         console.log('Login succeeded!', data);
         const newToken = data.login.value;
         setToken(newToken);
         localStorage.setItem('token', newToken);
         setUsername('');
         setPassword('');
      },
   });

   useEffect(() => {
      if (token) {
         navigate('/');
      }
   }, [token, navigate]);

   const handleSubmit = (e) => {
      e.preventDefault();
      login({ variables: { username, password } });
   };

   return (
      <form onSubmit={handleSubmit}>
         <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
         </label>
         <br />
         <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
         </label>
         <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
         </button>
      </form>
   );
};

export default LoginForm;
