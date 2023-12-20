import React, { useState, useCallback } from 'react';
import blogService from '../services/blogs';

const Blog = React.memo(({ blog, showNotification, userBlogs, deleteBlog, addLike }) => {
   const [isView, setIsView] = useState(false);
   const [likes, setLikes] = useState(blog.likes);

   const toggleView = () => {
      setIsView((prevIsView) => !prevIsView);
   };
   const handleAddLike = async () => {
      try {
         setLikes((prevLikes) => prevLikes + 1);
         await addLike(blog._id);
      } catch (error) {
         showNotification('error', 'Error dernning like to blog !');
         setLikes((prevLikes) => prevLikes + 1);
      }
   };

   const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
   };
   const deleteButtonStyle = {
      backgroundColor: '#ff6347',
      color: '#fff',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
   };

   deleteButtonStyle[':hover'] = {
      backgroundColor: '#d32f2f',
   };
   return (
      <div className="blog" style={blogStyle}>
         <p className="title">
            {blog.title} {!isView && blog.user}{' '}
            <button className="toggle-blog-view" onClick={toggleView}>
               {isView ? 'hide' : 'view'}
            </button>
         </p>
         {isView && (
            <>
               <a href={blog.url}>{blog.url}</a>
               <p>
                  likes <span className="likes-count">{likes}</span> <button onClick={handleAddLike}>like</button>
               </p>
               <p>{blog.user}</p>
               {userBlogs.includes(blog._id) && (
                  <button onClick={() => deleteBlog(blog._id, blog.title)} style={deleteButtonStyle}>
                     delete
                  </button>
               )}
            </>
         )}
      </div>
   );
});
Blog.displayName = 'Blog';
export default Blog;
