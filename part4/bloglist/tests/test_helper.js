const jwt = require('jsonwebtoken');
const Blog = require('../modules/blog');
const User = require('../modules/user');
const { SECRIT_KEY } = require('../utils/config');
const config = require('../utils/config');
const initialBlogs = [
   {
      title: 'The Art of Coding',
      author: 'CodeMaster42',
      url: 'https://codemaster42.blog/the-art-of-coding',
      likes: 25,
   },
   {
      title: 'Cooking Adventures',
      author: 'ChefExplorer',
      url: 'https://chefexplorer.com/cooking-adventures',
      likes: 15,
   },
];
const allBlogs = async () => {
   const blogs = await Blog.find({});
   return blogs;
};
const allUsers = async () => {
   const user = await User.find({});
   return user;
};

const nonExistingId = async () => {
   const blog = new Blog({ title: 'willremovethissoon', author: 'test author', url: 'https://example.com' });
   await blog.save();
   await blog.deleteOne();
   return blog._id.toString();
};
const expireToken = async () => {
   const user = await User.create({ username: 'expName', password: 'expPass' });
   const pastExpirationTime = Math.floor(Date.now() / 1000) - 60 * 60;
   const payload = {
      username: user.username,
      id: user.id,
      exp: pastExpirationTime,
   };

   return jwt.sign(payload, SECRIT_KEY);
};
const createToken = (user) => {
   const token = jwt.sign({ username: user.username, id: user.id }, SECRIT_KEY, { expiresIn: '5m' });
   return token;
};
const SECRET_KEY = config.SECRIT_KEY;
module.exports = {
   allBlogs,
   nonExistingId,
   initialBlogs,
   allUsers,
   expireToken,
   createToken,
   SECRET_KEY,
};
