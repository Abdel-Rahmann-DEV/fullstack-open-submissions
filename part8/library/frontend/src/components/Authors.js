import React from 'react';
import {  useQuery } from '@apollo/client';
import { GET_AUTHORS } from '../queries';
import AuthorBrithYearForm from './AuthorBrithYearForm';
const Authors = ({ token }) => {
   const { data, loading, error } = useQuery(GET_AUTHORS);
   console.log(error);

   if (loading) {
      return <p>Loading ...</p>;
   }
   if (error) {
      return <p style={{ color: 'red' }}>Error: {error.message}</p>;
   }

   return (
      <div>
         <h2>authors</h2>
         <table>
            <tbody>
               <tr>
                  <th></th>
                  <th>born</th>
                  <th>books</th>
               </tr>
               {data.allAuthors.map((a) => (
                  <tr key={a.id}>
                     <td>{a.name}</td>
                     <td>{a.born}</td>
                     <td>{a.bookCount}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         <hr />
         <AuthorBrithYearForm token={token} />
      </div>
   );
};

export default Authors;
