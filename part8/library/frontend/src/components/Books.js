import React, { useState } from 'react';
import {  useQuery, useSubscription } from '@apollo/client';
import { GET_BOOKS, BOOK_ADDED, GET_AUTHORS } from '../queries';
import RadioButton from './RadioButton';

export const updateCache = (cache, query, addedBook) => {
   console.log('run...');
   const uniqByName = (a) => {
      let seen = new Set();
      return a.filter((item) => {
         let k = item.name;
         return seen.has(k) ? false : seen.add(k);
      });
   };

   // Update allBooks query
   cache.updateQuery(query, ({ allBooks }) => {
      return {
         allBooks: uniqByName(allBooks.concat(addedBook)),
      };
   });

   // Update allAuthors query (assuming it exists)
   const authorId = addedBook.author.id;

   cache.modify({
      fields: {
         allAuthors(existingAuthors = []) {
            const authorIndex = existingAuthors.findIndex((author) => author.id === authorId);

            if (authorIndex !== -1) {
               // Update existing author
               const updatedAuthor = { ...existingAuthors[authorIndex], ...addedBook.author };
               existingAuthors[authorIndex] = updatedAuthor;
            } else {
               // Create new author
               existingAuthors.push(addedBook.author);
            }

            return existingAuthors;
         },
      },
   });
};

const Books = () => {
   const [filter, setFilter] = useState('all');
   
   const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
      variables: { genre: filter === 'all' ? '' : filter },
   });
   useSubscription(BOOK_ADDED, {
      onData: ({ data, client }) => {
         console.log('data', data);
         const addedBook = data.data.bookAdded;
         // updateCache(client.cache, { query: GET_BOOKS }, addedBook);
      },
   });

   const filterCategories = [
      { value: 'Fiction', label: 'Fiction' },
      { value: 'Coming-of-Age', label: 'Coming-of-Age' },
      { value: 'Legal Drama', label: 'Legal Drama' },
      { value: 'Dystopian', label: 'Dystopian' },
      { value: 'Political Fiction', label: 'Political Fiction' },
      { value: 'Classic', label: 'Classic' },
      { value: 'Romance', label: 'Romance' },
      { value: 'Magical Realism', label: 'Magical Realism' },
      { value: 'Family Saga', label: 'Family Saga' },
      { value: 'love', label: 'love' },
      { value: 'action', label: 'action' },
      { value: 'Romance', label: 'Romance' },
      { value: 'sports', label: 'sports' },
      { value: 'programming', label: 'programming' },
      { value: 'all', label: 'all genres' },
   ];

   const handleChangeFilter = async (val) => {
      setFilter(val);
      await refetch({ genre: val === 'all' ? '' : val });
   };

   if (loading) {
      return <p>Loading ...</p>;
   }

   if (error) {
      return <p style={{ color: 'red' }}>Error: {error.message}</p>;
   }

   return (
      <div>
         <h2>books</h2>

         <p>
            in genre <b>{filterCategories.find((e) => e.value === filter).label}</b>
         </p>
         <table>
            <tbody>
               <tr>
                  <th></th>
                  <th>author</th>
                  <th>published</th>
               </tr>
               {data.allBooks.map((a) => (
                  <tr key={a.title}>
                     <td>{a.title}</td>
                     <td>{a.author.name}</td>
                     <td>{a.published}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         <RadioButton category={filterCategories} handleChange={handleChangeFilter} value={filter} />
      </div>
   );
};

export default Books;
