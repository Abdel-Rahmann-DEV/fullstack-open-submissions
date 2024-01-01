import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../reducers/loginSlice';
import { setNotification } from '../reducers/notificationSlice';
function LoginForm() {
   const dispatch = useDispatch();
   const [formData, setFormData] = useState({
      username: '',
      password: '',
   });

   const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
         ...prevFormData,
         [name]: value,
      }));
   };
   const handleSubmit = async (event) => {
      event.preventDefault();
      try {
         const actoin = await dispatch(login(formData));
         const user = actoin.payload;
         dispatch(
            setNotification({
               message: `${user.userData.name} signed in successfully!`,
               type: 'success',
            }),
         );
         setFormData({ username: '', password: '' });
      } catch (error) {
         dispatch(
            setNotification({
               message: 'Invalid username or password',
               type: 'error',
            }),
         );
         console.error('Error during login:', error);
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <h1>Log in to application</h1>
         <label htmlFor='username'>Username</label>
         <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='password'>Password</label>
         <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
         />
         <br />
         <button type='submit'>Login</button>
      </form>
   );
}

export default LoginForm;
