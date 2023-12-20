import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import NoteForm from './components/NoteForm';
import Footer from './components/Footer';
import Notification from './components/Notification';

function App() {
   const [notes, setNotes] = useState([]);
   const [showAll, setShowAll] = useState(true);
   const [errorMessage, setErrorMessage] = useState(null);
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [user, setUser] = useState(null);
   const noteFormRef = useRef();

   useEffect(() => {
      noteService.getAll().then((response) => {
         setNotes(response);
      });
   }, []);

   useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
      if (loggedUserJSON) {
         const loggedUser = JSON.parse(loggedUserJSON);
         setUser(loggedUser);
         noteService.setToken(loggedUser.token);
      }
   }, []);

   const addNote = async (payload) => {
      try {
         const response = await noteService.create(payload);
         setNotes((prevNotes) => [...prevNotes, response]);
         noteFormRef.current.toggleVisibility();
      } catch (error) {
         setErrorMessage('Error adding note');
         setTimeout(() => {
            setErrorMessage(null);
         }, 5000);
      }
   };

   const handleNoteError = (note) => {
      setErrorMessage(`Note '${note.content}' was already removed from the server`);
      setTimeout(() => {
         setErrorMessage(null);
      }, 5000);
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== note.id));
   };
   const toggleImportanceOf = async (note) => {
      try {
         const response = await noteService.update(note.id, { ...note, important: !note.important });
         setNotes((prevNotes) => prevNotes.map((n) => (n.id === note.id ? response : n)));
      } catch (error) {
         handleNoteError(note);
      }
   };

   const handleLogin = async (event) => {
      event.preventDefault();

      try {
         const data = await loginService.login({
            username,
            password,
         });
         window.localStorage.setItem('loggedNoteappUser', JSON.stringify(data));
         noteService.setToken(data.token);
         setUser(data);
         setUsername('');
         setPassword('');
      } catch (exception) {
         console.error(exception);
         setErrorMessage('Wrong credentials');
         setTimeout(() => {
            setErrorMessage(null);
         }, 5000);
      }
   };

   const loginForm = () => (
      <Togglable buttonLabel="login">
         <LoginForm username={username} password={password} handleUsernameChange={({ target }) => setUsername(target.value)} handlePasswordChange={({ target }) => setPassword(target.value)} handleSubmit={handleLogin} />
      </Togglable>
   );

   const notesForm = () => (
      <Togglable buttonLabel="new note" ref={noteFormRef}>
         <NoteForm createNote={addNote} />
      </Togglable>
   );

   const notesToShow = showAll ? notes : notes.filter((note) => note.important);

   return (
      <div>
         <h1>Notes</h1>
         <Notification message={errorMessage} />
         {!user && loginForm()}
         {user && (
            <div>
               <p>
                  {user.userData.name}
                  {' '}
                 logged in
               </p>
               {notesForm()}
            </div>
         )}

         <div>
            <button onClick={() => setShowAll(!showAll)}>
              show
               {showAll ? 'important' : 'all'}
            </button>
         </div>
         <ul>
            {notesToShow.map((note) => (
               <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note)} />
            ))}
         </ul>
         <Footer />
      </div>
   );
}

export default App;
