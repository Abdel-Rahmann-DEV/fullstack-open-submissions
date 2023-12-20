const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (request, response) => {
   try {
      const { username, password } = request.body;

      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
         return response.status(401).json({
            error: 'Invalid username or password',
         });
      }

      const userForToken = {
         username: user.username,
         id: user.id,
      };

      const token = jwt.sign(userForToken, config.SECRET_KEY, { expiresIn: '1h' });

      const userPayload = {
         username: user.username,
         name: user.name,
         notes: user.notes,
         id: user.id,
      };
      return response.status(200).json({
         token,
         userData: userPayload,
      });
   } catch (error) {
      return response.status(500).json({
         error: 'Internal Server Error',
      });
   }
});

module.exports = loginRouter;
