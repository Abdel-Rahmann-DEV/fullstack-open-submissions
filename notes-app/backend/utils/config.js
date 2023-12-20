require('dotenv').config();

const { PORT } = process.env;
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const SECRET_KEY = process.env.NODE_ENV === 'test' ? process.env.SECRET_KEY_FOR_TEST : process.env.SECRET_KEY;
const ENV = process.env.NODE_ENV;
module.exports = {
   MONGODB_URI,
   PORT,
   SECRET_KEY,
   ENV,
};
