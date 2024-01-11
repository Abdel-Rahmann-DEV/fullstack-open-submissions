const NODE_ENV = process.env.NODE_ENV;
const MONGODB_URI = NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const payload = {
   MONGODB_URI,
   JWT_SECRET,
};
module.exports = payload;
