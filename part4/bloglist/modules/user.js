const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      unique: [true, 'user alrady exsist'],
      required: true,
      minlength: [3, 'Username must be at least 3 characters long'],
   },
   name: {
      type: String,
   },
   password: {
      type: String,
      required: true,
      minlength: [3, 'Password must be at least 3 characters long'],
   },
   blogs: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Blog',
      },
   ],
});

userSchema.pre('save', async function (next) {
   const user = this;

   if (user.isModified('password')) {
      const saltRounds = 12;
      user.password = await bcrypt.hash(user.password, saltRounds);
   }

   next();
});

const Blog = mongoose.model('User', userSchema);

module.exports = Blog;
