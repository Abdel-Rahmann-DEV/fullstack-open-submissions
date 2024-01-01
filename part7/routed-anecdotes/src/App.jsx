import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import useField from './hooks/useField';

const Menu = () => {
   const padding = {
      paddingRight: 5,
   };
   return (
      <div>
         <NavLink style={padding} to="/" activeClassName="active" end>
            anecdotes
         </NavLink>
         <NavLink style={padding} to="/create" activeClassName="active">
            create new
         </NavLink>
         <NavLink style={padding} to="/about" activeClassName="active">
            about
         </NavLink>
      </div>
   );
};

const Notification = ({ notification }) => {
   if (notification) {
      return <div>{notification}</div>;
   }
};

Notification.propTypes = {
   notification: PropTypes.string,
};

const AnecdoteList = ({ anecdotes, notification }) => (
   <div>
      <Notification notification={notification} />
      <h2>Anecdotes</h2>
      <ul>
         {anecdotes.map((anecdote) => (
            <li key={anecdote.id}>
               <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            </li>
         ))}
      </ul>
   </div>
);

AnecdoteList.propTypes = {
   anecdotes: PropTypes.array.isRequired,
   notification: PropTypes.string,
};

const Anecdote = ({ anecdotes }) => {
   const { id } = useParams();
   const anecdote = anecdotes.find((e) => e.id === Number(id));

   return (
      <div>
         <h1>
            {anecdote.content} by {anecdote.author}
         </h1>
         <p>has {anecdote.votes} votes</p>
         <p>
            for more info see <a href={anecdote.info}>{anecdote.info}</a>
         </p>
      </div>
   );
};

Anecdote.propTypes = {
   anecdotes: PropTypes.array.isRequired,
};

const About = () => (
   <div>
      <h2>About anecdote app</h2>
      <p>According to Wikipedia:</p>

      <em>An anecdote is a brief, revealing account of an individual person or an incident. Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. An anecdote is "a story with a point."</em>

      <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
   </div>
);

const Footer = () => (
   <div>
      Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>. See <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
   </div>
);

const Input = ({ label, ...props }) => (
   <div>
      {label}
      <input {...props} />
   </div>
);

const CreateNew = ({ addNew }) => {
   const content = useField('text');
   const author = useField('text');
   const info = useField('text');

   const handleSubmit = (e) => {
      e.preventDefault();
      addNew({
         content: content.value,
         author: author.value,
         info: info.value,
         votes: 0,
      });

      content.reset();
      author.reset();
      info.reset();
   };

   return (
      <div>
         <h2>create a new anecdote</h2>
         <form onSubmit={handleSubmit}>
            <Input label="content" name="content" type={content.type} value={content.value} onChange={content.onChange} />
            <Input label="author" name="author" type={author.type} value={author.value} onChange={author.onChange} />
            <Input label="url for more info" name="info" type={info.type} value={info.value} onChange={info.onChange} />
            <button type="submit">create</button>
            <button type="button" onClick={() => [content, author, info].forEach((field) => field.reset())}>
               reset
            </button>
         </form>
      </div>
   );
};

CreateNew.propTypes = {
   addNew: PropTypes.func.isRequired,
};

const App = () => {
   const [anecdotes, setAnecdotes] = useState([
      {
         content: 'If it hurts, do it more often',
         author: 'Jez Humble',
         info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
         votes: 0,
         id: 1,
      },
      {
         content: 'Premature optimization is the root of all evil',
         author: 'Donald Knuth',
         info: 'http://wiki.c2.com/?PrematureOptimization',
         votes: 0,
         id: 2,
      },
   ]);

   const [notification, setNotification] = useState('');
   const navigate = useNavigate();

   const addNew = (anecdote) => {
      anecdote.id = Math.round(Math.random() * 10000);
      setAnecdotes([...anecdotes, anecdote]);
      navigate('/');
      setNotification(`A new anecdote "${anecdote.content}" created!`);
      setTimeout(() => {
         setNotification(null);
      }, 5000);
   };

   return (
      <div>
         <h1>Software anecdotes</h1>
         <Menu />
         <Routes>
            <Route path="/" element={<AnecdoteList anecdotes={anecdotes} notification={notification} />} />
            <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
            <Route path="/about" element={<About />} />
            <Route path="/create" element={<CreateNew addNew={addNew} />} />
         </Routes>
         <Footer />
      </div>
   );
};

export default App;
