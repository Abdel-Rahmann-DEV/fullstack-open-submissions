import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DiarieList from './component/DiarieList';
import { Diaries, NewDiarie } from './types/diaries';
import { getAll, addNew as addNewDiarie } from './services/diariesServices';
import Header from './component/Header';
import Footer from './component/Footer';
import DiarieForm from './component/DiarieForm';
import Notification from './component/Notification';

interface AppProps {}

interface Notification {
   isNotify: boolean;
   message: string;
   type: 'success' | 'error';
}

const App: React.FC<AppProps> = () => {
   const [diaries, setDiaries] = useState<Diaries[]>([]);
   const [notification, setNotification] = useState<Notification>({
      isNotify: false,
      message: '',
      type: 'success',
   });

   useEffect(() => {
      fetchDiaries();
   }, []);

   const fetchDiaries = async () => {
      try {
         const data = await getAll();
         setDiaries(data);
      } catch (error) {
         console.error('Error fetching Diaries:', error);
      }
   };

   const showNotification = ({ type, message }: { type: 'success' | 'error'; message: string }) => {
      setNotification({ type, message, isNotify: true });
      setTimeout(() => {
         setNotification({ type, message: '', isNotify: false });
      }, 5000);
   };

   const addDiary = async (newDiary: NewDiarie) => {
      try {
         console.log('Added new Diary?', newDiary);
         const addedDiary = await addNewDiarie(newDiary);
         setDiaries((prevDiaries) => [...prevDiaries, addedDiary]);
         showNotification({ type: 'success', message: 'Diary added successfully!' });
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const message = error.response?.data;
            showNotification({ type: 'error', message });
         } else {
            console.error(error);
         }
      }
   };

   return (
      <>
         <Header />
         <Notification {...notification} />
         <DiarieForm addDiarie={addDiary} />
         <DiarieList diaries={diaries} />
         <Footer />
      </>
   );
};

export default App;
