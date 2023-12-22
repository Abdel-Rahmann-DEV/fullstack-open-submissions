import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
   const dispatch = useDispatch();
   const anecdotes = useSelector((state) => state.anecdotes);
   const filter = useSelector((state) => state.filter);

   const sendVote = async (anecdote) => {
      dispatch(vote(anecdote));
      dispatch(setNotification({ message: `You voted for '${anecdote.content}'` }));
   };
   const filteredAnecdotes = useMemo(() => {
      if (filter.trim() === '') {
         return anecdotes;
      }

      return anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()));
   }, [anecdotes, filter]);

   return (
      <>
         {filteredAnecdotes.map((anecdote) => (
            <div key={anecdote.id}>
               <div>{anecdote.content}</div>
               <div>
                  has {anecdote.votes}
                  <button onClick={() => sendVote(anecdote)}>vote</button>
               </div>
            </div>
         ))}
      </>
   );
};

export default AnecdoteList;
