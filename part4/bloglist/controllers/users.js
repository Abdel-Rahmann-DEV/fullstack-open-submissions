const express = require('express');
const User = require('../modules/user');

const userRoute = express.Router();
userRoute.get('/', async (req, res, next) => {
   try {
      const users = await User.find({}).populate('blogs');
      return res.status(200).json(users);
   } catch (exption) {
      return next(exption);
   }
});
userRoute.post('/', async (req, res, next) => {
   const { username, password, name } = req.body;
   try {
      if (!(username || password)) {
         return res.status(400).json({ error: 'username and password is required' });
      }
      const user = await User.create({ username, name, password });
      return res.status(201).json(user);
   } catch (exption) {
      return next(exption);
   }
});
module.exports = userRoute;
