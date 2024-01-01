import React, { useState, useEffect } from 'react';
import { getAllCountries } from './sevices/country';
const useField = (type) => {
   const [value, setValue] = useState('');

   const onChange = (event) => {
      setValue(event.target.value);
   };

   return {
      type,
      value,
      onChange,
   };
};

const useCountry = (name) => {
   const [country, setCountry] = useState(null);
   const [countries, setCountries] = useState(null);
   useEffect(() => {
      const fetchData = async () => {
         const data = await getAllCountries();
         setCountries(data);
      };
      fetchData();
   }, []);
   useEffect(() => {
      if (!countries) return;

      const selectedCountry = countries.find((e) => e.name.common.toLowerCase().includes(name.toLowerCase()));

      if (selectedCountry) {
         setCountry({
            found: true,
            data: selectedCountry,
         });
      } else {
         setCountry({
            found: false,
         });
      }
   }, [name, countries]);

   return country;
};

const Country = ({ country }) => {
   if (!country) {
      return null;
   }

   if (!country.found) {
      return <div>not found...</div>;
   }

   return (
      <div>
         <h3>{country.data.name.common} </h3>
         <div>capital {country.data.capital} </div>
         <div>population {country.data.population}</div>
         <img src={country.data.flags.png} height="100" alt={`flag of ${country.data.name}`} />
      </div>
   );
};

const App = () => {
   const nameInput = useField('text');
   const [name, setName] = useState('');
   const country = useCountry(name);

   const fetch = (e) => {
      e.preventDefault();
      setName(nameInput.value);
   };

   return (
      <div>
         <form onSubmit={fetch}>
            <input {...nameInput} />
            <button>find</button>
         </form>

         <Country country={country} />
      </div>
   );
};

export default App;
