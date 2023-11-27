const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../modules/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('Blog API', () => {
   beforeEach(async () => {
      await User.deleteMany({});
   });

   afterAll(async () => {
      await mongoose.disconnect();
   });
   describe('User API', () => {
      describe('GET /api/users', () => {
         it('should return users as JSON', async () => {
            const response = await api
               .get('/api/users')
               .expect(200)
               .expect('Content-Type', /application\/json/);
            expect(response.body).toEqual([]);
         });

         it('should return all users', async () => {
            const usersData = [
               { username: 'user1', password: 'password1', name: 'User One' },
               { username: 'user2', password: 'password2', name: 'User Two' },
            ];

            await User.insertMany(usersData);

            const response = await api
               .get('/api/users')
               .expect(200)
               .expect('Content-Type', /application\/json/);
            expect(response.body).toHaveLength(usersData.length);
            const usernames = response.body.map((user) => user.username);
            expect(usernames).toContain('user1');
            expect(usernames).toContain('user2');
         });
      });

      describe('POST /api/users', () => {
         it('should create a new user with valid data', async () => {
            const newUser = { username: 'newuser', password: 'newpassword', name: 'New User' };

            const response = await api
               .post('/api/users')
               .send(newUser)
               .expect(201)
               .expect('Content-Type', /application\/json/);

            expect(response.body.username).toBe(newUser.username);
            expect(response.body.name).toBe(newUser.name);

            const users = await helper.allUsers();
            expect(users).toHaveLength(1);
            expect(users[0].username).toBe(newUser.username);
         });
         it('should save hashed password to the database', async () => {
            const response = await api.post('/api/users').send({ username: 'testuser', password: 'password123', name: 'Test User' });

            expect(response.status).toBe(201);

            const savedUser = await User.findById(response.body._id);
            expect(savedUser).toBeDefined();
            expect(savedUser.password).not.toBe('password123');
         });
         it('should return 400 if username or password is missing', async () => {
            const invalidUserData = { name: 'Invalid User' };

            const response = await api
               .post('/api/users')
               .send(invalidUserData)
               .expect(400)
               .expect('Content-Type', /application\/json/);

            expect(response.body.error).toBe('username and password is required');

            const users = await helper.allUsers();
            expect(users).toHaveLength(0);
         });

         it('should handle existing user error', async () => {
            const existingUser = { username: 'existinguser', password: 'password', name: 'Existing User' };
            await User.create(existingUser);

            const duplicateUser = { username: 'existinguser', password: 'newpassword', name: 'Duplicate User' };

            const response = await api
               .post('/api/users')
               .send(duplicateUser)
               .expect(400)
               .expect('Content-Type', /application\/json/);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toBe('User already exists');
            const users = await helper.allUsers();
            expect(users).toHaveLength(1);
         });
         it('should return validation error when set username char less then 3', async () => {
            const payload = { username: 'ab', password: 'testPassowrd' };
            const response = await api
               .post('/api/users')
               .send(payload)
               .expect(400)
               .expect('Content-Type', /application\/json/);
            expect(response.body.error).toBe('Username must be at least 3 characters long');
         });
         it('should return validation error when set password char less then 3', async () => {
            const payload = { username: 'testUser', password: 'ab' };
            const response = await api
               .post('/api/users')
               .send(payload)
               .expect(400)
               .expect('Content-Type', /application\/json/);
            expect(response.body.error).toBe('Password must be at least 3 characters long');
         });
      });
   });
});
