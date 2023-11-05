import React, { useEffect, useState } from "react";
import axios from "axios";
const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY;
function App() {
   const [filter, setFilter] = useState("");
   const [countryData, setCountryData] = useState([]);
   const [filteredCountry, setFilteredCountry] = useState([]);
   const [currWeather, setCurrWeather] = useState(null);

   const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

   useEffect(() => {
      axios.get(baseUrl + "/all").then((response) => {
         setCountryData(response.data);
      });
   }, []);

   useEffect(() => {
      console.log("effect");
      const currCountry = [];
      let lowerName = filter.toLowerCase();
      for (let c of countryData) {
         if (currCountry.length > 10) break;
         if (c.name.common.toLowerCase().includes(lowerName)) {
            currCountry.push(c);
         }
      }
      setFilteredCountry(currCountry);
      console.log(currCountry);
      if (currCountry.length === 1) {
         const latitude = currCountry[0].latlng[0];
         const longitude = currCountry[0].latlng[1];
         axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${VITE_SOME_KEY}`)
            .then((response) => {
               const weatherData = response.data;
               console.log(weatherData);
               const temperatureKelvin = weatherData.main.temp;
               const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
               const wind = weatherData.wind.speed;
               const weatherIcon = weatherData.weather[0].icon;
               const iconUrl = ` https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
               setCurrWeather({ wind, iconUrl, temperature: temperatureCelsius });
            })
            .catch((error) => {
               console.error("Error:", error);
            });
      }
   }, [filter, countryData]);
   const renderCountryDetails = () => {
      if (filteredCountry.length === 1) {
         const country = filteredCountry[0];
         return (
            <div>
               <h1>{country.name.common}</h1>
               <p>capital {country.capital}</p>
               <p>area {country.area}</p>
               <h4>languages:</h4>
               <ul>
                  {Object.entries(country.languages).map(([key, val]) => (
                     <li key={key}>{val}</li>
                  ))}
               </ul>
               <img src={country.flags.png} alt={country.name.common} />
               {currWeather ? (
                  <>
                     <h1>Weather in {country.capital}</h1>
                     <p>temperature {currWeather.temperature} Celcius</p>
                     <img src={currWeather.iconUrl} alt="img" />
                     <p>wind {currWeather.wind} m/s</p>{" "}
                  </>
               ) : (
                  <p>Loadding...</p>
               )}
            </div>
         );
      } else if (filteredCountry.length < 11) {
         return filteredCountry.map((country) => (
            <p key={country.cca2}>
               {country.name.common} <button onClick={() => setFilter(country.name.common)}>show</button>
            </p>
         ));
      } else {
         return <p>Too many matches, specify another filter</p>;
      }
   };

   return (
      <div>
         find countries <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find countries" />
         {renderCountryDetails()}
      </div>
   );
}

export default App;
