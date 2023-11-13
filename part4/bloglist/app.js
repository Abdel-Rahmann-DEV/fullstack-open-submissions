const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const blogsRoute = require('./controllers/blogs');

const app = express();

// Connect to MONGO_DB
mongoose.set('strictQuery', false);
logger.info('connecting to', config.MONGODB_URI);
mongoose
   .connect(config.MONGODB_URI)
   .then(() => {
      logger.info('connected to MongoDB');
   })
   .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message);
   });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

app.use('/api/blogs', blogsRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
