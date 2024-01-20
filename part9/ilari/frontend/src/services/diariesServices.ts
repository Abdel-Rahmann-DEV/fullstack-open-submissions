import axios from 'axios';
import { Diaries, NewDiarie } from '../types/diaries';

export const getAll = async () => {
   const response = await axios.get<Diaries[]>('/api/diaries/all');
   return response.data;
};
export const addNew = async (content: NewDiarie) => {
   const response = await axios.post<Diaries>('/api/diaries', { ...content });
   return response.data;
};
