import React, { useState, useEffect } from 'react';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import Persons from './components/persons';
import PersonForm from './components/PersonForm';
import { ALL_PERSONS, PERSON_ADDED } from './queries';
import PhoneForm from './components/PhoneForm';
import { isNonNullObject } from '@apollo/client/utilities';
import LoginForm from './components/LoginForm';

export const updateCache = (cache, query, addedPerson) => {
   const uniqByName = (a) => {
      let seen = new Set();
      return a.filter((item) => {
         let k = item.name;
         return seen.has(k) ? false : seen.add(k);
      });
   };
   cache.updateQuery(query, ({ allPersons }) => {
      return {
         allPersons: uniqByName(allPersons.concat(addedPerson)),
      };
   });
};
const App = () => {
   const [errorMessage, setErrorMessage] = useState(null);
   const [token, setToken] = useState(isNonNullObject);
   const { data, loading, error } = useQuery(ALL_PERSONS);
   const client = useApolloClient();

   const result = client.cache.readQuery({ query: ALL_PERSONS });
   console.log('result', result);

   useSubscription(PERSON_ADDED, {
      onData: ({ data, client }) => {
         const addedPerson = data.data.personAdded;
         notify(`${addedPerson.name} added`);
         updateCache(client.cache, { query: ALL_PERSONS }, addedPerson);
      },
   });
   useEffect(() => {
      // check user auth
      const token = window.localStorage.getItem('phonenumbers-user-token');
      if (token) {
         setToken(token);
      }
   }, []);
   const notify = (message) => {
      setErrorMessage(message);
      setTimeout(() => {
         setErrorMessage(null);
      }, 10000);
   };
   const logout = () => {
      setToken(null);
      localStorage.clear();
      client.resetStore();
   };
   if (!token) {
      return (
         <div>
            <Notify errorMessage={errorMessage} />
            <h2>Login</h2>
            <LoginForm setToken={setToken} setError={notify} />
         </div>
      );
   }
   if (loading) {
      return <div>loading...</div>;
   }
   if (error) return <p>Error: {error.message}</p>;

   return (
      <div>
         <Notify errorMessage={errorMessage} />
         <button onClick={logout}>logout</button>
         <Persons persons={data.allPersons} />
         <hr />
         <PersonForm setError={notify} />
         <hr />
         <PhoneForm setError={notify} />
      </div>
   );
};
const Notify = ({ errorMessage }) => {
   if (!errorMessage) {
      return null;
   }
   return <div style={{ color: 'red' }}>{errorMessage}</div>;
};
export default App;
