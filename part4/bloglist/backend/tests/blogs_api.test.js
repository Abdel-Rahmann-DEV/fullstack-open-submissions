const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../modules/blog');
const User = require('../modules/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
   await Blog.deleteMany({});
   await User.deleteMany({});
   await Blog.insertMany(helper.initialBlogs);
});

afterAll(async () => {
   await mongoose.disconnect();
});

describe('Blog API', () => {
   describe('GET /api/blogs', () => {
      it('should return blogs in JSON format and correct length', async () => {
         const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
         expect(response.body).toHaveLength(helper.initialBlogs.length);
      });

      it('should return all blogs when requesting all blogs', async () => {
         const response = await api.get('/api/blogs');
         expect(response.body).toHaveLength(helper.initialBlogs.length);
      });

      it('should contain a specific blog in the list', async () => {
         const response = await api.get('/api/blogs');
         const titles = response.body.map((blog) => blog.title);
         expect(titles).toContain('The Art of Coding');
      });

      it('should have defined IDs for each blog', async () => {
         const blogs = await helper.allBlogs();
         const randomBlog = blogs[0];
         expect(randomBlog.id).toBeDefined();
      });
   });

   describe('GET /api/blogs/:id', () => {
      it('should retrieve a specific blog by ID', async () => {
         const newUser = await User.create({ username: 'test', password: 'test' });
         const newBlog = await Blog.create({ title: 'Test Blog', url: 'https://example.com/test', user: newUser.id });
         const response = await api
            .get(`/api/blogs/${newBlog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

         expect(response.body.title).toBe('Test Blog');
         expect(response.body.user).toBe(newUser.id);
         expect(response.body.url).toBe('https://example.com/test');
      });

      it('should return 404 if blog ID is not found', async () => {
         const nonExistingId = await helper.nonExistingId();
         await api.get(`/api/blogs/${nonExistingId}`).expect(404);
      });
   });

   describe('POST /api/blogs', () => {
      let user;
      let token;

      beforeEach(async () => {
         user = await User.create({ username: 'test', password: 'test' });
         token = helper.createToken(user);
      });

      it('should create a new blog with valid data', async () => {
         const newBlogData = { title: 'New Blog', url: 'https://example.com/new-blog', likes: 5 };
         const response = await api
            .post('/api/blogs')
            .send(newBlogData)
            .set('authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);

         const blogs = await helper.allBlogs();
         expect(response.body.title).toBe('New Blog');
         expect(response.body.url).toBe('https://example.com/new-blog');
         expect(response.body.likes).toBe(5);
         expect(response.body.user).toBe(user.id);
         expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
         expect(blogs.map((e) => e.title)).toContain('New Blog');
      });

      it('should set likes to 0 if likes are missing from the request body', async () => {
         const newBlogData = { title: 'New Blog', url: 'https://example.com/new-blog' };
         const response = await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(newBlogData)
            .expect(201)
            .expect('Content-Type', /application\/json/);
         expect(response.body.likes).toBeDefined();
         expect(response.body.likes).toBe(0);
      });

      it('should return 400 if required fields (title and URL) are missing', async () => {
         const invalidBlogData = { url: 'https://example.com/missing-title' };
         const response = await api.post('/api/blogs').send(invalidBlogData).set('authorization', `bearer ${token}`).expect(400);
         expect(response.body.error).toBe('Title and URL are required fields.');
      });

      it('should handle missing token error when creating a blog', async () => {
         const newBlogData = { title: 'New Blog', url: 'https://example.com/new-blog', likes: 5 };
         const response = await api
            .post('/api/blogs')
            .send(newBlogData)
            .expect(401)
            .expect('Content-Type', /application\/json/);
         expect(response.body.error).toBe('Token missing');
      });

      it('should handle invalid token error when creating a blog', async () => {
         const invalidToken = 'invalidTokenTest';
         const newBlogData = { title: 'New Blog', url: 'https://example.com/new-blog', likes: 5 };
         const response = await api
            .post('/api/blogs')
            .send(newBlogData)
            .set('authorization', `bearer ${invalidToken}`)
            .expect(401)
            .expect('Content-Type', /application\/json/);
         expect(response.body.error).toBe('Invalid token');
      });

      it('should handle expired token error when creating a blog', async () => {
         const expiredToken = await helper.expireToken();
         const newBlogData = { title: 'New Blog', url: 'https://example.com/new-blog', likes: 5 };
         const response = await api
            .post('/api/blogs')
            .send(newBlogData)
            .set('authorization', `bearer ${expiredToken}`)
            .expect(401)
            .expect('Content-Type', /application\/json/);
         expect(response.body.error).toBe('Token expired');
      });

      it('should return 404 when trying to create a blog with a non-existing user', async () => {
         await user.deleteOne();
         const blogData = { title: 'New Blog', url: 'https://example.com/new-blog' };
         const response = await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(blogData)
            .expect(404)
            .expect('Content-Type', /application\/json/);
         expect(response.body.error).toBe('Malformatted id');
      });
   });

   describe('DELETE /api/blogs/:id', () => {
      let token;
      let existingUser;
      let blogToDelete;

      beforeEach(async () => {
         await Blog.deleteMany({});
         await User.deleteMany({});

         existingUser = await User.create({ username: 'test', password: 'test' });
         token = helper.createToken(existingUser);

         blogToDelete = await Blog.create({
            title: 'Blog to Delete',
            user: existingUser.id,
            url: 'https://example.com/delete-blog',
         });
      });

      it('should delete a blog with a valid token and user ownership', async () => {
         await api.delete(`/api/blogs/${blogToDelete.id}`).set('authorization', `bearer ${token}`).expect(204);

         // Assert that the blog is no longer in the database
         const deletedBlog = await Blog.findById(blogToDelete.id);
         expect(deletedBlog).toBeNull();

         // Check if the deleted blog is removed from the user's blogs field
         const updatedUser = await User.findById(existingUser.id).populate('blogs');
         const blogIds = updatedUser.blogs.map((blog) => blog.id);
         expect(blogIds).not.toContain(blogToDelete.id);
      });

      it('should return 404 if blog ID is not found', async () => {
         const nonExistentId = await helper.nonExistingId();
         const response = await api.delete(`/api/blogs/${nonExistentId}`).set('authorization', `bearer ${token}`).expect(404);
         expect(response.body.error).toBe('Malformatted id');
      });

      it('should return 401 if token is missing', async () => {
         const response = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
         expect(response.body.error).toBe('Token missing');
      });

      it('should return 401 if token is invalid', async () => {
         const invalidToken = 'invalidTokenTest';
         const response = await api.delete(`/api/blogs/${blogToDelete.id}`).set('authorization', `bearer ${invalidToken}`).expect(401);
         expect(response.body.error).toBe('Invalid token');
      });

      it('should return 401 if token is expired', async () => {
         const expiredToken = await helper.expireToken();
         const response = await api.delete(`/api/blogs/${blogToDelete.id}`).set('authorization', `bearer ${expiredToken}`).expect(401);
         expect(response.body.error).toBe('Token expired');
      });

      it('should return 403 if user does not own the blog', async () => {
         const anotherUser = await User.create({ username: 'another', password: 'test' });
         const anotherUserToken = helper.createToken(anotherUser);
         const response = await api.delete(`/api/blogs/${blogToDelete.id}`).set('authorization', `bearer ${anotherUserToken}`).expect(403);
         expect(response.body.error).toBe('Permission denied');
      });

      it('should return 404 if user does not exist', async () => {
         await existingUser.deleteOne();
         const response = await api.delete(`/api/blogs/${blogToDelete.id}`).set('authorization', `bearer ${token}`).expect(404);
         expect(response.body.error).toBe('Malformatted id');
      });
   });

   describe('PATCH /api/blogs/:id', () => {
      let token;
      let existingUser;
      let blogToUpdate;

      beforeEach(async () => {
         await Blog.deleteMany({});
         await User.deleteMany({});

         existingUser = await User.create({ username: 'test', password: 'test' });
         token = helper.createToken(existingUser);

         blogToUpdate = await Blog.create({
            title: 'Blog to Update',
            user: existingUser.id,
            url: 'https://example.com/update-blog',
         });
      });

      it('should update a blog with a valid token and user ownership', async () => {
         const updateData = { title: 'Updated Blog', likes: 10 };

         await api
            .patch(`/api/blogs/${blogToUpdate.id}`)
            .send(updateData)
            .set('authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

         // Assert that the blog is updated in the database
         const updatedBlog = await Blog.findById(blogToUpdate.id);
         expect(updatedBlog.title).toBe('Updated Blog');
         expect(updatedBlog.likes).toBe(10);
      });

      it('should return 404 if blog ID is not found', async () => {
         const nonExistentId = await helper.nonExistingId();
         const updateData = { title: 'Updated Blog', likes: 10 };

         const response = await api.patch(`/api/blogs/${nonExistentId}`).send(updateData).set('authorization', `bearer ${token}`).expect(404);

         expect(response.body.error).toBe('Malformatted id');
      });

      it('should return 401 if token is missing', async () => {
         const response = await api.patch(`/api/blogs/${blogToUpdate.id}`).send({ title: 'Updated Blog', likes: 10 }).expect(401);

         expect(response.body.error).toBe('Token missing');
      });

      it('should return 401 if token is invalid', async () => {
         const invalidToken = 'invalidTokenTest';
         const response = await api.patch(`/api/blogs/${blogToUpdate.id}`).send({ title: 'Updated Blog', likes: 10 }).set('authorization', `bearer ${invalidToken}`).expect(401);

         expect(response.body.error).toBe('Invalid token');
      });

      it('should return 401 if token is expired', async () => {
         const expiredToken = await helper.expireToken();
         const response = await api.patch(`/api/blogs/${blogToUpdate.id}`).send({ title: 'Updated Blog', likes: 10 }).set('authorization', `bearer ${expiredToken}`).expect(401);

         expect(response.body.error).toBe('Token expired');
      });

      it('should return 403 if user does not own the blog', async () => {
         const anotherUser = await User.create({ username: 'another', password: 'test' });
         const anotherUserToken = helper.createToken(anotherUser);
         const response = await api.patch(`/api/blogs/${blogToUpdate.id}`).send({ title: 'Updated Blog', likes: 10 }).set('authorization', `bearer ${anotherUserToken}`).expect(403);

         expect(response.body.error).toBe('Permission denied');
      });

      it('should return 404 if user does not exist', async () => {
         await existingUser.deleteOne();
         const response = await api.patch(`/api/blogs/${blogToUpdate.id}`).send({ title: 'Updated Blog', likes: 10 }).set('authorization', `bearer ${token}`).expect(404);

         expect(response.body.error).toBe('Malformatted id');
      });
   });
});
