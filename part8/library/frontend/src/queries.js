import { gql } from '@apollo/client';

// Fragments
const BOOK_DETAILS = gql`
   fragment BookDetails on Book {
      title
      author {
         name
         born
         id
      }
      published
      genres
      id
   }
`;

export const GET_BOOKS = gql`
   query ($genre: String) {
      allBooks(genre: $genre) {
         title
         author {
            name
            born
            id
         }
         published
         genres
         id
      }
   }
`;

export const GET_AUTHORS = gql`
   query {
      allAuthors {
         name
         born
         id
         bookCount
      }
   }
`;

export const ME = gql`
   query {
      me {
         username
         favoriteGenre
         id
      }
   }
`;

export const ADD_BOOK = gql`
   mutation AddBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
      addBook(title: $title, published: $published, author: $author, genres: $genres) {
         title
         published
         author {
            name
            bookCount
            id
            born
         }
         genres
      }
   }
`;
export const UPDATE_AUTHOR = gql`
   mutation editAuthor($id: String!, $born: Int!) {
      editAuthor(id: $id, born: $born) {
         id
         born
      }
   }
`;
export const LOGIN = gql`
   mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
         value
      }
   }
`;

// Subscriptions
export const BOOK_ADDED = gql`
   subscription {
      bookAdded {
         title
         author {
            name
            born
            id
         }
         published
         genres
         id
      }
   }
`;
