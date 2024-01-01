import useCounter from './useCounter';
const App = () => {
   const { value, increase, decrease, zero } = useCounter(20);

   return (
      <div>
         <div>{value}</div>
         <button onClick={increase}>plus</button>
         <button onClick={decrease}>minus</button>
         <button onClick={zero}>zero</button>
      </div>
   );
};

export default App;
