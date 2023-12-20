const express = require('express');
const Blog = require('../modules/blog');
const User = require('../modules/user');

const testingRoute = express.Router();

testingRoute.post('/resetDb', async (req, res) => {
   await Blog.deleteMany({});
   await User.deleteMany({});
   return res.status(204).end();
});
module.exports = testingRoute;
