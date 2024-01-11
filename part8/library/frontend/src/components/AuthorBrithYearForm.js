import React, { useState, useEffect } from 'react';
import { UPDATE_AUTHOR, GET_AUTHORS } from '../queries';
import { useMutation, useQuery } from '@apollo/client';
import Select from 'react-select';

const AuthorBirthYearForm = ({ token }) => {
   const [selectedOption, setSelectedOption] = useState(null);
   const [born, setBorn] = useState('');

   const { loading, error, data } = useQuery(GET_AUTHORS);

   const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
      onError: (error) => {
         console.error(error);
      },
      onCompleted: () => {
         setBorn('');
      },
   });
   if (!token) {
      return (
         <div>
            <h1>Set birth year</h1>
            <p>Please login to do this</p>;
         </div>
      );
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!selectedOption || !born) {
         return;
      }
      updateAuthor({ variables: { id: selectedOption.value, born: parseInt(born) } });
   };
   return (
      <div>
         <h1>Set birth year</h1>
         <form onSubmit={handleSubmit}>
            {loading ? (
               <p>Loading...</p>
            ) : (
               <Select
                  defaultValue={selectedOption}
                  onChange={setSelectedOption}
                  options={data.allAuthors.map((author) => ({
                     value: author.id,
                     label: author.name,
                  }))}
               />
            )}
            <label>Born</label>
            <input type="number" onChange={({ target }) => setBorn(target.value)} value={born} />
            <button type="submit">Update Author</button>
         </form>
      </div>
   );
};

export default AuthorBirthYearForm;
