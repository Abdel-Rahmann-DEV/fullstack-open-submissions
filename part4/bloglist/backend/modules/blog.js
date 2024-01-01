const mongoose = require('mongoose');

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
   comments: [
      {
         text: {
            type: String,
            required: true,
         },
      },
   ],
   usersLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
});

blogSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
