const NOT_TEST_ENV = process.env.NODE_ENV !== 'test';

const info = (...params) => {
   if (NOT_TEST_ENV) console.log(...params);
};

const error = (...params) => {
   if (NOT_TEST_ENV) console.error(...params);
};

module.exports = {
   info,
   error,
};
