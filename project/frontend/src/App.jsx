import { useState, useEffect } from "react";
import Note from "./components/Note";
import axios from "axios";
import noteService from "./services/notes";
const Notification = ({ message }) => {
   if (message === null) {
      return null;
   }

   return <div className="error">{message}</div>;
};
const Footer = () => {
   const footerStyle = {
      color: "green",
      fontStyle: "italic",
      fontSize: 16,
   };
   return (
      <div style={footerStyle}>
         <br />
         <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
      </div>
   );
};
const App = () => {
   const [notes, setNotes] = useState([]);
   const [newNote, setNewNote] = useState("");
   const [showAll, setShowAll] = useState(true);
   const [errorMessage, setErrorMessage] = useState(null);

   useEffect(() => {
      noteService.getAll().then((response) => {
         setNotes(response.data);
      });
   }, []);

   const addNote = (event) => {
      event.preventDefault();
      const noteObject = {
         content: newNote,
         important: Math.random() > 0.5,
      };

      noteService.create(noteObject).then((response) => {
         setNotes(notes.concat(response.data));
         setNewNote("");
      });
   };
   const toggleImportanceOf = (id) => {
      const noteToToggle = notes.find((note) => note.id === id);
      if (!noteToToggle) return;

      const newImportance = !noteToToggle.important;

      noteService
         .update(id, { important: newImportance })
         .then((response) => {
            const updatedNotes = notes.map((note) => (note.id === id ? { ...note, important: newImportance } : note));
            setNotes(updatedNotes);
         })
         .catch((error) => {
            setErrorMessage(`Note '${noteToToggle.content}' was already removed from server`);
            setTimeout(() => {
               setErrorMessage(null);
            }, 5000);
            setNotes(notes.filter((n) => n.id !== id));
         });
   };
   const deleteNote = () => {};
   const notesToShow = showAll ? notes : notes.filter((note) => note.important);
   return (
      <div>
         <h1>Notes</h1>
         <Notification message={errorMessage} />
         <div>
            <form onSubmit={addNote}>
               <input type="text" value={newNote} onChange={(event) => setNewNote(event.target.value)} />
               <button type="submit">Add Note</button>
            </form>
         </div>
         <div>
            <button onClick={() => setShowAll(!showAll)}>show {showAll ? "important" : "all"}</button>
         </div>
         <ul>
            {notesToShow.map((note) => (
               <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} deleteNote={deleteNote} />
            ))}
         </ul>
         <Footer />
      </div>
   );
};

export default App;
