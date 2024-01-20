import React from 'react';
import { Diagnoses, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckRating, EntryTypes } from '../../types';
import { assertNever } from '../../utils/helper';

// icons
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'; // HealthCheck
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Hospital
import SpaIcon from '@mui/icons-material/Spa'; // OccupationalHealthcare

import FavoriteIcon from '@mui/icons-material/Favorite'; // good health, red for worst
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'; // broken health

interface Props {
   entry: Entry[];
   diagnoses: Diagnoses[];
}
const HandleEntry: React.FC<Props> = ({ entry, diagnoses }) => {
   const entryStyle = {
      border: '1px solid black',
      marginTop: '15px',
      borderRadius: '5px',
      padding: '5px',
   };

   return (
      <div>
         <h2>Entries</h2>
         {entry.map((singleEntry, index) => (
            <div key={index} style={entryStyle}>
               {renderEntryType(singleEntry, diagnoses)}
            </div>
         ))}
      </div>
   );
};

const renderEntryType = (entry: Entry, diagnoses: Diagnoses[]) => {
   switch (entry.type) {
      case EntryTypes.HealthCheck:
         return renderHealthCheckEntry(entry, diagnoses);
      case EntryTypes.Hospital:
         return renderHospitalEntry(entry, diagnoses);
      case EntryTypes.OccupationalHealthcare:
         return renderOccupationalHealthcareEntry(entry, diagnoses);
      default:
         return assertNever(entry);
   }
};

const renderDiagnosisCodes = (diagnosisCodes: string[] | undefined, diagnoses: Diagnoses[]) => {
   if (!diagnosisCodes) {
      return null;
   }

   return (
      <ul>
         {diagnosisCodes.map((code, i) => (
            <li key={i}>
               {code} {findDiagnosisName(code, diagnoses)}
            </li>
         ))}
      </ul>
   );
};

const findDiagnosisName = (code: string, diagnoses: Diagnoses[]) => {
   const diagnosis = diagnoses.find((e) => e.code === code);
   return diagnosis ? diagnosis.name : '';
};

const renderHealthCheckEntry = (entry: HealthCheckEntry, diagnoses: Diagnoses[]) => {
   const { date, description, diagnosisCodes, healthCheckRating, specialist } = entry;
   const healthRating = healthCheckRating === HealthCheckRating.Healthy ? <FavoriteIcon style={{ color: 'green' }} /> : healthCheckRating === HealthCheckRating.LowRisk || healthCheckRating === HealthCheckRating.HighRisk ? <FavoriteIcon style={{ color: 'red' }} /> : <HeartBrokenIcon style={{ color: 'red' }} />;

   return (
      <>
         <p>
            {date} {<HealthAndSafetyIcon />}
         </p>
         <p>{description}</p>
         {renderDiagnosisCodes(diagnosisCodes, diagnoses)}
         {healthRating}
         <p>
            diagnose by <b>{specialist}</b>
         </p>
      </>
   );
};

const renderHospitalEntry = (entry: HospitalEntry, diagnoses: Diagnoses[]) => {
   const { discharge, date, description, diagnosisCodes, specialist } = entry;

   return (
      <>
         <p>
            {date} {<LocalHospitalIcon />}
         </p>
         <p>{description}</p>
         {renderDiagnosisCodes(diagnosisCodes, diagnoses)}
         <p>
            Discharge: date <b>{discharge.date}</b>, criteria <b>{discharge.criteria}</b>
         </p>
         <p>
            diagnose by <b>{specialist}</b>
         </p>
      </>
   );
};

const renderOccupationalHealthcareEntry = (entry: OccupationalHealthcareEntry, diagnoses: Diagnoses[]) => {
   const { employerName, sickLeave, date, description, diagnosisCodes, specialist } = entry;

   const renderSickLeave = () => {
      if (!sickLeave) {
         return null;
      }

      return (
         <p>
            Sick Leave: start date <b>{sickLeave.startDate}</b> end date <b>{sickLeave.endDate}</b>
         </p>
      );
   };

   return (
      <>
         <p>
            {date} {<SpaIcon />} {employerName}
         </p>
         <p>{description}</p>
         {renderDiagnosisCodes(diagnosisCodes, diagnoses)}
         {renderSickLeave()}
         <p>
            diagnose by <b>{specialist}</b>
         </p>
      </>
   );
};

export default HandleEntry;
