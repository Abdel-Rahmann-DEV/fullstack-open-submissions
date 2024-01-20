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

export type ValidPatient = Omit<Patient, 'ssn' | 'entries'>;
export type NewPatientEntry = Omit<Patient, 'id'>;

export interface BaseEntry {
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

interface HealthCheckEntry extends BaseEntry {
   type: 'HealthCheck';
   healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
   type: 'OccupationalHealthcare';
   employerName: string;
   sickLeave?: {
      startDate: string;
      endDate: string;
   };
}

interface HospitalEntry extends BaseEntry {
   type: 'Hospital';
   discharge: {
      date: string;
      criteria: string;
   };
}

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type NewEntry = UnionOmit<Entry, 'id'>;
