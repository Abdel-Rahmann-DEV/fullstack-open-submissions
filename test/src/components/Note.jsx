import { useState, useEffect } from 'react';
import React from 'react';

const Note = () => {
   const [title, setTitle] = useState('');
   const [notes, setNotes] = useState([]);
   useEffect(() => {
      console.log('effect form notes');
      setNotes([
         { id: 1, title: 'test 1' },
         { id: 2, title: 'test 2' },
      ]);
   }, []);
   const handleSubmit = (e) => {
      e.preventDefault();
      setNotes([...notes, { id: Math.floor(Math.random() * 50000), title }]);
      setTitle('');
   };
   return (
      <div>
         <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
            <button type="submit">Save</button>
         </form>
         {notes.map((e) => (
            <li key={e.id}>{e.title}</li>
         ))}
      </div>
   );
};

export default Note;
