import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

export const getAnecdotes = async () => {
   try {
      const response = await axios.get(baseUrl);
      return response.data;
   } catch (err) {
      console.log('error', err);
   }
};
export const createAnecdotes = async (data) => {
   const response = await axios.post(baseUrl, data);
   return response.data;
};
export const vote = async (updatedAnecdote) => {
   try {
      const response = await axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote);
      return response.data;
   } catch (err) {
      console.log('error', err);
   }
};
