import React, { useState } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { NewEntry, HealthCheckRating, Entry, EntryTypes } from '../../types';
import { assertNever } from '../../utils/helper';
import ExtraField from './ExtraField';

interface Props {
   onSubmit: (newEntry: NewEntry) => void;
   setIsAddNewEntryVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddNewEntry: React.FC<Props> = ({ onSubmit, setIsAddNewEntryVisible }) => {
   const [entryType, setEntryType] = useState<EntryTypes | null>(null);
   const [description, setDescription] = useState<Entry['description']>('');
   const [date, setDate] = useState<Entry['date']>('');
   const [specialist, setSpecialist] = useState<Entry['specialist']>('');
   const [diagnosisCodesVisible, setDiagnosisCodesVisible] = useState(false);
   const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
   const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>();
   const [employerName, setEmployerName] = useState<string>();
   const [sickLeave, setSickLeave] = useState<{ startDate: string; endDate: string }>();
   const [discharge, setDischarge] = useState<{ date: string; criteria: string }>();

   const handleDiagnosisCodeChange = (code: string) => {
      setDiagnosisCodes((prevCodes) => {
         const index = prevCodes.indexOf(code);
         if (index === -1) {
            // Code not in the list, add it
            return [...prevCodes, code];
         } else {
            // Code already in the list, remove it
            return [...prevCodes.slice(0, index), ...prevCodes.slice(index + 1)];
         }
      });
   };

   const handleSubmit = () => {
      if (!entryType) return;

      let newEntry: NewEntry;

      switch (entryType) {
         case EntryTypes.HealthCheck:
            if (!healthCheckRating) {
               console.error('Health check rating is required');
               return;
            }

            newEntry = {
               type: entryType,
               description,
               date,
               specialist,
               diagnosisCodes,
               healthCheckRating,
            };
            break;

         case EntryTypes.OccupationalHealthcare:
            if (!employerName) {
               console.error('Employer name and sick leave are required');
               return;
            }

            newEntry = {
               type: entryType,
               description,
               date,
               specialist,
               diagnosisCodes,
               employerName,
               sickLeave,
            };
            break;

         case EntryTypes.Hospital:
            if (!discharge) {
               console.error('Discharge information is required');
               return;
            }

            newEntry = {
               type: entryType,
               description,
               date,
               specialist,
               diagnosisCodes,
               discharge,
            };
            break;

         default:
            return assertNever(entryType);
      }

      // Call the onSubmit function with the newEntry
      onSubmit(newEntry);

      // Optionally, you can clear the form fields after submission
      // setDescription('');
      // setDate('');
      // setSpecialist('');
      // setDiagnosisCodes([]);
      // setHealthCheckRating(null);
   };

   return (
      <Container maxWidth="sm">
         <Typography variant="h4" align="center" gutterBottom>
            Add New Entry
         </Typography>
         <form>
            <FormControl fullWidth margin="normal">
               <InputLabel>Entry Type</InputLabel>
               <Select value={entryType !== null ? entryType : ''} onChange={(e) => setEntryType(e.target.value as EntryTypes)}>
                  <MenuItem value={EntryTypes.HealthCheck}>{EntryTypes.HealthCheck}</MenuItem>
                  <MenuItem value={EntryTypes.OccupationalHealthcare}>{EntryTypes.OccupationalHealthcare}</MenuItem>
                  <MenuItem value={EntryTypes.Hospital}>{EntryTypes.Hospital}</MenuItem>
               </Select>
            </FormControl>
            <TextField label="Description" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
            <TextField label="Date" type="date" fullWidth margin="normal" value={date} onChange={(e) => setDate(e.target.value)} />
            <TextField label="Specialist" fullWidth margin="normal" value={specialist} onChange={(e) => setSpecialist(e.target.value)} />
            <FormControlLabel control={<Checkbox checked={diagnosisCodesVisible} onChange={() => setDiagnosisCodesVisible(!diagnosisCodesVisible)} />} label="Show Diagnosis Codes" />
            {diagnosisCodesVisible && (
               <FormControl fullWidth margin="normal">
                  <InputLabel>Diagnosis Codes</InputLabel>
                  {['C12', 'C23', 'R34'].map((code) => (
                     <FormControlLabel key={code} control={<Checkbox checked={diagnosisCodes.includes(code)} onChange={() => handleDiagnosisCodeChange(code)} />} label={code} />
                  ))}
               </FormControl>
            )}
            {entryType && <ExtraField entryType={entryType} healthCheckRating employerName sickLeave discharge setHealthCheckRating setEmployerName setSickLeave setDischarge />}

            <Button variant="contained" style={{ background: 'red', marginRight: '10px' }} onClick={() => setIsAddNewEntryVisible(false)}>
               CANCEL
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
               ADD
            </Button>
         </form>
      </Container>
   );
};

export default AddNewEntry;
