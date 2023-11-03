import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const StatisticsLine = ({ text, number }) => {
   return (
      <tr>
         <td>{text}</td>
         <td>{number}</td>
      </tr>
   );
};

const DisplayPercentage = ({ text, number }) => {
   return (
      <tr>
         <td>{text}</td>
         <td>{number} %</td>
      </tr>
   );
};

const Button = ({ text, action }) => {
   return <button onClick={action}>{text}</button>;
};

const Statistics = (props) => {
   const { good, neutral, bad } = props;

   // no data
   if (good === 0 && neutral === 0 && bad === 0) {
      return <p>No feedback given</p>;
   }

   return (
      <table>
         <tbody>
            <StatisticsLine text={"good"} number={good} />

            <StatisticsLine text={"neutral"} number={neutral} />

            <StatisticsLine text={"bad"} number={bad} />

            <StatisticsLine text={"all"} number={good + neutral + bad} />

            <StatisticsLine text={"average"} number={(good * 1 + bad * -1) / (good + bad + neutral)} />

            <DisplayPercentage text={"positive"} number={good / (bad + neutral + good)} />
         </tbody>
      </table>
   );
};

const App = () => {
   // init variables
   const [good, setGood] = useState(0);
   const [neutral, setNeutral] = useState(0);
   const [bad, setBad] = useState(0);

   return (
      <div>
         <Header text={"Give feedback"} />
         <Button action={() => setGood(good + 1)} text={"good"} />
         <Button action={() => setNeutral(neutral + 1)} text={"neutral"} />
         <Button action={() => setBad(bad + 1)} text={"bad"} />
         <Header text={"Statistics"} />

         <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
   );
};
export default App;
