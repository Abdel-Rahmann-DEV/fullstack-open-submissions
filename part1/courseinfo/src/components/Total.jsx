import React from "react";

function Total({ parts }) {
   const totalExercises = parts.reduce((acc, curr) => acc + curr.exercises, 0);

   return <p>Number of exercises {totalExercises}</p>;
}

export default Total;
