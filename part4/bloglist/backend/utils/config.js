require('dotenv').config();

const { PORT } = process.env;
const SECRIT_KEY = process.env.NODE_ENV === 'test' ? process.env.SECRIT_KEY_FOR_TEST : process.env.SECRIT_KEY;
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_FOR_TEST : process.env.MONGODB_URI;
const INVAIROMENT = process.env.NODE_ENV;
module.exports = {
   MONGODB_URI,
   PORT,
   INVAIROMENT,
   SECRIT_KEY,
};
