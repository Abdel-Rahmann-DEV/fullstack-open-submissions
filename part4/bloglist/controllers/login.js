const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../modules/user');
const { SECRIT_KEY } = require('../utils/config');

const loginRoute = express.Router();
loginRoute.post('/', async (req, res, next) => {
   try {
      const { username, password } = req.body;
      if (!username || !password) {
         return res.status(400).json({ error: 'Username and password are required!' });
      }

      const user = await User.findOne({ username });
      if (!user) {
         return res.status(401).json({ error: 'Invalid username or password' });
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
         return res.status(401).json({ error: 'Invalid username or password' });
      }

      const payload = {
         username: user.username,
         id: user.id,
      };
      const token = jwt.sign(payload, SECRIT_KEY, { expiresIn: '1h' });
      return res.status(200).json({ user, token });
   } catch (exception) {
      return next(exception);
   }
});

module.exports = loginRoute;
