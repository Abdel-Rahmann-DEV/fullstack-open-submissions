import axios from 'axios';
const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
   const response = await axios.get(baseUrl);
   return response.data;
};
const createNew = async (content) => {
   const object = { content, votes: 0 };
   const response = await axios.post(baseUrl, object);
   return response.data;
};
const vote = async (id) => {
   try {
      const currentResponse = await axios.get(`${baseUrl}/${id}`);
      const currentVote = currentResponse.data.votes;

      const updatedVote = currentVote + 1;

      const response = await axios.patch(`${baseUrl}/${id}`, { votes: updatedVote });

      return response.data;
   } catch (error) {
      console.error('Error while updating vote:', error);
      throw error;
   }
};
const payload = { getAll, createNew, vote };
export default payload;
