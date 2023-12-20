const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
   const users = await User.find({});
   response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
   const { username, name, password } = request.body;
   try {
      const user = new User({
         username,
         name,
         password,
      });

      const savedUser = await user.save();

      response.status(201).json(savedUser);
   } catch (error) {
      next(error);
   }
});
module.exports = usersRouter;
