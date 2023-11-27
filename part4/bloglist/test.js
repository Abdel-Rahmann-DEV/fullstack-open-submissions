const jwt = require('jsonwebtoken');
const config = require('./utils/config');

const { SECRIT_KEY } = config;

const payload = {
   id: '655af4487f0cffb361486cb3',
   username: 'Abdo',
};

const token = jwt.sign(payload, SECRIT_KEY, { expiresIn: '1h' });
console.log(token);
