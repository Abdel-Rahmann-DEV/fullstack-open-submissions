const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const blogsRoute = require('./controllers/blogs');
const userRoute = require('./controllers/users');
const loginRoute = require('./controllers/login');

const app = express();

// Connect to MongoDB
mongoose.set('strictQuery', false);
logger.info('Connecting to MongoDB at', config.MONGODB_URI);

mongoose
   .connect(config.MONGODB_URI)
   .then(() => {
      logger.info('Connected to MongoDB');
   })
   .catch((error) => {
      logger.error('Error connecting to MongoDB:', error.message);
   });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Morgan for logging in development
if (config.INVAIROMENT === 'development') {
   morgan.token('req-body', (req) => JSON.stringify(req.body));
   app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));
}
// API Routes
app.use('/api/blogs', blogsRoute);
app.use('/api/users', userRoute);
app.use('/api/login', loginRoute);

if (config.INVAIROMENT === 'test') {
   const testingRoute = require('./controllers/testing');
   
   app.use('/api/testing', testingRoute);
}
// Middleware for handling unknown endpoints and errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
