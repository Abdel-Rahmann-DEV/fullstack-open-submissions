import React from 'react';
import { EntryTypes, HealthCheckRating } from '../../types';
import { assertNever } from '../../utils/helper';
import { FormControl, InputLabel, Select, MenuItem, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Preview, SettingsOverscanOutlined } from '@mui/icons-material';

interface Props {
   entryType: EntryTypes;
   healthCheckRating: HealthCheckRating;
   employerName: string;
   sickLeave: { startDate: string; endDate: string };
   discharge: { date: string; criteria: string };
   setHealthCheckRating: React.Dispatch<React.SetStateAction<HealthCheckRating | undefined>>;
   setEmployerName: React.Dispatch<React.SetStateAction<string | undefined>>;
   setSickLeave: React.Dispatch<
      React.SetStateAction<
         | {
              startDate: string;
              endDate: string;
           }
         | undefined
      >
   >;
   setDischarge: React.Dispatch<
      React.SetStateAction<
         | {
              date: string;
              criteria: string;
           }
         | undefined
      >
   >;
}

const ExtraField: React.FC<Props> = ({ entryType }) => {
   const healthCheckField = (
      <FormControl fullWidth margin="normal">
         <InputLabel>Health Check Rating</InputLabel>
         <Select
            value={values.healthCheckRating !== null ? values.healthCheckRating : ''}
            onChange={(e) => {
               
            }}>
            {Object.values(HealthCheckRating).map((rating) => (
               <MenuItem key={rating} value={rating}>
                  {rating}
               </MenuItem>
            ))}
         </Select>
      </FormControl>
   );

   const hospitalField = (
      <FormControl fullWidth margin="normal">
         <InputLabel>Discharge Date</InputLabel>
         <TextField
            fullWidth
            label="Discharge Date"
            type="date"
            value={values.discharge?.date || ''}
            onChange={(e) => {
               
            }}
            InputLabelProps={{
               shrink: true,
            }}
         />
         <TextField
            fullWidth
            label="Discharge Criteria"
            value={values.discharge?.criteria || ''}
            onChange={(e) => {
              
            }}
         />
      </FormControl>
   );

   const occupationalHealthcareField = (
      <div>
         <FormControl fullWidth margin="normal">
            <InputLabel>Employer Name</InputLabel>
            <TextField fullWidth value={values.employerName} onChange={(e) => />
         </FormControl>
         {values.sickLeave && (
            <FormGroup>
               <FormControl fullWidth margin="normal">
                  <InputLabel>Start Date</InputLabel>
                  <TextField
                     fullWidth
                     type="date"
                     value={values.sickLeave.startDate || ''}
                     InputLabelProps={{
                        shrink: true,
                     }}
                  />
               </FormControl>
               <FormControl fullWidth margin="normal">
                  <InputLabel>End Date</InputLabel>
                  <TextField
                     fullWidth
                     type="date"
                     value={values.sickLeave.endDate || ''}
                     InputLabelProps={{
                        shrink: true,
                     }}
                  />
               </FormControl>
            </FormGroup>
         )}
      </div>
   );

   const renderField = () => {
      switch (entryType) {
         case EntryTypes.HealthCheck:
            return healthCheckField;
         case EntryTypes.Hospital:
            return hospitalField;
         case EntryTypes.OccupationalHealthcare:
            return occupationalHealthcareField;
         default:
            assertNever(entryType);
            return null;
      }
   };

   return renderField();
};

export default ExtraField;
