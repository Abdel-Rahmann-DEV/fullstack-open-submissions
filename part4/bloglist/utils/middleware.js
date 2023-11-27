const jwt = require('jsonwebtoken');
const logger = require('./logger');
const { SECRIT_KEY } = require('./config');
const User = require('../modules/user');

const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
   logger.error('error name: ', error.name);
   logger.error('error stack: ', error.stack);
   if (error.name === 'CastError') {
      return response.status(404).json({ error: 'Malformatted id' });
   }

   if (error.name === 'ValidationError') {
      let { message } = error;
      if (message.includes('Password must be at least 3 characters long')) {
         message = 'Password must be at least 3 characters long';
      }
      if (message.includes('Username must be at least 3 characters long')) {
         message = 'Username must be at least 3 characters long';
      }
      return response.status(400).json({ error: message });
   }

   if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
         error: 'Invalid token',
      });
   }

   if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
         error: 'Token expired',
      });
   }
   if (error.name === 'MongoServerError' && error.code === 11000) {
      return response.status(400).json({ error: 'User already exists' });
   }
   return response.status(500).json({ error: 'Internal Server Error' });
};

const userExtractor = async (request, response, next) => {
   const authorization = request.get('authorization');

   if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return response.status(401).json({ error: 'Token missing' }).end();
   }

   const token = authorization.substring(7);

   try {
      const decodedToken = jwt.verify(token, SECRIT_KEY);

      const user = await User.findById(decodedToken.id);
      if (!user) {
         return next({ name: 'CastError' });
      }
      request.user = user;
      return next();
   } catch (error) {
      return next(error);
   }
};

module.exports = {
   unknownEndpoint,
   errorHandler,
   userExtractor,
};
