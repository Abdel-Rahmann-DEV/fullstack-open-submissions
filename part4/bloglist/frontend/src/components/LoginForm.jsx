import React, { useState } from 'react';
import PropTypes from 'prop-types';

function LoginForm({ handleLogin }) {
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
      const response = await handleLogin(formData);
      if (response.status === 'success') {
         setFormData({ username: '', password: '' });
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <h1>Log in to application</h1>
         <label htmlFor="username">Username</label>
         <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} />
         <br />
         <label htmlFor="password">Password</label>
         <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
         <br />
         <button type="submit">Login</button>
      </form>
   );
}

LoginForm.propTypes = {
   handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
