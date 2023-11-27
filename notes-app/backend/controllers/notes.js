const notesRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const User = require('../models/user');

const getTokenFrom = (req) => {
   const authorization = req.get('authorization');
   if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
   }
   return null;
};

notesRouter.get('/', async (request, response, next) => {
   try {
      const notes = await Note.find({});
      response.json(notes);
   } catch (error) {
      next(error);
   }
});

notesRouter.get('/:id', async (request, response, next) => {
   try {
      const note = await Note.findById(request.params.id);
      if (note) {
         response.json(note);
      } else {
         response.status(404).end();
      }
   } catch (error) {
      next(error);
   }
});

notesRouter.post('/', async (request, response, next) => {
   try {
      const { content, important } = request.body;
      const token = getTokenFrom(request);
      const decodedToken = await jwt.verify(token, process.env.SECRET);
      if (!decodedToken.id) {
         return response.status(401).json({ error: 'Token invalid or missing' });
      }
      const user = await User.findById(decodedToken.id);
      if (!user) {
         return response.status(401).json({ error: 'User not found' });
      }
      const note = new Note({
         user: user.id,
         content,
         important: important || false,
      });

      const savedNote = await note.save();

      user.notes = user.notes.concat(savedNote._id);
      await user.save();
      return response.status(201).json(savedNote);
   } catch (error) {
      return next(error);
   }
});

notesRouter.delete('/:id', async (request, response, next) => {
   try {
      await Note.findByIdAndDelete(request.params.id);
      response.status(204).end();
   } catch (error) {
      next(error);
   }
});

notesRouter.patch('/:id', async (request, response, next) => {
   const { content, important } = request.body;
   try {
      const { id } = request.params;
      const updatedNote = await Note.findOneAndUpdate(id, { content, important }, { new: true });
      response.json(updatedNote);
   } catch (error) {
      next(error);
   }
});

module.exports = notesRouter;
