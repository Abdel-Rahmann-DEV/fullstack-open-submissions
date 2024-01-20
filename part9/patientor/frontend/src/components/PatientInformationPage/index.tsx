import React, { useEffect, useState } from 'react';
import { Patient, Gender, Diagnoses, NewEntry } from '../../types';
import { useParams } from 'react-router-dom';
import { Button, Alert } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import axios from 'axios';
import MaleIcon from '@mui/icons-material/Male';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import HandleEntry from './HandleEntry';
import AddNewEntry from '../AddEntryModal/AddNewEntry';
import patientsServices from '../../services/patients';

interface Props {
   diagnoses: Diagnoses[];
}

type RequestStatus = 'idle' | 'success' | 'error' | 'loading';

const PatientInformationPage: React.FC<Props> = ({ diagnoses }) => {
   const { id } = useParams<{ id: string }>();
   const [patient, setPatient] = useState<Patient | undefined>();
   const [status, setStatus] = useState<RequestStatus>('idle');
   const [isAddNewEntryVisible, setIsAddNewEntryVisible] = useState(false);
   const [error, setError] = useState({ isError: false, message: '' });

   useEffect(() => {
      const getPatient = async () => {
         try {
            setStatus('loading');
            if (id) {
               const patientData = await patientsServices.getById(id);
               setPatient(patientData);
               setStatus('success');
            } else {
               setStatus('error');
            }
         } catch (error) {
            console.error('Error fetching patient:', error);
            setStatus('error');
         }
      };

      getPatient();
   }, [id]);

   const renderGenderIcon = (gender: Gender | undefined) => {
      switch (gender) {
         case 'female':
            return <FemaleIcon />;
         case 'male':
            return <MaleIcon />;
         case 'other':
            return 'not selected';
         default:
            return <DoNotDisturbOnIcon />;
      }
   };

   const showNotify = (message: string) => {
      setError({ isError: true, message });
      return setTimeout(() => {
         setError({ isError: false, message: '' });
      }, 3000);
   };

   const handleAddNewEntry = async (entry: NewEntry) => {
      try {
         if (id) {
            const newEntry = await patientsServices.createEntry(id, entry);

            setPatient((prevPatient) => {
               if (prevPatient) {
                  return { ...prevPatient, entries: [...prevPatient.entries, newEntry] };
               } else {
                  return prevPatient;
               }
            });
         } else {
            showNotify('Unexpected error?');
         }
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data;
            showNotify(errorMessage || 'Unexpected error?');
         } else {
            showNotify('Unexpected error?');
         }
      }
   };

   const shouldRenderContent = status === 'success' && patient;

   return (
      <div>
         {status === 'loading' && <p>Loading...</p>}
         {status === 'error' && <p>Error fetching patient information.</p>}
         {shouldRenderContent && (
            <>
               <h1>
                  {patient?.name} {renderGenderIcon(patient?.gender)}
               </h1>
               <p>ssn: {patient?.ssn}</p>
               <p>occupation: {patient?.occupation}</p>
               {error.isError && <Alert severity="error">{error.message}</Alert>}
               {isAddNewEntryVisible && <AddNewEntry onSubmit={handleAddNewEntry} setIsAddNewEntryVisible={setIsAddNewEntryVisible} />}
               <HandleEntry entry={patient?.entries || []} diagnoses={diagnoses} />
               {!isAddNewEntryVisible && (
                  <Button onClick={() => setIsAddNewEntryVisible(true)} style={{ marginTop: '15px' }} variant="contained">
                     ADD NEW ENTRY
                  </Button>
               )}
            </>
         )}
      </div>
   );
};

export default PatientInformationPage;
