const mongoose = require('mongoose');
const logger = require('./logger');

const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
   logger.error('error name', error.name);
   logger.error('error message', error.message);
   logger.error(error);

   if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return response.status(400).json({ error: 'Validation failed', details: validationErrors });
   }
   if (error instanceof mongoose.Error.CastError) {
      return response.status(404).json({ error: 'Invalid ID format' });
   }
   if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return response.status(400).json({ error: 'Username must be unique' });
   }
   if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'invalid token' });
   }
   if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ error: 'token expired' });
   }

   return next(error);
};

module.exports = {
   unknownEndpoint,
   errorHandler,
};
