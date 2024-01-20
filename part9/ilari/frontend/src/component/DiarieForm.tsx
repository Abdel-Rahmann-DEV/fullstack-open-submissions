// DiarieForm.jsx
import React, { useState } from 'react';
import { NewDiarie, Weather, Visibility } from '../types/diaries';
const DiarieForm = ({ addDiarie }: { addDiarie: (diarie: NewDiarie) => void }) => {
   const [diarie, setDiarie] = useState<NewDiarie>({
      date: '',
      weather: Weather.Sunny,
      visibility: Visibility.Great,
      comment: '',
   });

   const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setDiarie((prevDiarie) => ({
         ...prevDiarie,
         [name]: value,
      }));
   };

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      addDiarie(diarie);
   };

   return (
      <form onSubmit={handleSubmit}>
         <label>
            Date:
            <input type="date" name="date" value={diarie.date} onChange={handleChange} required />
         </label>
         <br />
         <label>
            Weather:
            <select name="weather" value={diarie.weather} onChange={handleChange} required>
               {Object.values(Weather).map((weatherOption) => (
                  <option key={weatherOption} value={weatherOption}>
                     {weatherOption}
                  </option>
               ))}
            </select>
         </label>
         <br />
         <label>
            Visibility:
            <select name="visibility" value={diarie.visibility} onChange={handleChange} required>
               {Object.values(Visibility).map((visibilityOption) => (
                  <option key={visibilityOption} value={visibilityOption}>
                     {visibilityOption}
                  </option>
               ))}
            </select>
         </label>
         <br />
         <label>
            Comment:
            <textarea name="comment" value={diarie.comment} onChange={handleChange}  />
         </label>
         <br />
         <button type="submit">Add Diarie</button>
      </form>
   );
};

export default DiarieForm;
