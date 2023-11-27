const config = require('./config');

const info = (...params) => {
   if (config.INVAIROMENT === 'development') {
      console.log(...params);
   }
};

const error = (...params) => {
   if (config.INVAIROMENT === 'development') {
      console.error(...params);
   }
};

module.exports = {
   info,
   error,
};
