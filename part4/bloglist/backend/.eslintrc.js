module.exports = {
   extends: 'airbnb-base',
   rules: {
      indent: ['error', 3],
      'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
   },
   env: {
      commonjs: true,
      es2021: true,
      node: true,
      jest: true,
   },
};
