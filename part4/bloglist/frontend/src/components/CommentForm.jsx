import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../reducers/blogsSlice';
const CommentForm = ({ blogId }) => {
   const dispatch = useDispatch();
   const [formData, setFormData] = useState({ text: '' });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(addComment({ ...formData, id: blogId }));
      setFormData({ text: '' });
   };

   return (
      <form onSubmit={handleSubmit}>
         <h1>Create New</h1>
         <input
            type='text'
            id='title'
            name='text'
            value={formData.text}
            onChange={handleChange}
         />

         <button type='submit'>add comment</button>
      </form>
   );
};

export default CommentForm;
