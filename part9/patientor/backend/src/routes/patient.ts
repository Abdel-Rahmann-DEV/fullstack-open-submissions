import express from 'express';
import patientsServices from '../services/patientsServices';
import toNewPatienter from '../utils/toNewPatienter';
import toNewEntry from '../utils/toNewIntry';
const route = express.Router();

route.get('/', (_req, res) => {
   res.send(patientsServices.getValidPatients());
});
route.get('/:id', (req, res) => {
   const id = req.params.id;
   const patient = patientsServices.getPatientById(id);
   if (!patient) {
      return res.status(401).json({ error: 'not found patient' });
   }
   return res.send(patient);
});
route.post('/:id/entries', (req, res) => {
   const id = req.params.id;
   try {
      const newEntry = toNewEntry(req.body);
      const entry = patientsServices.addNewPatientEntry(id, newEntry);

      return res.json(entry);
   } catch (error) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
         errorMessage += ' Error: ' + error.message;
      }
      return res.status(400).send(errorMessage);
   }
});

route.post('/', (req, res) => {
   try {
      const newPatient = toNewPatienter(req.body);
      const addPatient = patientsServices.addNewPatient(newPatient);
      res.json(addPatient);
   } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
         errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
   }
});

export default route;
