import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initializeUsers } from '../reducers/usersSlice';
import { Link } from 'react-router-dom';
function Users() {
   const { data: users, status, error } = useSelector((state) => state.users);
   const dispatch = useDispatch();
   useEffect(() => {
      if (status === 'idle') {
         console.log('fetch users!');
         dispatch(initializeUsers());
      }
   }, [dispatch, status]);

   if (status === 'loading') {
      return <p>Loading Users...</p>;
   } else if (status === 'failed') {
      return <p>error{error}</p>;
   }
   return (
      <div>
         <h1>Users</h1>
         <table>
            <thead>
               <tr>
                  <th>userName</th>
                  <th>blogs created</th>
               </tr>
            </thead>
            <tbody>
               {users.map((user) => (
                  <tr key={user.id}>
                     <td>
                        <Link to={`/users/${user.id}`} state={user}>
                           {user.name}
                        </Link>
                     </td>
                     <td>{user.blogs.length}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default Users;
