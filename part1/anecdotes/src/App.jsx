import React, { useState } from "react";

const App = () => {
   const anecdotes = [
      "If it hurts, do it more often.",
      "Adding manpower to a late software project makes it later!",
      "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      "Premature optimization is the root of all evil.",
      "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
      "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
      "The only way to go fast is to go well.",
   ];

   const [selected, setSelected] = useState(0);
   const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));
   const [mostVotes, setMostVotes] = useState({ numberOfVotes: 0, mostVotesSelected: 0 });

   const getRandomAnecdote = () => {
      let newSelected = selected;
      while (newSelected === selected) {
         newSelected = Math.floor(Math.random() * anecdotes.length);
      }
      return newSelected;
   };

   const handleVote = () => {
      const newVote = [...points];
      newVote[selected]++;
      if (newVote[selected] > mostVotes.numberOfVotes) {
         setMostVotes({ numberOfVotes: newVote[selected], mostVotesSelected: selected });
      }
      setPoints(newVote);
   };

   const handleNextAnecdote = () => {
      setSelected(getRandomAnecdote());
   };

   return (
      <div>
         <h1>Anecdote of the day</h1>
         <b>{anecdotes[selected]}</b>
         <p>has {points[selected]} votes</p>
         <button onClick={handleVote}>Vote</button>
         <button onClick={handleNextAnecdote}>Next Anecdote</button>
         <h1>Anecdote with the most votes</h1>
         <p>{anecdotes[mostVotes.mostVotesSelected]}</p>
         <p>has {mostVotes.numberOfVotes} votes</p>
      </div>
   );
};

export default App;
