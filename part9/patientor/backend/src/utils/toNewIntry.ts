import { HealthCheckRating, NewEntry, Diagnoses } from '../types';

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String;

const isDate = (date: unknown): date is string => isString(date) && Boolean(Date.parse(date));

const isHealthCheckRating = (rating: unknown): rating is HealthCheckRating => typeof rating === 'number' && Object.values(HealthCheckRating).includes(rating as HealthCheckRating);

const parseString = (str: unknown, type: string): string => {
   if (!isString(str) || !str) {
      throw new Error(`Incorrect or missing ${type}. Received: ${JSON.stringify(str)}`);
   }
   return str;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnoses['code']> => {
   if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
      // we will just trust the data to be in correct form
      return [] as Array<Diagnoses['code']>;
   }

   return object.diagnosisCodes as Array<Diagnoses['code']>;
};

const parseSickLeave = (sickLeave: unknown): { startDate: string; endDate: string } | undefined => {
   if (!sickLeave || typeof sickLeave !== 'object' || !('startDate' in sickLeave) || !('endDate' in sickLeave)) {
      return undefined;
   }

   return {
      startDate: parseString(sickLeave.startDate, 'startDate'),
      endDate: parseString(sickLeave.endDate, 'endDate'),
   };
};

const toNewEntry = (object: unknown): NewEntry => {
   if (!object || typeof object !== 'object') {
      throw new Error(`Incorrect or missing data. Received: ${JSON.stringify(object)}`);
   }

   const { type, description, date, specialist, diagnosisCodes, healthCheckRating, employerName, sickLeave, discharge } = object as Record<string, unknown>;

   if (!type || !isString(type)) {
      throw new Error(`Incorrect or missing type. Received: ${JSON.stringify(type)}`);
   }

   const commonProps = {
      description: parseString(description, 'description'),
      date: parseDate(date),
      specialist: parseString(specialist, 'specialist'),
      diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
   };

   switch (type) {
      case 'HealthCheck':
         if (!isHealthCheckRating(healthCheckRating)) {
            throw new Error(`Incorrect or missing healthCheckRating. Received: ${JSON.stringify(healthCheckRating)}`);
         }
         return { ...commonProps, type, healthCheckRating };

      case 'OccupationalHealthcare':
         if (!isString(employerName) || !employerName) {
            throw new Error(`Incorrect or missing employerName. Received: ${JSON.stringify(employerName)}`);
         }

         return {
            ...commonProps,
            type,
            employerName,
            sickLeave: parseSickLeave(sickLeave),
         };

      case 'Hospital':
         if (!discharge || typeof discharge !== 'object' || !('date' in discharge) || !('criteria' in discharge) || !isString(discharge.date) || !isString(discharge.criteria) || !discharge.date || !discharge.criteria) {
            throw new Error(`Incorrect or missing discharge information. Received: ${JSON.stringify(discharge)}`);
         }
         return {
            ...commonProps,
            type,
            discharge: {
               date: parseString(discharge.date, 'date'),
               criteria: parseString(discharge.criteria, 'criteria'),
            },
         };

      default:
         throw new Error(`Unsupported entry type: ${type}`);
   }
};

const parseDate = (date: unknown): string => {
   if (!isDate(date)) {
      throw new Error(`Incorrect or missing date. Received: ${JSON.stringify(date)}`);
   }
   return date;
};

export default toNewEntry;
