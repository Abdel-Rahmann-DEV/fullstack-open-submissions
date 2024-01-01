import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
   const storedValue = JSON.parse(localStorage.getItem(key)) || initialValue || null;

   const [value, setValue] = useState(storedValue);

   const setStoredValue = (newValue) => {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
   };

   return [value, setStoredValue];
};

export default useLocalStorage;
