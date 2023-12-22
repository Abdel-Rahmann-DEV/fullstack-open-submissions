import { useQuery } from '@tanstack/react-query';
import { getAnecdotes } from './requests';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import AnecdotesList from './components/AnecdotesList';

const App = () => {
   const { isLoading, isError, data } = useQuery({
      queryKey: ['anecdotes'],
      queryFn: () => getAnecdotes(),
      refetchOnWindowFocus: false,
   });

   if (isLoading) {
      return <div>loading data...</div>;
   }

   if (isError) {
      return <div>anecdote service not available due to problems in server</div>;
   }
   const anecdotes = data;

   return (
      <div>
         <h3>Anecdote app</h3>

         <Notification />
         <AnecdoteForm />

         <AnecdotesList anecdotes={anecdotes} />
      </div>
   );
};

export default App;
