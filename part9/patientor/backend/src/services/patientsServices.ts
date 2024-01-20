import patients from '../data/patients';
import { v4 as uuid } from 'uuid';
import { Patient, ValidPatient, NewPatientEntry, NewEntry, Entry } from '../types';

const getAllPatients = (): Patient[] => {
   return patients;
};
const getValidPatients = (): ValidPatient[] => {
   return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
   }));
};
const getPatientById = (id: string): Patient | undefined => {
   return patients.find((e) => e.id === id);
};
const addNewPatient = (entry: NewPatientEntry): ValidPatient => {
   const currentId: string = uuid();
   const newPatient: Patient = { ...entry, id: currentId };
   patients.push(newPatient);

   const { id, name, dateOfBirth, gender, occupation } = newPatient;
   return { id, name, dateOfBirth, gender, occupation };
};
const addNewPatientEntry = (id: string, entry: NewEntry): Entry => {
   const currentId: string = uuid();
   const newEntry: Entry = { ...entry, id: currentId };
   const currentPatient = patients.find((e) => e.id === id);
   if (currentPatient) {
      currentPatient.entries.push(newEntry);
   } else {
      throw new Error('not found entry');
   }

   return newEntry;
};
export default {
   getAllPatients,
   getValidPatients,
   addNewPatient,
   getPatientById,
   addNewPatientEntry,
};
