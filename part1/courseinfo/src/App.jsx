// import Header from "./components/Header";
// import Content from "./components/Content";
// import Total from "./components/Total";
// const App = () => {
//    const course = {
//       name: "Half Stack application development",
//       parts: [
//          { name: "Fundamentals of React", exercises: 10 },
//          { name: "Using props to pass data", exercises: 7 },
//          { name: "State of a component", exercises: 14 },
//       ],
//    };

//    return (
//       <div>
//          <Header course={course.name} />
//          <Content parts={course.parts} />
//          <Total parts={course.parts} />
//       </div>
//    );
// };

// export default App;
import { useState } from "react";

const App = () => {
   const [counter, setCounter] = useState(0);

   setTimeout(() => setCounter(counter + 1), 1000);

   console.log("rendering...", counter);

   return <div>{counter}</div>;
};
export default App;
