import React, { useState } from 'react';

const BlogForm = ({ createBlog }) => {
   const [formData, setFormData] = useState({ title: '', url: '' });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await createBlog(formData);
         if (response && response.status === 'success') {
            setFormData({ title: '', url: '' });
         }
      } catch (error) {
         console.error('Error creating blog:', error);
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <h1>Create New</h1>
         <label htmlFor="title">Title:</label>
         <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />

         <br />
         <label htmlFor="url">URL:</label>
         <input type="text" id="url" name="url" value={formData.url} onChange={handleChange} />
         <br />
         <button type="submit">Create</button>
      </form>
   );
};

export default BlogForm;
