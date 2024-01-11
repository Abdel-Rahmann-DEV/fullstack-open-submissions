import React from 'react';
import { useState } from 'react';
import { ADD_BOOK, GET_BOOKS, GET_AUTHORS } from '../queries';
import { useMutation, useApolloClient } from '@apollo/client';

const NewBook = () => {
   const [title, setTitle] = useState('');
   const [author, setAuthor] = useState('');
   const [published, setPublished] = useState('');
   const [genre, setGenre] = useState('');
   const [genres, setGenres] = useState([]);

   const [addNewBook, { loading, error }] = useMutation(ADD_BOOK, {
      onError: (error) => {
         console.error('Error adding book:', error);
      },
      onCompleted: async (data) => {
         console.log('Book added:', data.addBook);

         // setTitle('');
         // setPublished('');
         // setAuthor('');
         // setGenres([]);
         // setGenre('');
      },
      update: (cache, { data: { addBook } }) => {
         // const { allBooks } = cache.readQuery({ query: GET_BOOKS, variables: { genre: '' } });
         console.log('addBook', addBook);

         cache.updateQuery({ query: GET_BOOKS, variables: { genre: '' } }, ({ allBooks }) => {
            return {
               allBooks: [...allBooks, addBook],
            };
         });
         // cache.writeQuery({
         //    query: GET_BOOKS,
         //    data: {
         //       allBooks: [...allBooks, addBook],
         //    },
         // });

         const authorsData = cache.readQuery({ query: GET_AUTHORS });
         if (!authorsData) {
            return;
         }
         const existingAuthor = authorsData.allAuthors.find((authorItem) => authorItem.id === addBook.author.id);

         if (existingAuthor) {
            console.log('exist author');
            cache.writeQuery({
               query: GET_AUTHORS,
               data: {
                  allAuthors: authorsData.allAuthors.map((authorItem) => (authorItem.id === addBook.author.id ? addBook.author : authorItem)),
               },
            });
         } else {
            console.log('not exist author');
            cache.writeQuery({
               query: GET_AUTHORS,
               data: {
                  allAuthors: [...authorsData.allAuthors, addBook.author],
               },
            });
         }
      },
   });

   const submit = async (event) => {
      event.preventDefault();

      try {
         await addNewBook({
            variables: { title, author, published: parseInt(published), genres },
         });
      } catch (error) {
         console.error('Error adding book:', error);
         console.error('Validation error details:', error.graphQLErrors);
      }
   };

   const addGenre = () => {
      setGenres((prevGenres) => [...prevGenres, genre]);
      setGenre('');
   };

   return (
      <div>
         <form onSubmit={submit}>
            <div>
               title
               <input value={title} onChange={({ target }) => setTitle(target.value)} />
            </div>
            <div>
               author
               <input value={author} onChange={({ target }) => setAuthor(target.value)} />
            </div>
            <div>
               published
               <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
            </div>
            <div>
               <input value={genre} onChange={({ target }) => setGenre(target.value)} />
               <button onClick={addGenre} type="button">
                  add genre
               </button>
            </div>
            <div>genres: {genres.join(' ')}</div>
            <button type="submit" disabled={loading}>
               {loading ? 'Creating book...' : 'Create book'}
            </button>
            {error && <p>Error creating book</p>}
         </form>
      </div>
   );
};

export default NewBook;
