import express from 'express';
import path from 'path';
import diagnosesRoute from './routes/diagnoses ';
import patientsRoute from './routes/patient';
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json());

const PORT = 3001;
app.get('/api/ping', (_req, res) => {
   console.log('someone pinged here');
   res.send('pong');
});
app.get('/', (_req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use('/api/diagnoses', diagnosesRoute);
app.use('/api/patients', patientsRoute);
app.listen(PORT, () => {
   console.log(`Server running on port http://localhost:${PORT}`);
});
