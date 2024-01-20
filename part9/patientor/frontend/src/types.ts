export enum Gender {
   Male = 'male',
   Female = 'female',
   Other = 'other',
}

export type DiagnosisCode = string;

export type Diagnoses = {
   code: DiagnosisCode;
   name: string;
   latin?: string;
};

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface Patient {
   id: string;
   name: string;
   dateOfBirth: string;
   ssn: string;
   gender: Gender;
   occupation: string;
   entries: Entry[];
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;

interface BaseEntry {
   id: string;
   description: string;
   date: string;
   specialist: string;
   diagnosisCodes?: DiagnosisCode[];
}

export enum HealthCheckRating {
   Healthy = 0,
   LowRisk = 1,
   HighRisk = 2,
   CriticalRisk = 3,
}

export enum EntryTypes {
   HealthCheck = 'Health Check',
   OccupationalHealthcare = 'Occupational Health Care',
   Hospital = 'Hospital',
}
export interface HealthCheckEntry extends BaseEntry {
   type: EntryTypes.HealthCheck;
   healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
   type: EntryTypes.OccupationalHealthcare;
   employerName: string;
   sickLeave?: {
      startDate: string;
      endDate: string;
   };
}

export interface HospitalEntry extends BaseEntry {
   type: EntryTypes.Hospital;
   discharge: {
      date: string;
      criteria: string;
   };
}
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type NewEntry = UnionOmit<Entry, 'id'>;
