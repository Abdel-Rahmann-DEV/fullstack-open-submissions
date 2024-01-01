import React, { useState, useEffect } from 'react';

const Counter = () => {
   const [counter, setCounter] = useState(0);

   useEffect(() => {
      console.log('Effect from Counter - Runs once on mount');
      return () => {
         console.log('Cleanup - This will run on unmount');
      };
   }, []);

   console.log('Counter component rendered');

   return (
      <div>
         {counter} <button onClick={() => setCounter(counter + 1)}>+</button>
         <button onClick={() => setCounter(counter - 1)}>-</button>
      </div>
   );
};

export default Counter;
