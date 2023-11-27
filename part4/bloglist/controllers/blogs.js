const express = require('express');
const Blog = require('../modules/blog');
const middleware = require('../utils/middleware');

const blogRoute = express.Router();

blogRoute.get('/', async (req, res, next) => {
   try {
      const blogs = await Blog.find({}).populate('user');
      return res.status(200).json(blogs);
   } catch (err) {
      return next(err);
   }
});

blogRoute.get('/:id', async (req, res, next) => {
   const { id } = req.params;
   try {
      const blog = await Blog.findById(id);
      if (blog) return res.status(200).json(blog);
      return next({ name: 'CastError', message: 'Not found blog' });
   } catch (err) {
      return next(err);
   }
});

blogRoute.post('/', middleware.userExtractor, async (req, res, next) => {
   try {
      const { title, url, likes } = req.body;

      if (!title || !url) {
         return res.status(400).json({ error: 'Title and URL are required fields.' });
      }

      const { user } = req;

      const blog = new Blog({
         title,
         url,
         likes: likes || 0,
         user: user.id,
      });

      const savedBlog = await blog.save();

      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
      return res.status(201).json(savedBlog);
   } catch (err) {
      return next(err);
   }
});

blogRoute.delete('/:id', middleware.userExtractor, async (req, res, next) => {
   const { id } = req.params;

   try {
      const { user } = req;

      const blog = await Blog.findById(id);

      if (!blog) {
         return next({ name: 'CastError', message: 'Not found blog' });
      }

      if (user.id.toString() !== blog.user.toString()) {
         return res.status(403).json({ error: 'Permission denied' });
      }

      user.blogs = user.blogs.filter((b) => b.id !== blog.id);
      await user.save();

      await blog.deleteOne();
      return res.status(204).end();
   } catch (err) {
      return next(err);
   }
});

blogRoute.patch('/:id', middleware.userExtractor, async (req, res, next) => {
   const { id } = req.params;
   const update = req.body;

   try {
      const { user } = req;

      const blog = await Blog.findById(id);

      if (!blog) {
         return next({ name: 'CastError', message: 'Not found blog' });
      }

      if (user.id !== blog.user.toString()) {
         return res.status(403).json({ error: 'Permission denied' });
      }

      const updatedBlog = await Blog.findByIdAndUpdate(id, update, { new: true });

      if (updatedBlog) {
         return res.status(200).json(updatedBlog);
      }
      return next({ name: 'CastError', message: 'Not found blog' });
   } catch (err) {
      return next(err);
   }
});

module.exports = blogRoute;
