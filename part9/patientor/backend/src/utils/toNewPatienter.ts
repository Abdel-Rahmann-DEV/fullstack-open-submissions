import { Gender, NewPatientEntry } from '../types';

const isString = (text: unknown): text is string => {
   return typeof text === 'string' || text instanceof String;
};

const isDate = (date: unknown): date is string => {
   return isString(date) && Boolean(Date.parse(date));
};

const isGender = (param: unknown): param is Gender => {
   return typeof param === 'string' && Object.values(Gender).includes(param as Gender);
};

const parseString = (str: unknown, type: string): string => {
   if (!str || !isString(str)) {
      throw new Error(`Incorrect or missing ${type}. Received: ${JSON.stringify(str)}`);
   }
   return str;
};

const parseDate = (date: unknown): string => {
   if (!date || !isDate(date)) {
      throw new Error(`Incorrect or missing date. Received: ${JSON.stringify(date)}`);
   }
   return date;
};

const parseGender = (gender: unknown): Gender => {
   if (!gender || !isGender(gender)) {
      throw new Error(`Incorrect or missing gender. Received: ${JSON.stringify(gender)}`);
   }
   return gender;
};

const toNewPatienter = (object: unknown): NewPatientEntry => {
   if (!object || typeof object !== 'object') {
      throw new Error(`Incorrect or missing data. Received: ${JSON.stringify(object)}`);
   }

   const { name, dateOfBirth, ssn, gender, occupation } = object as Record<string, unknown>;

   if (name && dateOfBirth && ssn && gender && occupation) {
      return {
         entries: [],
         name: parseString(name, 'name'),
         dateOfBirth: parseDate(dateOfBirth),
         ssn: parseString(ssn, 'ssn'),
         gender: parseGender(gender),
         occupation: parseString(occupation, 'occupation'),
      };
   }

   throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatienter;
