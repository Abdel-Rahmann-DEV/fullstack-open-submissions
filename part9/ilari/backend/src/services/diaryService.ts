import diaries from '../../data/diaries';

import { NonSensitiveDiaryEntry, DiaryEntry,  NewDiaryEntry } from '../types';

const getEntries = (): DiaryEntry[] => {
   return diaries;
};
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
   return diaries.map(({ id, date, weather, visibility }) => ({
      id,
      date,
      weather,
      visibility,
   }));
};
const findById = (id: number): DiaryEntry | undefined => diaries.find((d) => d.id === id);

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
   const newDiaryEntry = {
      id: Math.max(...diaries.map((d) => d.id)) + 1,
      ...entry,
   };

   diaries.push(newDiaryEntry);
   return newDiaryEntry;
};
export default {
   getEntries,
   addDiary,
   getNonSensitiveEntries,
   findById,
};
