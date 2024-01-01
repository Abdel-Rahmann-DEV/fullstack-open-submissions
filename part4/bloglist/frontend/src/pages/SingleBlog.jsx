import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { like, removeBlog, fetchBlogById } from '../reducers/blogsSlice';
import CommentForm from '../components/CommentForm';

const SingleBlog = () => {
   const { id } = useParams();
   const dispatch = useDispatch();
   const blog = useSelector((state) =>
      state.blogs.data.find((e) => e.id === id),
   );
   const status = useSelector((state) => state.blogs.fetchBlogStatus);
   const { isAuth, data: user } = useSelector((state) => state.userAccount);

   useEffect(() => {
      const fetchData = async () => {
         if (!blog && status === 'idle') {
            console.log('fetch blog from server!');
            dispatch(fetchBlogById(id));
         }
      };

      fetchData();
   }, [dispatch, id, blog, status]);

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

   const handleDeleteBlog = async () => {
      const confirmed = window.confirm(`Remove blog "${blog.title}"`);
      if (confirmed) {
         dispatch(removeBlog(blog.id));
      }
   };

   let content;
   if (status === 'loading') {
      content = <p>Loading...</p>;
   } else if (status === 'succeeded' || (status === 'idle' && blog)) {
      content = (
         <div>
            <h3>{blog.title}</h3>
            <a href={blog.url}>{blog.url}</a>
            <br />
            <span className='likes-count'>{blog.likes}</span> likes
            <button onClick={() => dispatch(like(blog.id))}>like</button>
            <br />
            added by {blog.user.name}
            {isAuth && user.userData.id === blog.user.id && (
               <button onClick={handleDeleteBlog} style={deleteButtonStyle}>
                  delete
               </button>
            )}
            <h3>comments</h3>
            <CommentForm blogId={blog.id} />
            <ul>
               {blog.comments.map((e, i) => (
                  <li key={i}>{e.text}</li>
               ))}
            </ul>
         </div>
      );
   } else if (status === 'failed') {
      content = (
         <p style={{ color: 'red' }}>
            Error: {blog ? 'Blog not found' : 'Loading failed'}
         </p>
      );
   } else {
      content = <p>Error: Unknown state</p>;
   }

   return <>{content}</>;
};

export default SingleBlog;
