import { Diaries } from '../types/diaries';

const Diarie = ({ diarie }: { diarie: Diaries }) => {
   return (
      <div style={{ border: '1px solid red' }}>
         <h2>Weather is: {diarie.weather}</h2>
         <p>Visibility: {diarie.visibility}</p>
         <p>Date: {diarie.date}</p>
         <p>
            Comment: <b>{diarie.comment}</b>
         </p>
      </div>
   );
};

export default Diarie;
