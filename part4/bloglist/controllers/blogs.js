const express = require('express');
const Blog = require('../modules/blog');

const bolgRoute = express.Router();

bolgRoute.get('/', async (req, res, next) => {
   try {
      const blogs = await Blog.find({});
      return res.status(200).json(blogs);
   } catch (err) {
      return next(err);
   }
});

bolgRoute.get('/:id', async (req, res, next) => {
   const { id } = req.params;
   try {
      const blog = await Blog.findById(id);
      return res.status(200).json(blog);
   } catch (err) {
      return next(err);
   }
});

bolgRoute.post('/', async (req, res, next) => {
   try {
      const {
         title, author, url, likes,
      } = req.body;

      // Validation - Check if required fields are present
      if (!title || !author || !url) {
         return res.status(400).json({ error: 'Title, author, and URL are required fields.' });
      }

      const blog = new Blog({
         title, author, url, likes,
      });
      const savedBlog = await blog.save();
      return res.status(201).json(savedBlog);
   } catch (err) {
      return next(err);
   }
});

bolgRoute.delete('/:id', async (req, res, next) => {
   const { id } = req.params;
   try {
      await Blog.findByIdAndRemove(id);
      return res.status(204).end();
   } catch (err) {
      return next(err);
   }
});

bolgRoute.patch('/:id', async (req, res, next) => {
   const { id } = req.params;
   const update = req.body;
   try {
      const updatedBlog = await Blog.findByIdAndUpdate(id, update, { new: true });
      return res.status(200).json(updatedBlog);
   } catch (err) {
      return next(err);
   }
});

module.exports = bolgRoute;
