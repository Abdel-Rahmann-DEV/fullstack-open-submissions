import React, { useState, useEffect } from 'react';
import Blogs from './components/Blogs';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Toggel';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users'
import { useRef } from 'react';

const App = () => {
   const [blogs, setBlogs] = useState([]);
   const [loggedData, setLoggedData] = useState(null);
   const [notification, setNotification] = useState(null);
   const [userBlogs, setUserBlogs] = useState([]);
   const newBlogFormRef = useRef();

   useEffect(() => {
      blogService.getAll().then((blogs) => {
         const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
         setBlogs(sortedBlogs);
      });
   }, []);

   useEffect(() => {
      const storedUser = window.localStorage.getItem('user');
      if (storedUser) {
         const data = JSON.parse(storedUser);
         setLoggedData(data);
         blogService.setToken(data.token);
         userService.userBlog(data.userData._id).then((blogs) => {
            setUserBlogs(blogs);
         });
      }
   }, []);

   const showNotification = (type, message) => {
      setNotification({ type, message });

      setTimeout(() => {
         setNotification(null);
      }, 4000);
   };

   const handleLogin = async (payload) => {
      try {
         const data = await loginService.login(payload);
         setLoggedData(data);
         blogService.setToken(data.token);
         window.localStorage.setItem('user', JSON.stringify(data));
         showNotification('success', `${data.userData.name} signed in successfully!`);
         return { status: 'success' };
      } catch (error) {
         showNotification('error', 'Invalid username or password');
         console.error('Error during login:', error);
         return { status: 'error' };
      }
   };

   const handleLogOut = () => {
      setLoggedData(null);
      window.localStorage.removeItem('user');
      showNotification('success', 'Logged out successfully!');
   };

   const handleCreateBlog = async (payload) => {
      try {
         const newBlog = await blogService.create(payload);
         setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
         setUserBlogs([...userBlogs, newBlog._id])
         showNotification('success', `A new blog "${payload.title}" added`);
         newBlogFormRef.current.toggleVisibility();
         return { status: 'success' };
      } catch (error) {
         showNotification('error', 'Error creating blog');
         console.error('Error creating blog:', error);
         return { status: 'error' };
      }
   };
   const addLike = async (id) => {
      await blogService.like(id);
   };
   const deleteBlog = async (id, blogTitle) => {
      const confirmed = window.confirm(`Remove blog "${blogTitle}"`);
      try {
         if (confirmed) {
            await blogService.deleteBlog(id);
            setBlogs(blogs.filter((e) => e._id !== id));
            showNotification('success', 'blog removed successfully');
         }
      } catch (error) {
         showNotification('error', 'error when deleting blog ?!');
      }
   };
   const blogsForm = () =>
      loggedData && (
         <Togglable buttonLabel="new blog" ref={newBlogFormRef}>
            <BlogForm createBlog={handleCreateBlog} />
         </Togglable>
      );

   return (
      <div>
         <h1>Blogs</h1>
         {notification && <Notification type={notification.type} message={notification.message} />}
         {blogsForm()}
         {loggedData ? <Blogs addLike={addLike} username={loggedData.userData.name} blogs={blogs} handleLogOut={handleLogOut} showNotification={showNotification} userBlogs={userBlogs} deleteBlog={deleteBlog} /> : <LoginForm handleLogin={handleLogin} />}
      </div>
   );
};

export default App;
