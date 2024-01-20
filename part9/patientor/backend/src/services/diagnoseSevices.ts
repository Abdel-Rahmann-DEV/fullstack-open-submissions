import diagnoses from '../data/diagnoses';
import { Diagnoses } from '../types';

const getAllDiagnoses = (): Diagnoses[] => {
   return diagnoses;
};

export default {
   getAllDiagnoses,
};
