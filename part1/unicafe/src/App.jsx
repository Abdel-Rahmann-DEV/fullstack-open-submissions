import { useState } from "react";
import Button from "./components/Button";
import StatisticLine from "./components/StatisticLine";
const Statistics = ({ good, bad, neutral }) => {
   const totalFeedback = good + neutral + bad;
   const averageScore = (good - bad) / totalFeedback || 0;
   const positivePercentage = (good / totalFeedback) * 100 || 0;
   return (
      <div>
         <h2>Statistics</h2>
         {!totalFeedback ? (
            <p>No feedback given</p>
         ) : (
            <table>
               <StatisticLine text={"good"} value={good} />
               <StatisticLine text={"neutral"} value={neutral} />
               <StatisticLine text={"bad"} value={bad} />
               <StatisticLine text={"all"} value={totalFeedback} />
               <StatisticLine text={"average"} value={averageScore} />
               <StatisticLine text={"positive"} value={positivePercentage} />
            </table>
         )}
      </div>
   );
};

const App = () => {
   const [good, setGood] = useState(0);
   const [neutral, setNeutral] = useState(0);
   const [bad, setBad] = useState(0);

   function handleClick(type) {
      switch (type) {
         case "good":
            setGood(good + 1);
            break;
         case "neutral":
            setNeutral(neutral + 1);
            break;
         case "bad":
            setBad(bad + 1);
            break;
         default:
            console.log("error");
      }
   }

   return (
      <>
         <Button handleClick={handleClick} />
         <Statistics good={good} neutral={neutral} bad={bad} />
      </>
   );
};

export default App;
