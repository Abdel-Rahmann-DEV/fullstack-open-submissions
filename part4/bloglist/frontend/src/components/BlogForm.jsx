import React, { useRef, useState } from 'react';
import { createNewBlog } from '../reducers/blogsSlice';
import { useDispatch } from 'react-redux';
import Togglable from './Toggel';
const BlogForm = () => {
   const dispatch = useDispatch();
   const [formData, setFormData] = useState({ title: '', url: '' });
   const newBlogFormRef = useRef();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(createNewBlog(formData));
      newBlogFormRef.current.toggleVisibility();
   };

   return (
      <Togglable buttonLabel='new blog' ref={newBlogFormRef}>
         <form onSubmit={handleSubmit}>
            <h1>Create New</h1>
            <label htmlFor='title'>Title:</label>
            <input
               type='text'
               id='title'
               name='title'
               value={formData.title}
               onChange={handleChange}
            />

            <br />
            <label htmlFor='url'>URL:</label>
            <input
               type='text'
               id='url'
               name='url'
               value={formData.url}
               onChange={handleChange}
            />
            <br />
            <button type='submit'>Create</button>
         </form>
      </Togglable>
   );
};

export default BlogForm;
