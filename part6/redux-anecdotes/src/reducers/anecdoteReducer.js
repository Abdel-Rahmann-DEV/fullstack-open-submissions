import { createSlice } from '@reduxjs/toolkit';
import anecdoteSrvices from '../services/anecdotes';
const initialState = [];

const anecdotesSlice = createSlice({
   name: 'anecdotes',
   initialState,
   reducers: {
      setVote: (state, action) => {
         const { id } = action.payload;
         const anecdoteToChange = state.find((anecdote) => anecdote.id === id);
         if (anecdoteToChange) {
            anecdoteToChange.votes += 1;
         }
         state.sort((a, b) => b.votes - a.votes);
      },
    
      appendNew: (state, action) => {
         state.push(action.payload);
         state.sort((a, b) => b.votes - a.votes);
      },

      setAnecodotes: (state, action) => {
         const anecdotes = action.payload.sort((a, b) => b.votes - a.votes);
         return anecdotes;
      },
   },
});

export const { setVote,  appendNew, setAnecodotes } = anecdotesSlice.actions;

export const initializeAnecdotes = () => {
   return async (dispatch) => {
      const data = await anecdoteSrvices.getAll();
      dispatch(setAnecodotes(data));
   };
};
export const createNew = (content) => {
   return async (dispatch) => {
      const data = await anecdoteSrvices.createNew(content);
      dispatch(appendNew(data));
   };
};
export const vote = (anecdote) => {
   return async (dispatch) => {
       await anecdoteSrvices.vote(anecdote.id);
      dispatch(setVote({id:anecdote.id}));
     
   };
};



export default anecdotesSlice.reducer;
