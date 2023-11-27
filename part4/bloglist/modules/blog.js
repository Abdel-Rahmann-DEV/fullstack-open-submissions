const mongoose = require('mongoose');

// Define the Note Schema
const blogSchema = new mongoose.Schema({
   title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters long'],
   },
   url: {
      type: String,
      required: [true, 'URL is required'],
      match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, 'Invalid URL format. Please provide a valid URL.'],
   },
   likes: {
      type: Number,
      default: 0,
      min: 0,
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
