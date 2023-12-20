const supertest = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../modules/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('Blog API', () => {
   beforeEach(async () => {
      await User.deleteMany({});
      const user = new User({ username: 'testuser', password: 'password123' });
      await user.save();
   });

   afterAll(async () => {
      await mongoose.disconnect();
   });
   describe('Login API', () => {
      it('should hash the password correctly', async () => {
         const user = await User.findOne({ username: 'testuser' });
         expect(user).toBeDefined();
         expect(await bcrypt.compare('password123', user.password)).toBe(true);
      });

      it('should return a valid token with correct payload and expiration date', async () => {
         const credentials = {
            username: 'testuser',
            password: 'password123',
         };

         const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(200)
            .expect('Content-Type', /application\/json/);

         const { token } = response.body;

         // Verify token
         const decodedToken = jwt.verify(token, helper.SECRET_KEY);

         expect(decodedToken.username).toBe(credentials.username);
         expect(decodedToken.id).toBeDefined();

         // Check token expiration time
         const expirationTimeInSeconds = decodedToken.exp - decodedToken.iat;
         expect(expirationTimeInSeconds).toBe(60 * 60); // 1 hour in seconds
      });
      it('should return a token on successful login', async () => {
         const credentials = {
            username: 'testuser',
            password: 'password123',
         };

         const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(200)
            .expect('Content-Type', /application\/json/);

         expect(response.body.token).toBeDefined();
         expect(response.body.user.username).toBe(credentials.username);

         const decodedToken = jwt.verify(response.body.token, helper.SECRET_KEY);
         expect(decodedToken.username).toBe(credentials.username);
      });

      it('should return 400 if username or password is missing', async () => {
         const response = await api
            .post('/api/login')
            .send({ username: 'testuser' })
            .expect(400)
            .expect('Content-Type', /application\/json/);

         expect(response.body.error).toBe('Username and password are required!');
      });

      it('should return 401 if username is not found', async () => {
         const credentials = {
            username: 'nonexistentuser',
            password: 'password123',
         };

         const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /application\/json/);

         expect(response.body.error).toBe('Invalid username or password');
      });

      it('should return 401 if password is incorrect', async () => {
         const credentials = {
            username: 'testuser',
            password: 'wrongpassword',
         };

         const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /application\/json/);

         expect(response.body.error).toBe('Invalid username or password');
      });
   });
});
