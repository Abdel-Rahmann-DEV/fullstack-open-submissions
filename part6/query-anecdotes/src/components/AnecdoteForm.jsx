import { useContext } from 'react';
import NotificationContext from '../NotificationContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdotes } from '../requests';
const AnecdoteForm = () => {
   const { setNotification } = useContext(NotificationContext);
   const queryClient = useQueryClient();

   const newAnecdotesMutation = useMutation({
      mutationFn: createAnecdotes,
      onSuccess: (newAnecdotes) => {
         const notes = queryClient.getQueryData(['anecdotes']);
         queryClient.setQueryData(['anecdotes'], notes.concat(newAnecdotes));
         setNotification(`added '${newAnecdotes.content}' anecdote`);
      },
      onError: (err) => {
         const errorMessage = err.response.data.error;
         setNotification(`Error: ${errorMessage}`);
      },
   });

   const onCreate = (event) => {
      event.preventDefault();
      const content = event.target.anecdote.value;
      event.target.anecdote.value = '';
      newAnecdotesMutation.mutate({ content, votes: 0 });
   };

   return (
      <div>
         <h3>create new</h3>
         <form onSubmit={onCreate}>
            <input name="anecdote" />
            <button type="submit">create</button>
         </form>
      </div>
   );
};

export default AnecdoteForm;
