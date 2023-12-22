import { useDispatch } from 'react-redux';
import { createNew } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
const AnecdoteForm = () => {
   const dispatch = useDispatch();
   const addAnecdote = async (e) => {
      e.preventDefault();
      const content = e.target.content.value;
      e.target.content.value = '';
      dispatch(createNew(content));
      dispatch(setNotification({ message: `New anecdote created: '${content}'` }));
   };
   return (
      <>
         <h2>create new</h2>
         <form onSubmit={addAnecdote}>
            <input name="content" />
            <button type="submit">Create</button>
         </form>
      </>
   );
};

export default AnecdoteForm;
