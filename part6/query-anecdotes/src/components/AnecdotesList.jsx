import React, { useContext } from 'react';
import NotificationContext from '../NotificationContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vote } from '../requests';

const AnecdotesList = ({ anecdotes }) => {
   const { setNotification } = useContext(NotificationContext);
   const queryClient = useQueryClient();
   const updateAncdotesMutation = useMutation({
      mutationFn: vote,
      onSuccess: (data) => {
         const anecdotes = queryClient.getQueryData(['anecdotes']).map((e) => (e.id === data.id ? data : e));
         queryClient.setQueryData(['anecdotes'], anecdotes);
         setNotification(`anecdote '${data.content}' voted`);
      },
   });
   const handleVote = (anecdote) => {
      updateAncdotesMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
   };
   return (
      <div>
         {anecdotes.map((anecdote) => (
            <div key={anecdote.id}>
               <div>{anecdote.content}</div>
               <div>
                  has {anecdote.votes}
                  <button onClick={() => handleVote(anecdote)}>vote</button>
               </div>
            </div>
         ))}
      </div>
   );
};

export default AnecdotesList;
