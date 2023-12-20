const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const usersRouter = require('./controllers/users');
const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login');

const app = express();

// Connect to MONGO_DB
// mongoose.set('strictQuery', false);
logger.info('connecting to', config.MONGODB_URI);
mongoose
   .connect(config.MONGODB_URI, {
      useUnifiedTopology: true,
   })
   .then(() => {
      logger.info('connected to MongoDB');
   })
   .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message);
   });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
morgan.token('req-body', (req) => JSON.stringify(req.body));
if (config.ENV !== 'test') {
   app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));
}

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
if (config.ENV === 'test') {
   const testingRouter = require('./controllers/testing');

   app.use('/api/testing', testingRouter);
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
