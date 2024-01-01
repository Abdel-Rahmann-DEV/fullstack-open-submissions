import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserById } from '../reducers/usersSlice';

const SingleUser = () => {
   const { id } = useParams();
   const dispatch = useDispatch();

   const user = useSelector((state) =>
      state.users.data.find((e) => e.id === id),
   );
   const status = useSelector((state) => state.users.fetchUserStatus);

   useEffect(() => {
      const fetchUserData = async () => {
         if (!user && status === 'idle') {
            dispatch(fetchUserById(id));
         }
      };

      fetchUserData();
   }, [dispatch, id, user, status]);

   let content;
   if (status === 'loading') {
      content = <p>Loading...</p>;
   } else if (status === 'succeeded' || (status === 'idle' && user)) {
      const blogs = user.blogs || [];
      content = (
         <div>
            <h2>{user.name}</h2>
            {!blogs.length ? (
               <p>No blogs created yet!</p>
            ) : (
               <>
                  <h3>added blogs</h3>
                  <ul>
                     {blogs.map((blog) => (
                        <li key={blog.id}>
                           <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                        </li>
                     ))}
                  </ul>
               </>
            )}
         </div>
      );
   } else if (status === 'failed') {
      content = <p style={{ color: 'red' }}>This account does not exist</p>;
   }

   return <>{content}</>;
};

export default SingleUser;
