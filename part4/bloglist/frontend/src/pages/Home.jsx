import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BlogForm from '../components/BlogForm';
import Blogs from '../components/Blogs';
import { initializeBlogs } from '../reducers/blogsSlice';
import LoginForm from '../components/LoginForm';
const Home = () => {
   const dispatch = useDispatch();
   const { isAuth } = useSelector((state) => state.userAccount);

   const { status, error } = useSelector((state) => state.blogs);
   useEffect(() => {
      if (status === 'idle') {
         console.log('fetch blogs!');
         dispatch(initializeBlogs());
      }
   }, [status, dispatch]);

   if (status === 'loading') {
      return <p>Loading...</p>;
   }
   if (status === 'faild') {
      return <p>Error: {error}</p>;
   }

   return (
      <div>
         <h1>blog app</h1>
         {isAuth ? (
            <>
               <BlogForm />
               <Blogs />
            </>
         ) : (
            <LoginForm />
         )}
      </div>
   );
};

export default Home;
