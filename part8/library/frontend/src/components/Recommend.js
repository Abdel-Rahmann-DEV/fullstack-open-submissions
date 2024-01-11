import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKS, ME } from '../queries';

const Recommend = ({ token }) => {
   const { data: meData, loading: meLoading, error: meError } = useQuery(ME);
   const favoriteGenre = meData?.me?.favoriteGenre;

   const {
      data: bookData,
      loading: bookLoading,
      error: bookError,
   } = useQuery(GET_BOOKS, {
      variables: { genre: favoriteGenre },
   });

   if (!token) {
      return <p>Please log in to see your recommended books.</p>;
   }

   if (meLoading || bookLoading) {
      return <p>Loading...</p>;
   }

   if (meError || bookError) {
      return <p style={{ color: 'red' }}>Error occurred while fetching data.</p>;
   }

   const books = bookData?.allBooks || [];

   if (books.length === 0) {
      return (
         <div>
            <p>No books found in your favorite genre: {favoriteGenre}</p>
         </div>
      );
   }

   return (
      <div>
         <p>
            Books in your favorite genre <b>{favoriteGenre}</b>
         </p>
         <table>
            <thead>
               <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Published</th>
               </tr>
            </thead>
            <tbody>
               {books.map((book) => (
                  <tr key={book.title}>
                     <td>{book.title}</td>
                     <td>{book.author.name}</td>
                     <td>{book.published}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default Recommend;
