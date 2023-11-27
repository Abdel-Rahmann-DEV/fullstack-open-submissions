const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Note = require('../models/note');
const User = require('../models/user');

const api = supertest(app);

describe('Notes API', () => {
   beforeEach(async () => {
      await Note.deleteMany({});
      await Note.insertMany(helper.initialNotes);
   });

   it('notes are returned as json', async () => {
      await api
         .get('/api/notes')
         .expect(200)
         .expect('Content-Type', /application\/json/);
   });

   it('all notes are returned', async () => {
      const notes = await helper.notesInDb();
      expect(notes).toHaveLength(helper.initialNotes.length);
   });

   it('a specific note is within the returned notes', async () => {
      const notes = await helper.notesInDb();
      const content = notes.map((e) => e.content);
      expect(content).toContain('Browser can execute only JavaScript');
   });

   it('a valid note can be added', async () => {
      const newNote = { content: 'async/await simplifies making async calls', important: true };
      try {
         await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/);

         const notes = await helper.notesInDb();
         const content = notes.map((e) => e.content);
         expect(content).toHaveLength(3);
         expect(content).toContain('async/await simplifies making async calls');
      } finally {
         await Note.findOneAndDelete({ content: newNote.content });
      }
   });
   it('note without content is not added', async () => {
      const newNote = { important: true };
      await api.post('/api/notes').send(newNote).expect(400);
      const notes = await helper.notesInDb();
      expect(notes).toHaveLength(helper.initialNotes.length);
   });
   it('should get a specific note by ID', async () => {
      const createdNote = await Note.create({ content: 'Test Note', important: true });

      try {
         const response = await api
            .get(`/api/notes/${createdNote._id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

         // Compare specific properties
         expect(response.body.content).toEqual(createdNote.content);
         expect(response.body.important).toEqual(createdNote.important);

         // Add more assertions as needed based on your response structure
      } finally {
         await Note.findByIdAndDelete(createdNote._id);
      }
   });

   it('should return 404 if the note ID does not exist', async () => {
      const fakeId = helper.nonExistingId();
      await api.get(`/api/notes/${fakeId}`).expect(404);
   });

   it('should create a new Note with selected important status', async () => {
      const payload = { content: 'test content', important: true };
      const newNote = await api.post('/api/notes').send(payload);
      try {
         expect(newNote.status).toBe(201);
         expect(newNote.body.content).toBe('test content');
         expect(newNote.body.important).toBe(true);

         const notes = await helper.notesInDb();
         expect(notes.length).toBe(3);
         expect(notes[notes.length - 1].content).toBe('test content');
      } finally {
         Note.findByIdAndDelete(newNote.body.id);
      }
   });

   it('should create a new Note with none selected important status', async () => {
      const payload = { content: 'test content 2' };
      const newNote = await api.post('/api/notes').send(payload);
      try {
         expect(newNote.status).toBe(201);
         expect(newNote.body.content).toBe('test content 2');
         expect(newNote.body.important).toBe(false);

         const notes = await helper.notesInDb();
         expect(notes.length).toBe(3);
         expect(notes[notes.length - 1].content).toBe('test content 2');
      } finally {
         await Note.findOneAndDelete(newNote.body.id);
      }
   });

   it('should delete a note by ID', async () => {
      const noteToDelete = await Note.create({ content: 'test content 2', important: false });

      await api.delete(`/api/notes/${noteToDelete._id}`).expect(204);

      const deletedNote = await Note.findById(noteToDelete._id);
      expect(deletedNote).toBeNull();
      const notes = await helper.notesInDb();
      expect(notes).toHaveLength(2);
   });

   it('should return 404 when trying to delete a non-existent note by ID', async () => {
      const nonExistentId = helper.nonExistingId();
      await api.delete(`/api/notes/${nonExistentId}`).expect(404);
   });

   describe('when there is initially one user in db', () => {
      beforeEach(async () => {
         await User.deleteMany({});

         const user = new User({ username: 'root', password: 'test' });

         await user.save();
      });

      test('creation succeeds with a fresh username', async () => {
         const usersAtStart = await helper.usersInDb();

         const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
         };

         await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

         const usersAtEnd = await helper.usersInDb();
         expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

         const usernames = usersAtEnd.map((u) => u.username);
         expect(usernames).toContain(newUser.username);
      });
      test('creation fails with proper statuscode and message if username already taken', async () => {
         const usersAtStart = await helper.usersInDb();

         const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
         };

         const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

         expect(result.body.error).toContain('expected `username` to be unique');

         const usersAtEnd = await helper.usersInDb();
         expect(usersAtEnd).toEqual(usersAtStart);
      });
   });

   afterAll(async () => {
      await mongoose.connection.close();
   });
});
