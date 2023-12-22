import { createContext, useReducer } from 'react';

function counterReducer(state, action) {
   switch (action.type) {
      case 'INCREMENT':
         return state + 1;
      case 'DECREMENT':
         return state - 1;
      case 'ZERO':
         return 0;
      default:
         return state;
   }
}

const CounterContext = createContext();

export const CounterContextProvider = (props) => {
   const [counter, dispatch] = useReducer(counterReducer, 0);

   return <CounterContext.Provider value={[counter, dispatch]}>{props.children}</CounterContext.Provider>;
};

export default CounterContext;
