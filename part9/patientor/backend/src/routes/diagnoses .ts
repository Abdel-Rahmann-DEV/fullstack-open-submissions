import express from 'express';
import diagnoseSevices from '../services/diagnoseSevices';
const route = express.Router();

route.get('/', (_req, res) => {
   res.send(diagnoseSevices.getAllDiagnoses());
});

export default route;
