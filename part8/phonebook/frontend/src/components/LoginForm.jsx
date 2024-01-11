import React, { useState } from 'react';
import { LOGIN } from '../queries';
import { useMutation } from '@apollo/client';

const LoginForm = ({ setError, setToken }) => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const [login, { data, loading, error }] = useMutation(LOGIN, {
      onError: (error) => {
         console.log('error');
         const messages = error.graphQLErrors.map((e) => e.message).join('\n');
         setError(messages);
      },
      onCompleted: (data) => {
         console.log('login successeded!', data);
         const token = data.login.value;
         setToken(token);
         localStorage.setItem('phonenumbers-user-token', token);
         setUsername('');
         setPassword('');
      },
   });
   const handleSubmit = async (e) => {
      e.preventDefault();
      login({ variables: { username, password } });
   };
   return (
      <form onSubmit={handleSubmit}>
         username: <input type="text" onChange={({ target }) => setUsername(target.value)} value={username} />
         <br />
         password: <input type="text" onChange={({ target }) => setPassword(target.value)} value={password} />
         <button type="submit">Login</button>
      </form>
   );
};

export default LoginForm;
