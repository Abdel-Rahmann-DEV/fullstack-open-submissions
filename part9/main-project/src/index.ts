import caculateBim from './bmiCalculator';
import calculator, { Operation } from './calcultor';
import getRating, { Rating } from './exerciseCalculator';
import express from 'express';
const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
   res.send('hello mother fucker!');
});
app.get('/hello', (_req, res) => {
   res.send('Hello Full Stack!');
});

app.post('/calculate', (req, res) => {
   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
   const { value1, value2, op } = req.body;
   if (!value1 || isNaN(Number(value1)) || !value2 || isNaN(Number(value2))) {
      return res.status(400).send({ error: 'Invalid input. Both value1 and value2 must be valid numbers.' });
   }
   const result = calculator(Number(value1), Number(value2), op as Operation);
   return res.send({ result });
});
app.post('/exercises', (req, res) => {
   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
   const { daily_exercises, target }: { daily_exercises: number[]; target: number } = req.body;
   try {
      if (!daily_exercises || !target) {
         return res.status(400).json({
            error: 'Parameters missing',
         });
      }

      if (!Array.isArray(daily_exercises) || isNaN(target)) {
         return res.status(400).json({
            error: 'Malformatted parameters',
         });
      }

      const result: Rating = getRating(daily_exercises, target);
      return res.json(result);
   } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({
         error: 'Internal server error',
      });
   }
});

app.get('/bim', (req, res) => {
   type QueryParams = {
      height?: number;
      weight?: number;
   };
   const { height, weight }: QueryParams = req.query;

   if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
      return res.status(400).json({ error: 'Malformatted parameters or missing height/weight' });
   }

   try {
      const result = caculateBim({ height, weight });
      return res.json(result);
   } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
   }
});

const PORT = 3003;
app.listen(PORT, () => {
   console.log(`Sever Hosted on http://localhost:${PORT}`);
});
